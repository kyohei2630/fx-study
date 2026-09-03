"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/Card";

export function CumulativeRChart({ cumulativeR }: { cumulativeR: number[] }) {
  const data = cumulativeR.map((value, i) => ({ index: i + 1, value }));

  if (data.length === 0) {
    return (
      <Card>
        <CardTitle>累積R推移</CardTitle>
        <p className="mt-3 text-sm text-muted-foreground">データがありません。</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <CardTitle>累積R推移</CardTitle>
        <span className="text-sm font-bold text-foreground">
          {data[data.length - 1].value >= 0 ? "+" : ""}
          {data[data.length - 1].value.toFixed(1)}R
        </span>
      </div>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="cumulativeRFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--color-border)"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="index"
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
              labelFormatter={(label) => `${label}件目`}
              formatter={(value: unknown) => {
                const n = Number(value);
                return [`${n >= 0 ? "+" : ""}${n.toFixed(2)}R`, "累積R"];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#cumulativeRFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--color-surface)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
