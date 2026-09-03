import { Card } from "@/components/ui/Card";
import { SAMPLE_CONFIDENCE_LABEL, sampleConfidence, type Stats } from "@/lib/analysis/stats";

function fmtR(value: number | null): string {
  if (value === null) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}R`;
}

function fmtPercent(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export function StatsSummary({ stats }: { stats: Stats }) {
  const confidence = sampleConfidence(stats.totalCount);

  const tiles: { label: string; value: string }[] = [
    { label: "総数", value: `${stats.totalCount}件` },
    { label: "勝率", value: fmtPercent(stats.winRate) },
    { label: "平均R", value: fmtR(stats.avgR) },
    { label: "期待値", value: fmtR(stats.expectedValue) },
    {
      label: "Profit Factor",
      value: stats.profitFactor === null ? "—" : stats.profitFactor.toFixed(2),
    },
    { label: "最大ドローダウン", value: `${stats.maxDrawdown.toFixed(2)}R` },
    { label: "最大連勝", value: `${stats.maxWinStreak}` },
    { label: "最大連敗", value: `${stats.maxLossStreak}` },
  ];

  return (
    <div className="space-y-3">
      {stats.totalCount > 0 && (
        <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {SAMPLE_CONFIDENCE_LABEL[confidence]}
        </span>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.label} className="p-4">
            <p className="text-xs text-muted-foreground">{tile.label}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{tile.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
