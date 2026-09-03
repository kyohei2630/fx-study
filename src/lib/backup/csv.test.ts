import { describe, expect, it } from "vitest";
import { buildCsv } from "@/lib/backup/csv";

describe("buildCsv", () => {
  it("builds a header row followed by escaped data rows", () => {
    const csv = buildCsv(
      [{ name: "USD/JPY", note: "simple" }],
      [
        { key: "name", label: "通貨ペア", value: (r) => r.name },
        { key: "note", label: "メモ", value: (r) => r.note },
      ]
    );
    const lines = csv.replace(/^﻿/, "").split("\r\n");
    expect(lines[0]).toBe("通貨ペア,メモ");
    expect(lines[1]).toBe("USD/JPY,simple");
  });

  it("quotes and escapes cells containing commas, quotes, or newlines", () => {
    const csv = buildCsv(
      [{ note: 'has, a comma and "quotes"\nand a newline' }],
      [{ key: "note", label: "メモ", value: (r) => r.note }]
    );
    const lines = csv.replace(/^﻿/, "").split("\r\n");
    expect(lines[1]).toBe('"has, a comma and ""quotes""\nand a newline"');
  });

  it("renders null/undefined values as empty cells", () => {
    const csv = buildCsv(
      [{ value: null }],
      [{ key: "value", label: "値", value: (r) => r.value }]
    );
    const lines = csv.replace(/^﻿/, "").split("\r\n");
    expect(lines[1]).toBe("");
  });
});
