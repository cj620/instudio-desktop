import type { ThreadRecord } from '../contracts/threads.js'
import { makeErrorItem } from '../domain/item.js'
import type { ThreadStore } from '../ports/thread-store.js'
import type { RuntimeEventRecorder } from '../services/runtime-event-recorder.js'
import { withThreadStoreMutation } from '../services/thread-mutation-coordinator.js'
import type { TurnService } from '../services/turn-service.js'
import type { UsageService } from '../services/usage-service.js'

export type TurnBudgetGateDeps = {
  threadStore: ThreadStore
  turns: Pick<TurnService, 'applyItem'>
  events: Pick<RuntimeEventRecorder, 'record'>
  usage: Pick<UsageService, 'forThread'>
  nowIso: () => string
}

/** Enforces goal-token and per-thread cost budgets before a model request. */
export class TurnBudgetGate {
  constructor(private readonly deps: TurnBudgetGateDeps) {}

  async check(
    thread: ThreadRecord,
    threadId: string,
    turnId: string
  ): Promise<'allow' | 'blocked'> {
    if (thread.goal?.status === 'usageLimited') {
      await this.deps.events.record({
        kind: 'error',
        threadId,
        turnId,
        message: `Goal token budget exhausted: ${thread.goal.tokensUsed} used of ${thread.goal.tokenBudget ?? 0}.`,
        code: 'goal_token_budget_limited',
        severity: 'warning'
      })
      return 'blocked'
    }
    const budget = thread.costBudgetUsd
    if (typeof budget !== 'number' || !Number.isFinite(budget) || budget <= 0) return 'allow'
    const spent = this.deps.usage.forThread(threadId).costUsd ?? 0
    if (spent >= budget) {
      const message =
        `Cost budget exhausted for this thread: $${spent.toFixed(4)} used of $${budget.toFixed(4)}.`
      await this.deps.turns.applyItem(threadId, makeErrorItem({
        id: `item_${turnId}_budget_limited`,
        threadId,
        turnId,
        message,
        code: 'budget_limited'
      }))
      await this.deps.events.record({
        kind: 'error',
        threadId,
        turnId,
        message,
        code: 'budget_limited'
      })
      return 'blocked'
    }
    if (spent >= budget * 0.8 && thread.costBudgetWarningSent !== true) {
      const message =
        `Cost budget warning: $${spent.toFixed(4)} used of $${budget.toFixed(4)}.`
      const warningMarked = await withThreadStoreMutation(
        this.deps.threadStore,
        threadId,
        async () => {
          const current = await this.deps.threadStore.get(threadId)
          if (!current) return false
          const currentBudget = current.costBudgetUsd
          if (
            typeof currentBudget !== 'number' ||
            !Number.isFinite(currentBudget) ||
            currentBudget <= 0 ||
            spent < currentBudget * 0.8 ||
            current.costBudgetWarningSent === true
          ) {
            return false
          }
          await this.deps.threadStore.upsert({
            ...current,
            costBudgetWarningSent: true,
            updatedAt: this.deps.nowIso()
          })
          return true
        }
      )
      if (!warningMarked) return 'allow'
      await this.deps.turns.applyItem(threadId, makeErrorItem({
        id: `item_${turnId}_budget_warning`,
        threadId,
        turnId,
        message,
        code: 'budget_warning',
        severity: 'warning'
      }))
      await this.deps.events.record({
        kind: 'error',
        threadId,
        turnId,
        message,
        code: 'budget_warning',
        severity: 'warning'
      })
    }
    return 'allow'
  }
}
