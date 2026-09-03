import { describe, expect, it } from "vitest";
import { breakdownByConditionTag, breakdownByWeekday } from "@/lib/analysis/breakdown";

describe("breakdownByWeekday", () => {
  it("groups records by the weekday of their date", () => {
    // 2026-09-02 is a Wednesday, 2026-09-03 is a Thursday
    const groups = breakdownByWeekday([
      { date: "2026-09-02", rMultiple: 1, result: "win" },
      { date: "2026-09-02", rMultiple: -1, result: "loss" },
      { date: "2026-09-03", rMultiple: 2, result: "win" },
    ]);

    const wednesday = groups.find((g) => g.label === "水曜日");
    const thursday = groups.find((g) => g.label === "木曜日");
    expect(wednesday?.stats.totalCount).toBe(2);
    expect(thursday?.stats.totalCount).toBe(1);
  });
});

describe("breakdownByConditionTag", () => {
  it("attributes a record with multiple tags to each tag's group", () => {
    const groups = breakdownByConditionTag([
      { tags: ["NY時間", "上昇トレンド"], rMultiple: 2, result: "win" },
      { tags: ["東京時間"], rMultiple: -1, result: "loss" },
    ]);

    const ny = groups.find((g) => g.key === "NY時間");
    const uptrend = groups.find((g) => g.key === "上昇トレンド");
    const tokyo = groups.find((g) => g.key === "東京時間");
    expect(ny?.stats.totalCount).toBe(1);
    expect(uptrend?.stats.totalCount).toBe(1);
    expect(tokyo?.stats.totalCount).toBe(1);
  });

  it("sorts groups by expected value descending", () => {
    const groups = breakdownByConditionTag([
      { tags: ["good"], rMultiple: 2, result: "win" },
      { tags: ["good"], rMultiple: 2, result: "win" },
      { tags: ["bad"], rMultiple: -2, result: "loss" },
      { tags: ["bad"], rMultiple: -2, result: "loss" },
    ]);

    expect(groups[0].key).toBe("good");
    expect(groups[1].key).toBe("bad");
  });
});
