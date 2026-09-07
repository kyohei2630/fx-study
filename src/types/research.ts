import type {
  HypothesisStatus,
  IndicatorState,
  Timeframe,
  TrendState,
} from "@/types/common";

export interface Observation {
  id: string;
  date: string;
  symbol: string;
  timeframe: Timeframe;
  currentPrice: number | null;
  marketEnvironment: TrendState;
  higherTimeframeDirection: TrendState;
  high: number | null;
  low: number | null;
  importantLevels: string;
  structure: string;
  priceAction: string;
  scenario: string;
  noTrade: boolean;
  emaState: IndicatorState;
  bbState: IndicatorState;
  atrState: IndicatorState;
  rsiState: IndicatorState;
  macdState: IndicatorState;
  notes: string;
  hypothesisId: string | null;
  createdAt: string;
}

export interface Hypothesis {
  id: string;
  title: string;
  description: string;
  symbol: string;
  timeframe: Timeframe;
  higherTimeframe: Timeframe;
  entryRules: string;
  exitRules: string;
  stopLossRules: string;
  takeProfitRules: string;
  exclusionRules: string;
  expectedR: number | null;
  conditions: string[];
  status: HypothesisStatus;
  verificationCount: number;
  createdAt: string;
  updatedAt: string;
}

export type IndicatorLifecycleStatus =
  | "learning"
  | "observing"
  | "hypothesis"
  | "verifying"
  | "adopted"
  | "rejected";

export interface Indicator {
  id: string;
  name: string;
  category: string;
  status: IndicatorLifecycleStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
