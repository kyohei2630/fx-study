import type { RRecord } from "@/lib/analysis/stats";
import type { Backtest, Trade } from "@/types";

/** R-records for one strategy version, combining closed trades and backtests linked to it. */
export function recordsForVersion(
  trades: Trade[],
  backtests: Backtest[],
  versionId: string
): RRecord[] {
  const fromTrades: RRecord[] = trades
    .filter((t) => t.strategyVersionId === versionId && t.result !== null && t.rMultiple !== null)
    .map((t) => ({ rMultiple: t.rMultiple as number, result: t.result as RRecord["result"] }));

  const fromBacktests: RRecord[] = backtests
    .filter((b) => b.strategyVersionId === versionId)
    .map((b) => ({ rMultiple: b.rMultiple, result: b.result }));

  return [...fromTrades, ...fromBacktests];
}
