"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatsSummary } from "@/components/analysis/StatsSummary";
import { CumulativeRChart } from "@/components/analysis/CumulativeRChart";
import { BreakdownChart } from "@/components/analysis/BreakdownChart";
import { backtestsRepo, tradesRepo } from "@/db/repositories";
import { computeStats } from "@/lib/analysis/stats";
import { breakdownByConditionTag, breakdownByWeekday } from "@/lib/analysis/breakdown";
import { cn } from "@/lib/utils";
import type { Backtest, Trade } from "@/types";

type Source = "trades" | "backtests";

export function AnalysisClient() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [backtests, setBacktests] = useState<Backtest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState<Source>("trades");

  useEffect(() => {
    (async () => {
      const [allTrades, allBacktests] = await Promise.all([
        tradesRepo.list(),
        backtestsRepo.list(),
      ]);
      allTrades.sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
      );
      allBacktests.sort((a, b) => a.date.localeCompare(b.date));
      setTrades(allTrades.filter((t) => t.result !== null));
      setBacktests(allBacktests);
      setLoaded(true);

      if (allTrades.filter((t) => t.result !== null).length === 0 && allBacktests.length > 0) {
        setSource("backtests");
      }
    })();
  }, []);

  const records = source === "trades" ? trades : backtests;

  const stats = useMemo(
    () => computeStats(records.map((r) => ({ rMultiple: r.rMultiple ?? 0, result: r.result ?? "breakeven" }))),
    [records]
  );

  const weekdayGroups = useMemo(
    () =>
      breakdownByWeekday(
        records.map((r) => ({
          date: r.date,
          rMultiple: r.rMultiple ?? 0,
          result: r.result ?? "breakeven",
        }))
      ),
    [records]
  );

  const conditionGroups = useMemo(() => {
    if (source !== "backtests") return [];
    return breakdownByConditionTag(
      backtests.map((b) => ({
        tags: b.entryConditions,
        rMultiple: b.rMultiple,
        result: b.result,
      }))
    );
  }, [source, backtests]);

  const bestTags = conditionGroups.filter((g) => (g.stats.expectedValue ?? 0) > 0).slice(0, 3);
  const worstTags = [...conditionGroups]
    .filter((g) => (g.stats.expectedValue ?? 0) < 0)
    .sort((a, b) => (a.stats.expectedValue ?? 0) - (b.stats.expectedValue ?? 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">分析</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          勝率だけでなく、期待値・Profit Factor・Rなど複数指標で評価します。
        </p>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["trades", "トレード記録"],
            ["backtests", "バックテスト"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setSource(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              source === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loaded && records.length === 0 && (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {source === "trades"
              ? "決済済みのトレード記録がまだありません。"
              : "バックテスト記録がまだありません。"}
          </p>
        </Card>
      )}

      {records.length > 0 && (
        <>
          <StatsSummary stats={stats} />
          <CumulativeRChart cumulativeR={stats.cumulativeR} />
          <BreakdownChart
            title="曜日別 期待値"
            description="曜日ごとの期待値（R）。サンプル数が少ない曜日は参考程度に見てください。"
            groups={weekdayGroups}
          />

          {source === "backtests" && conditionGroups.length > 0 && (
            <>
              <BreakdownChart
                title="条件別 期待値"
                description="エントリー条件タグごとの期待値（R）。"
                groups={conditionGroups}
              />

              {(bestTags.length > 0 || worstTags.length > 0) && (
                <Card>
                  <p className="text-sm font-bold text-foreground">勝ちパターン・負けパターン</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    単一の条件タグごとの傾向です。サンプル数が少ない場合は参考値として扱ってください。
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold text-success">期待値が高い条件</p>
                      <ul className="mt-1.5 space-y-1 text-sm text-foreground">
                        {bestTags.length === 0 && (
                          <li className="text-muted-foreground">該当なし</li>
                        )}
                        {bestTags.map((g) => (
                          <li key={g.key}>
                            {g.label}（{g.stats.expectedValue!.toFixed(2)}R ・ {g.stats.totalCount}件）
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-danger">期待値が低い条件</p>
                      <ul className="mt-1.5 space-y-1 text-sm text-foreground">
                        {worstTags.length === 0 && (
                          <li className="text-muted-foreground">該当なし</li>
                        )}
                        {worstTags.map((g) => (
                          <li key={g.key}>
                            {g.label}（{g.stats.expectedValue!.toFixed(2)}R ・ {g.stats.totalCount}件）
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
