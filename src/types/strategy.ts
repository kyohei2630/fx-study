import type { ConditionRequirement, StrategyStatus } from "@/types/common";

export interface ConditionItem {
  id: string;
  category: string;
  label: string;
  requirement: ConditionRequirement;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  currentVersion: string;
  status: StrategyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyVersion {
  id: string;
  strategyId: string;
  version: string;
  entryRules: string;
  exitRules: string;
  stopLossRules: string;
  takeProfitRules: string;
  conditions: ConditionItem[];
  note: string;
  createdAt: string;
}
