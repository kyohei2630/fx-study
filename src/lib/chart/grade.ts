import type { ChartProblem } from "@/lib/chart/problemGenerator";
import type { ChartTrainingScore } from "@/types/learning";

const NEAR_MISS_TOLERANCE = 2; // candles

export function gradeClickAnswer(
  problem: ChartProblem,
  selectedIndex: number
): ChartTrainingScore {
  if (problem.correctIndex === undefined) return "incorrect";
  if (selectedIndex === problem.correctIndex) return "correct";
  if (problem.acceptableIndices?.includes(selectedIndex)) return "correct";

  const distanceToCorrect = Math.abs(selectedIndex - problem.correctIndex);
  const distanceToAcceptable = Math.min(
    ...(problem.acceptableIndices?.map((i) => Math.abs(selectedIndex - i)) ?? [Infinity])
  );
  const distance = Math.min(distanceToCorrect, distanceToAcceptable);

  if (distance <= NEAR_MISS_TOLERANCE) return "acceptable";
  return "incorrect";
}

export function gradeChoiceAnswer(
  problem: ChartProblem,
  selectedChoiceId: string
): ChartTrainingScore {
  return selectedChoiceId === problem.correctChoiceId ? "correct" : "incorrect";
}

export const SCORE_LABELS: Record<ChartTrainingScore, string> = {
  correct: "正解",
  acceptable: "やや妥当",
  difficult: "判断が難しい",
  incorrect: "不正解",
};
