import { lessonsRepo, quizzesRepo } from "@/db/repositories";
import { LESSONS } from "@/data/lessons/lessons";
import { QUIZZES } from "@/data/lessons/quizzes";

let seedPromise: Promise<void> | null = null;

async function seed(): Promise<void> {
  const [lessonCount, quizCount] = await Promise.all([
    lessonsRepo.count(),
    quizzesRepo.count(),
  ]);

  // bulkPut (upsert) rather than bulkAdd: safe to re-run, and immune to the
  // read-then-write race when multiple pages call this on mount at once.
  if (lessonCount === 0) {
    await lessonsRepo.bulkPut(LESSONS);
  }
  if (quizCount === 0) {
    await quizzesRepo.bulkPut(QUIZZES);
  }
}

export function ensureLearningContentSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
