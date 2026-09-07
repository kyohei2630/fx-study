import { learningProgressRepo } from "@/db/repositories";
import type { LearningProgress, LearningStatus } from "@/types";

// One progress record per lesson: using the lessonId itself as the primary
// key makes every write an idempotent upsert-by-key, so concurrent calls
// (e.g. React effects double-firing in dev) can never create duplicate rows
// for the same lesson the way a "list, find, then add" pattern would.
function progressId(lessonId: string): string {
  return lessonId;
}

export async function getProgressMap(): Promise<
  Record<string, LearningProgress>
> {
  const all = await learningProgressRepo.list();
  return Object.fromEntries(all.map((p) => [p.lessonId, p]));
}

export async function markLessonOpened(lessonId: string): Promise<void> {
  const existing = await learningProgressRepo.get(progressId(lessonId));
  if (existing && existing.status !== "not_started") return;

  await learningProgressRepo.upsert({
    id: progressId(lessonId),
    lessonId,
    status: "in_progress",
    score: existing?.score ?? null,
    completedAt: existing?.completedAt ?? null,
    updatedAt: new Date().toISOString(),
  });
}

export async function markUnderstandingChecked(lessonId: string): Promise<void> {
  const existing = await learningProgressRepo.get(progressId(lessonId));
  if (existing && (existing.status === "practicing" || existing.status === "completed")) {
    return;
  }

  await learningProgressRepo.upsert({
    id: progressId(lessonId),
    lessonId,
    status: "comprehension_check",
    score: existing?.score ?? null,
    completedAt: existing?.completedAt ?? null,
    updatedAt: new Date().toISOString(),
  });
}

export async function recordQuizResult(
  lessonId: string,
  correctCount: number,
  totalCount: number
): Promise<LearningStatus> {
  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = totalCount > 0 && correctCount === totalCount;
  const status: LearningStatus = passed ? "completed" : "practicing";

  await learningProgressRepo.upsert({
    id: progressId(lessonId),
    lessonId,
    status,
    score,
    completedAt: passed ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  });

  return status;
}

export function computeOverallPercent(
  totalLessons: number,
  progress: Record<string, LearningProgress>
): number {
  if (totalLessons === 0) return 0;
  const completed = Object.values(progress).filter(
    (p) => p.status === "completed"
  ).length;
  return Math.round((completed / totalLessons) * 100);
}
