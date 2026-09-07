import type { Direction, Timeframe, TradeResult, TrendState } from "@/types/common";

export type PsychologyTag =
  | "impatience"
  | "rule_violation"
  | "fear_of_loss"
  | "rushed_profit"
  | "delayed_stop_loss"
  | "fomo";

export interface Trade {
  id: string;
  date: string;
  time: string;
  symbol: string;
  timeframe: Timeframe;
  direction: Direction;
  entry: number;
  stopLoss: number;
  takeProfit: number | null;
  exit: number | null;
  result: TradeResult | null;
  rMultiple: number | null;
  strategyId: string | null;
  strategyVersionId: string | null;
  marketEnvironment: TrendState;
  higherTimeframeDirection: TrendState;
  structure: string;
  priceAction: string;
  ruleCompliant: boolean | null;
  psychologyTags: PsychologyTag[];
  preTradeNote: string;
  postTradeNote: string;
  screenshot: string | null;
  createdAt: string;
}

export interface TradeCondition {
  id: string;
  tradeId: string;
  conditionName: string;
  conditionValue: string;
  category: string;
}

export type BacktestResult = "win" | "loss" | "breakeven";

export interface Backtest {
  id: string;
  date: string;
  symbol: string;
  timeframe: Timeframe;
  direction: Direction;
  entry: number;
  stopLoss: number;
  takeProfit: number | null;
  exit: number;
  rMultiple: number;
  result: BacktestResult;
  marketEnvironment: TrendState;
  higherTimeframeDirection: TrendState;
  entryConditions: string[];
  exclusionConditions: string[];
  hypothesisId: string | null;
  strategyId: string | null;
  strategyVersionId: string | null;
  screenshot: string | null;
  comment: string;
  createdAt: string;
}
