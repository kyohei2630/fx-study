import type { Quiz } from "@/types";

export interface QuizGradeResult {
  correctCount: number;
  total: number;
  perQuestion: Record<string, boolean>;
}

export function gradeQuiz(
  quizzes: Quiz[],
  answers: Record<string, string>
): QuizGradeResult {
  const perQuestion: Record<string, boolean> = {};
  let correctCount = 0;

  for (const quiz of quizzes) {
    const correct = answers[quiz.id] === quiz.answer;
    perQuestion[quiz.id] = correct;
    if (correct) correctCount += 1;
  }

  return { correctCount, total: quizzes.length, perQuestion };
}
