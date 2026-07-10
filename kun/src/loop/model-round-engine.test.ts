import { describe, expect, it } from 'vitest'
import type { ModelStreamChunk } from '../ports/model-client.js'
import { ModelRoundEngine, type ModelRoundEngineDeps } from './model-round-engine.js'

const usage = {
  promptTokens: 3,
  completionTokens: 2,
  totalTokens: 5,
  cacheHitRate: null,
  turns: 1
}

function chunks(values: readonly ModelStreamChunk[]): AsyncIterable<ModelStreamChunk> {
  return {
    async *[Symbol.asyncIterator]() {
      yield* values
    }
  }
}

function harness(values: readonly ModelStreamChunk[]) {
  const trace: string[] = []
  let id = 0
  let streamFactory = (): AsyncIterable<ModelStreamChunk> => chunks(values)
  const deps: ModelRoundEngineDeps = {
    model: {
      stream: () => streamFactory()
    },
    events: {
      record: async (event) => { trace.push(`event:${event.kind}`) }
    },
    turns: {
      applyItem: async (_threadId, item) => { trace.push(`item:${item.kind}`) }
    },
    usage: {
      record: () => {
        trace.push('usage:record')
        return usage
      }
    },
    telemetry: {
      recordPromptPressure: () => { trace.push('telemetry:pressure') }
    },
    ids: {
      next: (prefix) => `${prefix}_${++id}`
    },
    recordPipelineStage: async (_threadId, _turnId, stage) => { trace.push(`stage:${stage}`) },
    recordGoalUsage: async () => { trace.push('goal:usage') },
    rememberFailure: () => { trace.push('failure') },
    recordToolCallLimit: async () => { trace.push('limit') }
  }
  const engine = new ModelRoundEngine(deps)
  const controller = new AbortController()
  return {
    trace,
    controller,
    engine,
    setStream: (next: () => AsyncIterable<ModelStreamChunk>) => { streamFactory = next },
    run: () => engine.run({
      threadId: 'thread_1',
      turnId: 'turn_1',
      signal: controller.signal,
      request: {
        threadId: 'thread_1',
        turnId: 'turn_1',
        model: 'model_1',
        prefix: [],
        history: [],
        tools: [],
        abortSignal: controller.signal
      },
      maxToolCallsPerStep: 1,
      streamToolMetadata: new Map([['read', { providerId: 'builtin' }]]),
      cacheSignature: {
        model: 'model_1', providerId: 'builtin', endpointFormat: 'openai', prefixFingerprint: 'prefix',
        toolCatalogFingerprint: 'tools', activeSkillIds: []
      },
      preSendDetails: { model: 'model_1' },
      postSendDetails: { model: 'model_1' },
      writeGeneratedImage: async () => {
        trace.push('image:write')
        return { markdown: '\n![generated image](generated.png)\n' }
      }
    })
  }
}

describe('ModelRoundEngine', () => {
  it('preserves stream side-effect order through final persistence', async () => {
    const test = harness([
      { kind: 'assistant_reasoning_delta', text: 'think' },
      { kind: 'assistant_text_delta', text: 'answer' },
      { kind: 'tool_call_complete', callId: 'call_1', toolName: 'read', arguments: {} },
      { kind: 'usage', usage },
      { kind: 'completed', stopReason: 'tool_calls' }
    ])

    await expect(test.run()).resolves.toEqual(expect.objectContaining({
      kind: 'drained', snapshot: expect.objectContaining({ stopReason: 'tool_calls' })
    }))
    expect(test.trace).toEqual([
      'stage:pre_send',
      'stage:post_send',
      'event:assistant_reasoning_delta',
      'event:assistant_text_delta',
      'item:tool_call',
      'event:tool_call_ready',
      'telemetry:pressure',
      'usage:record',
      'goal:usage',
      'event:usage',
      'stage:response_received',
      'item:assistant_reasoning',
      'item:assistant_text'
    ])
  })

  it('does not emit response_received after a per-step tool limit', async () => {
    const test = harness([
      { kind: 'tool_call_complete', callId: 'call_1', toolName: 'read', arguments: {} },
      { kind: 'tool_call_complete', callId: 'call_2', toolName: 'read', arguments: {} }
    ])

    await expect(test.run()).resolves.toEqual({ kind: 'failed' })
    expect(test.trace).toEqual([
      'stage:pre_send',
      'stage:post_send',
      'item:tool_call',
      'event:tool_call_ready',
      'failure',
      'limit'
    ])
  })

  it('persists accumulated output but does not consume buffered calls after abort', async () => {
    const test = harness([])
    const stream = async function *(): AsyncIterable<ModelStreamChunk> {
      yield { kind: 'assistant_text_delta', text: 'partial' }
      test.controller.abort()
      yield { kind: 'tool_call_complete', callId: 'call_1', toolName: 'read', arguments: {} }
    }
    test.setStream(() => stream())

    await expect(test.run()).resolves.toEqual({ kind: 'aborted' })
    expect(test.trace).toEqual([
      'stage:pre_send',
      'stage:post_send',
      'event:assistant_text_delta',
      'item:assistant_text'
    ])
  })

  it('writes an image before it becomes an assistant text delta', async () => {
    const test = harness([
      { kind: 'image_generation_complete', imageBase64: 'aW1hZ2U=', mimeType: 'image/png' },
      { kind: 'completed', stopReason: 'stop' }
    ])

    await expect(test.run()).resolves.toEqual(expect.objectContaining({ kind: 'drained' }))
    expect(test.trace).toEqual([
      'stage:pre_send',
      'stage:post_send',
      'image:write',
      'event:assistant_text_delta',
      'stage:response_received',
      'item:assistant_text'
    ])
  })

  it('drains and persists text after a model error while keeping failure sticky', async () => {
    const test = harness([
      { kind: 'assistant_text_delta', text: 'partial' },
      { kind: 'error', message: 'upstream failed', code: 'upstream' },
      { kind: 'completed', stopReason: 'stop' }
    ])

    await expect(test.run()).resolves.toEqual({ kind: 'failed' })
    expect(test.trace).toEqual([
      'stage:pre_send',
      'stage:post_send',
      'event:assistant_text_delta',
      'failure',
      'event:error',
      'stage:response_received',
      'item:assistant_text'
    ])
  })
})
