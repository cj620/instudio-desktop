export type BackfillScan<TUsage> = { highWater: number; usage: TUsage[] }

export type HybridThreadBackfillDeps<TUsage> = {
  indexedRows: () => Array<{ id: string; usage_backfilled?: number }>
  filesystemThreadIds: () => Promise<string[]>
  readMissingThread: (threadId: string) => Promise<boolean>
  scanEvents: (threadId: string) => Promise<BackfillScan<TUsage>>
  upsertMissing: (threadId: string, highWater: number) => Promise<void>
  noteExistingHighWater: (threadId: string, highWater: number) => void
  insertUsage: (threadId: string, usage: TUsage[]) => Promise<void>
  markUsageBackfilled: (threadId: string) => void
  threadDirectoryExists: (threadId: string) => Promise<boolean>
  deleteIndexRow: (threadId: string) => void
  yieldToEventLoop: () => Promise<void>
  warn: (action: string, error: unknown) => void
}

/** Single-flight owner for startup index/usage recovery and stale-row cleanup. */
export class HybridThreadBackfillCoordinator<TUsage> {
  private promise: Promise<void> | null = null
  constructor(private readonly deps: HybridThreadBackfillDeps<TUsage>) {}

  start(): void {
    if (this.promise) return
    this.promise = this.run().catch((error) => this.deps.warn('background backfill', error))
  }

  async wait(): Promise<void> { await this.promise }

  private async run(): Promise<void> {
    const rows = this.deps.indexedRows()
    const indexed = new Map(rows.map((row) => [row.id, row.usage_backfilled === 1]))
    for (const threadId of await this.deps.filesystemThreadIds()) {
      const usageBackfilled = indexed.get(threadId)
      if (usageBackfilled === true) continue
      if (usageBackfilled === undefined && !(await this.deps.readMissingThread(threadId))) continue
      const scan = await this.deps.scanEvents(threadId)
      if (usageBackfilled === undefined) await this.deps.upsertMissing(threadId, scan.highWater)
      else this.deps.noteExistingHighWater(threadId, scan.highWater)
      await this.deps.insertUsage(threadId, scan.usage)
      this.deps.markUsageBackfilled(threadId)
      await this.deps.yieldToEventLoop()
    }
    try {
      for (const row of rows) if (!(await this.deps.threadDirectoryExists(row.id))) this.deps.deleteIndexRow(row.id)
    } catch (error) { this.deps.warn('backfill cleanup', error) }
  }
}
