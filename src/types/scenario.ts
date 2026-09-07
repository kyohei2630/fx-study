import type { Timeframe } from "@/types/common";

export interface ScenarioCase {
  id: string;
  label: string;
  condition: string;
  prediction: string;
  trigger: string;
  invalidation: string;
  stopLoss: string;
  takeProfit: string;
  isNoTrade: boolean;
}

export interface ScenarioPlan {
  id: string;
  date: string;
  symbol: string;
  timeframe: Timeframe;
  currentPrice: number | null;
  summary: string;
  cases: ScenarioCase[];
  notes: string;
  createdAt: string;
}
