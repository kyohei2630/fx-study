import { afterEach, describe, expect, it } from "vitest";
import { getDb } from "@/db/db";
import { TABLE_NAMES } from "@/db/schema";
import { generateId } from "@/db/repository";
import { lessonsRepo } from "@/db/repositories";
import { buildBackup } from "@/lib/backup/exportData";
import { parseBackupJson, restoreBackup } from "@/lib/backup/importData";
import type { Lesson } from "@/types";

function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: generateId(),
    step: 1,
    title: "ローソク足とは",
    description: "",
    content: "",
    order: 1,
    required: true,
    ...overrides,
  };
}

afterEach(async () => {
  const db = getDb();
  for (const name of TABLE_NAMES) {
    await db[name].clear();
  }
});

describe("backup export/import", () => {
  it("exports every table into a single JSON-serializable object", async () => {
    await lessonsRepo.add(makeLesson());

    const backup = await buildBackup();

    expect(backup.app).toBe("fx-learning-app");
    expect(backup.data.lessons).toHaveLength(1);
    for (const name of TABLE_NAMES) {
      expect(backup.data[name]).toBeDefined();
    }
  });

  it("rejects a file that is not a backup of this app", () => {
    expect(() => parseBackupJson(JSON.stringify({ foo: "bar" }))).toThrow();
  });

  it("rejects invalid JSON", () => {
    expect(() => parseBackupJson("not json")).toThrow();
  });

  it("merge mode adds imported records without deleting existing ones", async () => {
    const existing = makeLesson({ title: "既存レッスン" });
    await lessonsRepo.add(existing);

    const backup = await buildBackup();
    await lessonsRepo.clear();

    const incoming = makeLesson({ title: "新規レッスン" });
    await lessonsRepo.add(incoming);

    const merged = { ...backup, data: { ...backup.data, lessons: [existing] } };
    await restoreBackup(merged, "merge");

    const all = await lessonsRepo.list();
    const titles = all.map((l) => l.title).sort();
    expect(titles).toEqual(["新規レッスン", "既存レッスン"].sort());
  });

  it("replace mode clears a table before importing its rows", async () => {
    await lessonsRepo.add(makeLesson({ title: "古いデータ" }));

    const backup = await buildBackup();
    const replacement = makeLesson({ title: "置き換え後" });
    const withReplacement = {
      ...backup,
      data: { ...backup.data, lessons: [replacement] },
    };

    await restoreBackup(withReplacement, "replace");

    const all = await lessonsRepo.list();
    expect(all).toHaveLength(1);
    expect(all[0].title).toBe("置き換え後");
  });
});
