import type { CacheRequestSignature } from '../cache/cache-diagnostics.js'
import type { PipelineStage } from '../contracts/events.js'
import type { ModelClient, ModelRequest } from '../ports/model-client.js'
import type { IdGenerator } from '../ports/id-generator.js'
import type { RuntimeEventRecorder } from '../services/runtime-event-recorder.js'
import type { TurnService } from '../services/turn-service.js'
import type { UsageService } from '../services/usage-service.js'
import {
  makeAssistantReasoningItem,
  makeAssistantTextItem,
  makeToolCallItem
} from '../domain/item.js'
import {
  ModelStreamCollector,
  type ModelStreamSnapshot,
  type ModelStreamToolMetadata
} from './model-stream-collector.js'
import type { LoopTelemetry } from './loop-telemetry.js'
import type { TurnExecutionFailure } from './turn-execution-types.js'

export type ModelRoundStreamResult =
  | { kind: 'drained'; snapshot: ModelStreamSnapshot }
  | { kind: 'aborted' }
  | { kind: 'failed' }

export type ModelRoundEngineInput = {
  threadId: string
  turnId: string
  signal: AbortSignal
  request: ModelRequest
  maxToolCallsPerStep: number
  streamToolMetadata: ReadonlyMap<string, ModelStreamToolMetadata>
  maxToolArgumentStringBytes?: number
  cacheSignature: CacheRequestSignature
  preSendDetails: Record<string, unknown>
  postSendDetails: Record<string, unknown>
  writeGeneratedImage: (input: {
    imageBase64: string
    mimeType: string
  }) => Promise<{ markdown: string }>
}

export type ModelRoundEngineDeps = {
  model: Pick<ModelClient, 'stream'>
  events: Pick<RuntimeEventRecorder, 'record'>
  turns: Pick<TurnService, 'applyItem'>
  usage: Pick<UsageService, 'record'>
  telemetry: Pick<LoopTelemetry, 'recordPromptPressure'>
  ids: Pick<IdGenerator, 'next'>
  recordPipelineStage: (
    threadId: string,
    turnId: string,
    stage: Extract<PipelineStage, 'pre_send' | 'post_send' | 'response_received'>,
    details?: Record<string, unknown>
  ) => Promise<void>
  recordGoalUsage: (threadId: string, tokens: number) => Promise<void>
  rememberFailure: (turnId: string, failure: TurnExecutionFailure) => void
  recordToolCallLimit: (threadId: string, turnId: string, message: string) => Promise<void>
}

/**
 * Runs one already-prepared model request and owns only stream-local side
 * effects. The outer AgentLoop retains context resolution, compaction, tool
 * dispatch, and terminal lifecycle ownership.
 */
export class ModelRoundEngine {
  constructor(private readonly deps: ModelRoundEngineDeps) {}

  async run(input: ModelRoundEngineInput): Promise<ModelRoundStreamResult> {
    const collector = new ModelStreamCollector({
      maxToolCallsPerStep: input.maxToolCallsPerStep,
      toolMetadata: input.streamToolMetadata,
      ...(input.maxToolArgumentStringBytes !== undefined
        ? { maxToolArgumentStringBytes: input.maxToolArgumentStringBytes }
        : {})
    })
    let textItemId = ''
    let reasoningItemId = ''
    let persistedReasoning = false
    let persistedText = false
    const persistAccumulatedResponse = async (): Promise<void> => {
      if (!persistedReasoning && collector.reasoning) {
        persistedReasoning = true
        const itemId = reasoningItemId || this.deps.ids.next('item_reasoning')
        await this.deps.turns.applyItem(
          input.threadId,
          makeAssistantReasoningItem({
            id: itemId,
            turnId: input.turnId,
            threadId: input.threadId,
            text: collector.reasoning,
            status: 'completed'
          })
        )
      }
      if (!persistedText && collector.text) {
        persistedText = true
        const itemId = textItemId || this.deps.ids.next('item_text')
        await this.deps.turns.applyItem(
          input.threadId,
          makeAssistantTextItem({
            id: itemId,
            turnId: input.turnId,
            threadId: input.threadId,
            text: collector.text,
            status: 'completed'
          })
        )
      }
    }

    await this.deps.recordPipelineStage(
      input.threadId,
      input.turnId,
      'pre_send',
      input.preSendDetails
    )
    await this.deps.recordPipelineStage(
      input.threadId,
      input.turnId,
      'post_send',
      input.postSendDetails
    )
    for await (const chunk of this.deps.model.stream(input.request)) {
      if (input.signal.aborted) {
        await persistAccumulatedResponse()
        return { kind: 'aborted' }
      }
      const reduction = collector.reduce(chunk)
      if (reduction.terminal) {
        const message = reduction.terminal.message
        this.deps.rememberFailure(input.turnId, {
          error: message,
          code: 'tool_call_limit_exceeded',
          severity: 'warning'
        })
        await this.deps.recordToolCallLimit(input.threadId, input.turnId, message)
        await persistAccumulatedResponse()
        return { kind: 'failed' }
      }
      for (const intent of reduction.intents) {
        switch (intent.kind) {
          case 'assistant_text_delta':
            textItemId ||= this.deps.ids.next('item_text')
            await this.deps.events.record({
              kind: 'assistant_text_delta',
              threadId: input.threadId,
              turnId: input.turnId,
              itemId: textItemId,
              item: makeAssistantTextItem({
                id: textItemId,
                turnId: input.turnId,
                threadId: input.threadId,
                text: intent.text,
                status: 'running'
              })
            })
            break
          case 'assistant_reasoning_delta':
            reasoningItemId ||= this.deps.ids.next('item_reasoning')
            await this.deps.events.record({
              kind: 'assistant_reasoning_delta',
              threadId: input.threadId,
              turnId: input.turnId,
              itemId: reasoningItemId,
              item: makeAssistantReasoningItem({
                id: reasoningItemId,
                turnId: input.turnId,
                threadId: input.threadId,
                text: intent.text,
                status: 'running'
              })
            })
            break
          case 'retrying':
            await this.deps.events.record({
              kind: 'model_request_retry',
              threadId: input.threadId,
              turnId: input.turnId,
              status: intent.status,
              attempt: intent.attempt,
              maxAttempts: intent.maxAttempts,
              delayMs: intent.delayMs
            })
            break
          case 'tool_call_ready': {
            const itemId = `item_tool_${input.turnId}_${intent.call.callId}`
            await this.deps.turns.applyItem(
              input.threadId,
              makeToolCallItem({
                id: itemId,
                turnId: input.turnId,
                threadId: input.threadId,
                callId: intent.call.callId,
                toolName: intent.call.toolName,
                toolKind: intent.call.toolKind,
                arguments: intent.call.arguments,
                ...(intent.repairNotes.length
                  ? { summary: `Repaired tool arguments: ${intent.repairNotes.join('; ')}` }
                  : {})
              })
            )
            await this.deps.events.record({
              kind: 'tool_call_ready',
              threadId: input.threadId,
              turnId: input.turnId,
              itemId,
              callId: intent.call.callId,
              toolName: intent.call.toolName,
              readyCount: collector.toolCallCount
            })
            break
          }
          case 'generated_image': {
            const generated = await input.writeGeneratedImage({
              imageBase64: intent.imageBase64,
              mimeType: intent.mimeType
            })
            const textIntent = collector.appendAssistantText(generated.markdown)
            textItemId ||= this.deps.ids.next('item_text')
            await this.deps.events.record({
              kind: 'assistant_text_delta',
              threadId: input.threadId,
              turnId: input.turnId,
              itemId: textItemId,
              item: makeAssistantTextItem({
                id: textItemId,
                turnId: input.turnId,
                threadId: input.threadId,
                text: textIntent.text,
                status: 'running'
              })
            })
            break
          }
          case 'usage': {
            this.deps.telemetry.recordPromptPressure(
              input.threadId,
              input.request.model,
              intent.usage.promptTokens
            )
            const usage = this.deps.usage.record(input.threadId, intent.usage, input.cacheSignature)
            await this.deps.recordGoalUsage(input.threadId, intent.usage.totalTokens)
            await this.deps.events.record({
              kind: 'usage',
              threadId: input.threadId,
              turnId: input.turnId,
              model: input.request.model,
              usage
            })
            break
          }
          case 'model_error':
            this.deps.rememberFailure(input.turnId, {
              error: intent.message,
              ...(intent.code ? { code: intent.code } : {}),
              severity: 'error'
            })
            await this.deps.events.record({
              kind: 'error',
              threadId: input.threadId,
              turnId: input.turnId,
              message: intent.message,
              code: intent.code,
              severity: 'error'
            })
            break
        }
      }
    }

    if (input.signal.aborted) {
      await persistAccumulatedResponse()
      return { kind: 'aborted' }
    }
    const snapshot = collector.snapshot()
    await this.deps.recordPipelineStage(input.threadId, input.turnId, 'response_received', {
      stopReason: snapshot.stopReason,
      toolCallCount: snapshot.toolCalls.length
    })
    await persistAccumulatedResponse()
    return snapshot.stopReason === 'error'
      ? { kind: 'failed' }
      : { kind: 'drained', snapshot }
  }
}
