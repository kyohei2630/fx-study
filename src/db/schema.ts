import Dexie, { type EntityTable } from "dexie";
import type {
  ChartTrainingResult,
  Hypothesis,
  ImprovementNote,
  Indicator,
  LearningProgress,
  Lesson,
  Observation,
  Quiz,
  Strategy,
  StrategyVersion,
  Trade,
  TradeCondition,
  Backtest,
} from "@/types";

export class FxDatabase extends Dexie {
  learningProgress!: EntityTable<LearningProgress, "id">;
  lessons!: EntityTable<Lesson, "id">;
  quizzes!: EntityTable<Quiz, "id">;
  chartTrainingResults!: EntityTable<ChartTrainingResult, "id">;
  observations!: EntityTable<Observation, "id">;
  hypotheses!: EntityTable<Hypothesis, "id">;
  indicators!: EntityTable<Indicator, "id">;
  strategies!: EntityTable<Strategy, "id">;
  strategyVersions!: EntityTable<StrategyVersion, "id">;
  trades!: EntityTable<Trade, "id">;
  tradeConditions!: EntityTable<TradeCondition, "id">;
  backtests!: EntityTable<Backtest, "id">;
  improvementNotes!: EntityTable<ImprovementNote, "id">;

  constructor() {
    super("fx-learning-app");

    this.version(1).stores({
      learningProgress: "id, lessonId, status, updatedAt",
      lessons: "id, step, order",
      quizzes: "id, lessonId",
      chartTrainingResults: "id, type, symbol, timeframe, createdAt",
      observations: "id, date, symbol, timeframe, hypothesisId, createdAt",
      hypotheses: "id, status, symbol, timeframe, createdAt",
      indicators: "id, status, category",
      strategies: "id, status, createdAt",
      strategyVersions: "id, strategyId, createdAt",
      trades: "id, date, symbol, strategyId, strategyVersionId, result, createdAt",
      tradeConditions: "id, tradeId, category",
      backtests: "id, date, symbol, hypothesisId, strategyId, strategyVersionId, createdAt",
      improvementNotes: "id, strategyId, strategyVersionId, decision, createdAt",
    });
  }
}

export const TABLE_NAMES = [
  "learningProgress",
  "lessons",
  "quizzes",
  "chartTrainingResults",
  "observations",
  "hypotheses",
  "indicators",
  "strategies",
  "strategyVersions",
  "trades",
  "tradeConditions",
  "backtests",
  "improvementNotes",
] as const;

export type TableName = (typeof TABLE_NAMES)[number];
