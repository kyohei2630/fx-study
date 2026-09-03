import { buildCsv, downloadCsv, type CsvColumn } from "@/lib/backup/csv";
import type { Backtest, Strategy, StrategyVersion, Trade } from "@/types";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const TRADE_COLUMNS: CsvColumn<Trade>[] = [
  { key: "date", label: "日付", value: (t) => t.date },
  { key: "time", label: "時刻", value: (t) => t.time },
  { key: "symbol", label: "通貨ペア", value: (t) => t.symbol },
  { key: "timeframe", label: "時間足", value: (t) => t.timeframe },
  { key: "direction", label: "方向", value: (t) => (t.direction === "buy" ? "Buy" : "Sell") },
  { key: "entry", label: "Entry", value: (t) => t.entry },
  { key: "stopLoss", label: "SL", value: (t) => t.stopLoss },
  { key: "takeProfit", label: "TP", value: (t) => t.takeProfit },
  { key: "exit", label: "Exit", value: (t) => t.exit },
  { key: "result", label: "結果", value: (t) => t.result },
  { key: "rMultiple", label: "R", value: (t) => t.rMultiple },
  { key: "ruleCompliant", label: "ルール遵守", value: (t) => (t.ruleCompliant === null ? "" : t.ruleCompliant ? "遵守" : "違反") },
  { key: "preTradeNote", label: "トレード前の考え", value: (t) => t.preTradeNote },
  { key: "postTradeNote", label: "トレード後の反省", value: (t) => t.postTradeNote },
];

export function exportTradesCsv(trades: Trade[]): void {
  downloadCsv(`fx-app-trades-${today()}.csv`, buildCsv(trades, TRADE_COLUMNS));
}

const BACKTEST_COLUMNS: CsvColumn<Backtest>[] = [
  { key: "date", label: "日付", value: (b) => b.date },
  { key: "symbol", label: "通貨ペア", value: (b) => b.symbol },
  { key: "timeframe", label: "時間足", value: (b) => b.timeframe },
  { key: "direction", label: "方向", value: (b) => (b.direction === "buy" ? "Buy" : "Sell") },
  { key: "entry", label: "Entry", value: (b) => b.entry },
  { key: "stopLoss", label: "SL", value: (b) => b.stopLoss },
  { key: "takeProfit", label: "TP", value: (b) => b.takeProfit },
  { key: "exit", label: "Exit", value: (b) => b.exit },
  { key: "result", label: "結果", value: (b) => b.result },
  { key: "rMultiple", label: "R", value: (b) => b.rMultiple },
  { key: "entryConditions", label: "エントリー条件", value: (b) => b.entryConditions.join(" / ") },
  { key: "exclusionConditions", label: "除外条件", value: (b) => b.exclusionConditions.join(" / ") },
  { key: "comment", label: "コメント", value: (b) => b.comment },
];

export function exportBacktestsCsv(backtests: Backtest[]): void {
  downloadCsv(`fx-app-backtests-${today()}.csv`, buildCsv(backtests, BACKTEST_COLUMNS));
}

interface StrategyVersionRow {
  strategyName: string;
  version: StrategyVersion;
}

const STRATEGY_VERSION_COLUMNS: CsvColumn<StrategyVersionRow>[] = [
  { key: "strategyName", label: "戦略名", value: (r) => r.strategyName },
  { key: "version", label: "Version", value: (r) => r.version.version },
  { key: "entryRules", label: "エントリー条件", value: (r) => r.version.entryRules },
  { key: "exitRules", label: "決済条件", value: (r) => r.version.exitRules },
  { key: "stopLossRules", label: "損切りルール", value: (r) => r.version.stopLossRules },
  { key: "takeProfitRules", label: "利確ルール", value: (r) => r.version.takeProfitRules },
  { key: "createdAt", label: "作成日", value: (r) => r.version.createdAt.slice(0, 10) },
];

export function exportStrategyVersionsCsv(
  strategies: Strategy[],
  versions: StrategyVersion[]
): void {
  const strategyNameById = new Map(strategies.map((s) => [s.id, s.name]));
  const rows: StrategyVersionRow[] = versions.map((version) => ({
    strategyName: strategyNameById.get(version.strategyId) ?? "（不明な戦略）",
    version,
  }));
  downloadCsv(
    `fx-app-strategy-versions-${today()}.csv`,
    buildCsv(rows, STRATEGY_VERSION_COLUMNS)
  );
}

interface ConditionRow {
  strategyName: string;
  version: string;
  category: string;
  label: string;
  requirement: string;
}

const CONDITION_COLUMNS: CsvColumn<ConditionRow>[] = [
  { key: "strategyName", label: "戦略名", value: (r) => r.strategyName },
  { key: "version", label: "Version", value: (r) => r.version },
  { key: "category", label: "カテゴリ", value: (r) => r.category },
  { key: "label", label: "条件", value: (r) => r.label },
  { key: "requirement", label: "区分", value: (r) => r.requirement },
];

const REQUIREMENT_LABEL: Record<string, string> = {
  required: "必須",
  optional: "任意",
  exclusion: "除外条件",
};

export function exportConditionsCsv(strategies: Strategy[], versions: StrategyVersion[]): void {
  const strategyNameById = new Map(strategies.map((s) => [s.id, s.name]));
  const rows: ConditionRow[] = versions.flatMap((version) =>
    version.conditions.map((c) => ({
      strategyName: strategyNameById.get(version.strategyId) ?? "（不明な戦略）",
      version: version.version,
      category: c.category,
      label: c.label,
      requirement: REQUIREMENT_LABEL[c.requirement] ?? c.requirement,
    }))
  );
  downloadCsv(`fx-app-conditions-${today()}.csv`, buildCsv(rows, CONDITION_COLUMNS));
}
