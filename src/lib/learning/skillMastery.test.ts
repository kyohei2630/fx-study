import { describe, expect, it } from "vitest";
import { computeSkillMastery } from "@/lib/learning/skillMastery";
import type { Lesson, LearningProgress } from "@/types";

function lesson(id: string, category: string): Lesson {
  return {
    id,
    step: 1,
    order: 1,
    required: true,
    category,
    title: id,
    description: "",
    content: "",
  };
}

function progressRow(lessonId: string, status: LearningProgress["status"]): LearningProgress {
  return {
    id: lessonId,
    lessonId,
    status,
    score: null,
    completedAt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("computeSkillMastery", () => {
  it("groups lessons by category and computes completion percent", () => {
    const lessons = [
      lesson("ema", "インジケーター"),
      lesson("rsi", "インジケーター"),
      lesson("candlestick", "ローソク足"),
    ];
    const progress = {
      ema: progressRow("ema", "completed"),
      rsi: progressRow("rsi", "practicing"),
    };

    const result = computeSkillMastery(lessons, progress);

    expect(result).toEqual([
      { category: "インジケーター", totalLessons: 2, completedLessons: 1, percent: 50 },
      { category: "ローソク足", totalLessons: 1, completedLessons: 0, percent: 0 },
    ]);
  });

  it("preserves first-seen category order and returns an empty array for no lessons", () => {
    expect(computeSkillMastery([], {})).toEqual([]);
  });
});
