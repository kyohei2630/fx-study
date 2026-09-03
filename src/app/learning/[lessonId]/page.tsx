import { notFound } from "next/navigation";
import { LESSONS, LESSONS_BY_ID } from "@/data/lessons/lessons";
import { LessonDetailClient } from "@/components/learning/LessonDetailClient";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: PageProps<"/learning/[lessonId]">) {
  const { lessonId } = await params;
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) notFound();

  return <LessonDetailClient lessonId={lessonId} />;
}
