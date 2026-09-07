import { createRepository } from "@/db/repository";
import type {
  Backtest,
  ChartTrainingResult,
  Hypothesis,
  ImprovementNote,
  Indicator,
  LearningProgress,
  Lesson,
  Observation,
  Quiz,
  ScenarioPlan,
  Strategy,
  StrategyVersion,
  Trade,
  TradeCondition,
} from "@/types";

export const learningProgressRepo = createRepository<LearningProgress>(
  "learningProgress"
);
export const lessonsRepo = createRepository<Lesson>("lessons");
export const quizzesRepo = createRepository<Quiz>("quizzes");
export const chartTrainingResultsRepo = createRepository<ChartTrainingResult>(
  "chartTrainingResults"
);
export const observationsRepo = createRepository<Observation>("observations");
export const hypothesesRepo = createRepository<Hypothesis>("hypotheses");
export const indicatorsRepo = createRepository<Indicator>("indicators");
export const strategiesRepo = createRepository<Strategy>("strategies");
export const strategyVersionsRepo =
  createRepository<StrategyVersion>("strategyVersions");
export const tradesRepo = createRepository<Trade>("trades");
export const tradeConditionsRepo =
  createRepository<TradeCondition>("tradeConditions");
export const backtestsRepo = createRepository<Backtest>("backtests");
export const improvementNotesRepo =
  createRepository<ImprovementNote>("improvementNotes");
export const scenariosRepo = createRepository<ScenarioPlan>("scenarios");
