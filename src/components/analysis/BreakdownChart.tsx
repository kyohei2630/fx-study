"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardTitle } from "@/components/ui/Card";
import type { BreakdownGroup } from "@/lib/analysis/breakdown";

export function BreakdownChart({
  title,
  description,
  groups,
}: {
  title: string;
  description: string;
  groups: BreakdownGroup[];
}) {
  const data = groups.map((g) => ({
    label: g.label,
    expectedValue: g.stats.expectedValue ?? 0,
    count: g.stats.totalCount,
    winRate: g.stats.winRate,
  }));

  if (data.length === 0) {
    return (
      <Card>
        <CardTitle>{title}</CardTitle>
        <p className="mt-3 text-sm text-muted-foreground">データがありません。</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value: unknown, _name: unknown, item: unknown) => {
                const n = Number(value);
                const payload = (item as { payload?: { count: number; winRate: number | null } })
                  .payload;
                const rate = payload?.winRate ?? null;
                return [
                  `${n >= 0 ? "+" : ""}${n.toFixed(2)}R（${payload?.count ?? 0}件・勝率${rate === null ? "—" : rate.toFixed(0)}%）`,
                  "期待値",
                ];
              }}
            />
            <Bar dataKey="expectedValue" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((d) => (
                <Cell
                  key={d.label}
                  fill={d.expectedValue >= 0 ? "var(--color-success)" : "var(--color-danger)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="pb-2 font-medium">項目</th>
              <th className="pb-2 font-medium">件数</th>
              <th className="pb-2 font-medium">勝率</th>
              <th className="pb-2 font-medium">期待値</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {groups.map((g) => (
              <tr key={g.key}>
                <td className="py-2 text-foreground">{g.label}</td>
                <td className="py-2 text-foreground">{g.stats.totalCount}</td>
                <td className="py-2 text-foreground">
                  {g.stats.winRate === null ? "—" : `${g.stats.winRate.toFixed(0)}%`}
                </td>
                <td
                  className={`py-2 font-medium ${
                    (g.stats.expectedValue ?? 0) >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {g.stats.expectedValue === null
                    ? "—"
                    : `${g.stats.expectedValue >= 0 ? "+" : ""}${g.stats.expectedValue.toFixed(2)}R`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
