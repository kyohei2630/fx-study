import type { LearningStatus } from "@/types/common";

export interface Lesson {
  id: string;
  step: number;
  title: string;
  description: string;
  content: string;
  order: number;
  required: boolean;
}

export interface LearningProgress {
  id: string;
  lessonId: string;
  status: LearningStatus;
  score: number | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface QuizOption {
  id: string;
  label: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  options: QuizOption[];
  answer: string;
  explanation: string;
}

export type ChartTrainingType =
  | "high"
  | "low"
  | "highest"
  | "lowest"
  | "recent_high"
  | "recent_low"
  | "swing_high"
  | "swing_low"
  | "important_high"
  | "important_low"
  | "hh"
  | "hl"
  | "lh"
  | "ll"
  | "trend"
  | "range"
  | "breakout";

export type ChartTrainingScore = "correct" | "acceptable" | "difficult" | "incorrect";

export interface ChartTrainingResult {
  id: string;
  type: ChartTrainingType;
  symbol: string;
  timeframe: string;
  correctPosition: string;
  userPosition: string;
  score: ChartTrainingScore;
  difficulty: number;
  createdAt: string;
}
