import { computeStats, type RRecord, type Stats } from "@/lib/analysis/stats";

export interface BreakdownGroup {
  key: string;
  label: string;
  stats: Stats;
}

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

/** Groups R-records by the weekday of their `date` (YYYY-MM-DD), oldest-first within each group. */
export function breakdownByWeekday<T extends RRecord & { date: string }>(
  records: T[]
): BreakdownGroup[] {
  const groups = new Map<number, T[]>();
  for (const record of [...records].sort((a, b) => a.date.localeCompare(b.date))) {
    const day = new Date(`${record.date}T00:00:00`).getDay();
    const list = groups.get(day) ?? [];
    list.push(record);
    groups.set(day, list);
  }

  return [1, 2, 3, 4, 5, 6, 0]
    .filter((day) => groups.has(day))
    .map((day) => ({
      key: String(day),
      label: `${WEEKDAY_LABELS[day]}曜日`,
      stats: computeStats(groups.get(day)!),
    }));
}

/** Groups backtests/trades by each entry-condition tag. A record with N tags contributes to N groups. */
export function breakdownByConditionTag<T extends RRecord & { tags: string[] }>(
  records: T[]
): BreakdownGroup[] {
  const groups = new Map<string, T[]>();
  for (const record of records) {
    for (const tag of record.tags) {
      const list = groups.get(tag) ?? [];
      list.push(record);
      groups.set(tag, list);
    }
  }

  return [...groups.entries()]
    .map(([tag, list]) => ({ key: tag, label: tag, stats: computeStats(list) }))
    .sort((a, b) => (b.stats.expectedValue ?? 0) - (a.stats.expectedValue ?? 0));
}
