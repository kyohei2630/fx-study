export type Timeframe =
  | "1m"
  | "5m"
  | "15m"
  | "1h"
  | "4h"
  | "1d"
  | "1w";

export type Direction = "buy" | "sell";

export type TrendState = "uptrend" | "downtrend" | "range" | "unclear";

export type PriceStructureTag = "HH" | "HL" | "LH" | "LL";

export type IndicatorState =
  | "above"
  | "below"
  | "near"
  | "flat"
  | "expanding"
  | "squeezing"
  | "overbought"
  | "oversold"
  | "unset";

export type LearningStatus =
  | "not_started"
  | "in_progress"
  | "comprehension_check"
  | "practicing"
  | "completed";

export type HypothesisStatus =
  | "draft"
  | "testing"
  | "provisionally_adopted"
  | "adopted"
  | "rejected";

export type StrategyStatus = "draft" | "active" | "archived";

export type ConditionRequirement = "required" | "optional" | "exclusion";

export type TradeResult = "win" | "loss" | "breakeven";
