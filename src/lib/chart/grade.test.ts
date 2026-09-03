import { describe, expect, it } from "vitest";
import { gradeChoiceAnswer, gradeClickAnswer } from "@/lib/chart/grade";
import type { ChartProblem } from "@/lib/chart/problemGenerator";

function baseProblem(overrides: Partial<ChartProblem> = {}): ChartProblem {
  return {
    type: "highest",
    seed: 1,
    candles: [],
    swings: [],
    question: "",
    interaction: "click",
    correctIndex: 10,
    acceptableIndices: [],
    explanation: "",
    ...overrides,
  };
}

describe("gradeClickAnswer", () => {
  it("marks the exact correct index as correct", () => {
    expect(gradeClickAnswer(baseProblem(), 10)).toBe("correct");
  });

  it("marks a listed acceptable index as correct", () => {
    const problem = baseProblem({ acceptableIndices: [7, 12] });
    expect(gradeClickAnswer(problem, 12)).toBe("correct");
  });

  it("marks a near miss (within tolerance) as acceptable", () => {
    expect(gradeClickAnswer(baseProblem(), 12)).toBe("acceptable");
  });

  it("marks a far-off answer as incorrect", () => {
    expect(gradeClickAnswer(baseProblem(), 30)).toBe("incorrect");
  });
});

describe("gradeChoiceAnswer", () => {
  it("marks the correct choice id as correct", () => {
    const problem = baseProblem({ interaction: "choice", correctChoiceId: "uptrend" });
    expect(gradeChoiceAnswer(problem, "uptrend")).toBe("correct");
  });

  it("marks a wrong choice id as incorrect", () => {
    const problem = baseProblem({ interaction: "choice", correctChoiceId: "uptrend" });
    expect(gradeChoiceAnswer(problem, "range")).toBe("incorrect");
  });
});
