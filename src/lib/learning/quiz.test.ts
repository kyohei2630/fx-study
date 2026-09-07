import { describe, expect, it } from "vitest";
import { gradeQuiz } from "@/lib/learning/quiz";
import type { Quiz } from "@/types";

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    lessonId: "candlestick",
    question: "Q1",
    options: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ],
    answer: "a",
    explanation: "explanation 1",
  },
  {
    id: "q2",
    lessonId: "candlestick",
    question: "Q2",
    options: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ],
    answer: "b",
    explanation: "explanation 2",
  },
];

describe("gradeQuiz", () => {
  it("counts correct answers and reports per-question results", () => {
    const result = gradeQuiz(QUIZZES, { q1: "a", q2: "a" });

    expect(result.correctCount).toBe(1);
    expect(result.total).toBe(2);
    expect(result.perQuestion).toEqual({ q1: true, q2: false });
  });

  it("treats an unanswered question as incorrect", () => {
    const result = gradeQuiz(QUIZZES, { q1: "a" });

    expect(result.correctCount).toBe(1);
    expect(result.perQuestion.q2).toBe(false);
  });

  it("returns zero total for a lesson with no quizzes", () => {
    const result = gradeQuiz([], {});

    expect(result).toEqual({ correctCount: 0, total: 0, perQuestion: {} });
  });
});
