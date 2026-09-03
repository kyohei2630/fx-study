import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { breakdownByConditionTag } from "@/lib/analysis/breakdown";
import type { Backtest } from "@/types";

const MIN_SAMPLE = 3;

export function ImprovementHint({ backtests }: { backtests: Backtest[] }) {
  const groups = breakdownByConditionTag(
    backtests.map((b) => ({
      tags: b.entryConditions,
      rMultiple: b.rMultiple,
      result: b.result,
    }))
  ).filter((g) => g.stats.totalCount >= MIN_SAMPLE);

  if (groups.length < 2) return null;

  const best = groups[0];
  const worst = groups[groups.length - 1];

  if ((worst.stats.expectedValue ?? 0) >= 0) return null;
  if ((best.stats.expectedValue ?? 0) <= (worst.stats.expectedValue ?? 0)) return null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <div className="flex items-start gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">改善のヒント</p>
          <p className="mt-1 text-sm text-foreground">
            「{best.label}」は期待値{" "}
            <span className="font-semibold text-success">
              {best.stats.expectedValue!.toFixed(2)}R
            </span>{" "}
            （{best.stats.totalCount}件）である一方、「{worst.label}」は期待値{" "}
            <span className="font-semibold text-danger">
              {worst.stats.expectedValue!.toFixed(2)}R
            </span>{" "}
            （{worst.stats.totalCount}件）でした。
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            サンプル数がまだ少ない場合は参考値です。「{worst.label}」を除外条件に加えた新しいVersionを作成し、
            改めて検証してみることを検討してみましょう。最終的な判断はあなた自身で行ってください。
          </p>
        </div>
      </div>
    </Card>
  );
}
