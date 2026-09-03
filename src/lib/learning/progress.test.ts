import { afterEach, describe, expect, it } from "vitest";
import { learningProgressRepo } from "@/db/repositories";
import {
  computeOverallPercent,
  getProgressMap,
  markLessonOpened,
  recordQuizResult,
} from "@/lib/learning/progress";

afterEach(async () => {
  await learningProgressRepo.clear();
});

describe("learning progress", () => {
  it("creates a single record even when opened concurrently (no duplicate-row race)", async () => {
    await Promise.all([
      markLessonOpened("candlestick"),
      markLessonOpened("candlestick"),
      markLessonOpened("candlestick"),
    ]);

    const all = await learningProgressRepo.list();
    expect(all).toHaveLength(1);
    expect(all[0].status).toBe("in_progress");
  });

  it("marks a lesson completed only when every quiz answer is correct", async () => {
    await markLessonOpened("candlestick");

    const status = await recordQuizResult("candlestick", 2, 2);

    expect(status).toBe("completed");
    const map = await getProgressMap();
    expect(map.candlestick.status).toBe("completed");
    expect(map.candlestick.score).toBe(100);
    expect(map.candlestick.completedAt).not.toBeNull();
  });

  it("marks a lesson as practicing when only some answers are correct", async () => {
    const status = await recordQuizResult("candlestick", 1, 2);

    expect(status).toBe("practicing");
    const map = await getProgressMap();
    expect(map.candlestick.score).toBe(50);
    expect(map.candlestick.completedAt).toBeNull();
  });

  it("does not downgrade a completed lesson when reopened", async () => {
    await recordQuizResult("candlestick", 2, 2);
    await markLessonOpened("candlestick");

    const map = await getProgressMap();
    expect(map.candlestick.status).toBe("completed");
  });

  it("computes overall percent from completed lessons only", () => {
    const percent = computeOverallPercent(12, {
      candlestick: {
        id: "candlestick",
        lessonId: "candlestick",
        status: "completed",
        score: 100,
        completedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      "high-low": {
        id: "high-low",
        lessonId: "high-low",
        status: "practicing",
        score: 50,
        completedAt: null,
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });

    expect(percent).toBe(Math.round((1 / 12) * 100));
  });
});
