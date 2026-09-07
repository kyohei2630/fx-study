import { afterEach, describe, expect, it } from "vitest";
import { getDb } from "@/db/db";
import { generateId } from "@/db/repository";
import { lessonsRepo } from "@/db/repositories";
import type { Lesson } from "@/types";

function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: generateId(),
    step: 1,
    title: "ローソク足とは",
    description: "ローソク足の基礎",
    category: "ローソク足",
    content: "本文",
    order: 1,
    required: true,
    ...overrides,
  };
}

afterEach(async () => {
  await lessonsRepo.clear();
});

describe("repository CRUD", () => {
  it("adds and retrieves a record", async () => {
    const lesson = makeLesson();
    await lessonsRepo.add(lesson);

    const found = await lessonsRepo.get(lesson.id);
    expect(found).toEqual(lesson);
  });

  it("lists all records", async () => {
    await lessonsRepo.add(makeLesson({ step: 1 }));
    await lessonsRepo.add(makeLesson({ step: 2 }));

    const all = await lessonsRepo.list();
    expect(all).toHaveLength(2);
  });

  it("updates a record", async () => {
    const lesson = makeLesson();
    await lessonsRepo.add(lesson);

    await lessonsRepo.update(lesson.id, { title: "更新後タイトル" });

    const found = await lessonsRepo.get(lesson.id);
    expect(found?.title).toBe("更新後タイトル");
  });

  it("removes a record", async () => {
    const lesson = makeLesson();
    await lessonsRepo.add(lesson);

    await lessonsRepo.remove(lesson.id);

    const found = await lessonsRepo.get(lesson.id);
    expect(found).toBeUndefined();
  });

  it("counts records", async () => {
    await lessonsRepo.add(makeLesson());
    await lessonsRepo.add(makeLesson());

    expect(await lessonsRepo.count()).toBe(2);
  });

  it("shares the same underlying Dexie instance across calls", async () => {
    const db1 = getDb();
    const db2 = getDb();
    expect(db1).toBe(db2);
  });
});
