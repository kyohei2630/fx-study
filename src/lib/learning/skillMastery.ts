import type { Lesson, LearningProgress } from "@/types";

export interface SkillMasteryEntry {
  category: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
}

export function computeSkillMastery(
  lessons: Lesson[],
  progress: Record<string, LearningProgress>
): SkillMasteryEntry[] {
  const byCategory = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const list = byCategory.get(lesson.category) ?? [];
    list.push(lesson);
    byCategory.set(lesson.category, list);
  }

  return Array.from(byCategory.entries()).map(([category, categoryLessons]) => {
    const totalLessons = categoryLessons.length;
    const completedLessons = categoryLessons.filter(
      (lesson) => progress[lesson.id]?.status === "completed"
    ).length;

    return {
      category,
      totalLessons,
      completedLessons,
      percent:
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  });
}
