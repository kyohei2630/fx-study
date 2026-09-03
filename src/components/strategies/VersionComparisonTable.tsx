import { Card, CardTitle } from "@/components/ui/Card";
import { computeStats } from "@/lib/analysis/stats";
import { recordsForVersion } from "@/lib/analysis/versionStats";
import type { Backtest, StrategyVersion, Trade } from "@/types";

export function VersionComparisonTable({
  versions,
  trades,
  backtests,
}: {
  versions: StrategyVersion[];
  trades: Trade[];
  backtests: Backtest[];
}) {
  const rows = versions.map((v) => ({
    version: v.version,
    stats: computeStats(recordsForVersion(trades, backtests, v.id)),
  }));

  const hasAnyData = rows.some((r) => r.stats.totalCount > 0);

  return (
    <Card>
      <CardTitle>Version比較</CardTitle>
      {!hasAnyData ? (
        <p className="mt-3 text-sm text-muted-foreground">
          まだこの戦略に紐づくトレード・バックテストがありません。
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Version</th>
                <th className="pb-2 font-medium">件数</th>
                <th className="pb-2 font-medium">勝率</th>
                <th className="pb-2 font-medium">平均R</th>
                <th className="pb-2 font-medium">期待値</th>
                <th className="pb-2 font-medium">PF</th>
                <th className="pb-2 font-medium">最大DD</th>
                <th className="pb-2 font-medium">最大連敗</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.version}>
                  <td className="py-2 font-semibold text-foreground">{row.version}</td>
                  <td className="py-2 text-foreground">{row.stats.totalCount}</td>
                  <td className="py-2 text-foreground">
                    {row.stats.winRate === null ? "—" : `${row.stats.winRate.toFixed(0)}%`}
                  </td>
                  <td className="py-2 text-foreground">
                    {row.stats.avgR === null
                      ? "—"
                      : `${row.stats.avgR >= 0 ? "+" : ""}${row.stats.avgR.toFixed(2)}R`}
                  </td>
                  <td
                    className={`py-2 font-medium ${
                      (row.stats.expectedValue ?? 0) >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {row.stats.expectedValue === null
                      ? "—"
                      : `${row.stats.expectedValue >= 0 ? "+" : ""}${row.stats.expectedValue.toFixed(2)}R`}
                  </td>
                  <td className="py-2 text-foreground">
                    {row.stats.profitFactor === null ? "—" : row.stats.profitFactor.toFixed(2)}
                  </td>
                  <td className="py-2 text-foreground">{row.stats.maxDrawdown.toFixed(2)}R</td>
                  <td className="py-2 text-foreground">{row.stats.maxLossStreak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
