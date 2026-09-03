import { describe, expect, it } from "vitest";
import { suggestNextVersion } from "@/lib/strategy/version";

describe("suggestNextVersion", () => {
  it("bumps the minor version", () => {
    expect(suggestNextVersion("v1.0")).toBe("v1.1");
    expect(suggestNextVersion("v1.9")).toBe("v1.10");
  });

  it("works without a leading v", () => {
    expect(suggestNextVersion("2.3")).toBe("v2.4");
  });

  it("falls back to v1.1 for an unrecognized format", () => {
    expect(suggestNextVersion("alpha")).toBe("v1.1");
  });
});
