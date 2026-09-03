"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked, ChevronRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { LessonStatusBadge } from "@/components/learning/LessonStatusBadge";
import { LESSONS } from "@/data/lessons/lessons";
import { ensureLearningContentSeeded } from "@/lib/learning/seed";
import { getProgressMap, computeOverallPercent } from "@/lib/learning/progress";
import type { LearningProgress } from "@/types";

export default function LearningPage() {
  const [progress, setProgress] = useState<Record<string, LearningProgress>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await ensureLearningContentSeeded();
      setProgress(await getProgressMap());
      setLoaded(true);
    })();
  }, []);

  const overallPercent = computeOverallPercent(LESSONS.length, progress);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">学習</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ローソク足から相場構造、インジケーターまで、順を追って学びます。
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <CardTitle>全体の進捗</CardTitle>
          <span className="text-sm font-bold text-primary">{overallPercent}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </Card>

      <Link href="/learning/glossary">
        <Card className="flex items-center justify-between gap-4 transition-colors hover:border-primary/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BookMarked className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">用語辞典</p>
              <p className="text-xs text-muted-foreground">
                FX用語をいつでも検索できます
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Card>
      </Link>

      <div className="space-y-3">
        {LESSONS.map((lesson) => {
          const status = progress[lesson.id]?.status ?? "not_started";
          return (
            <Link key={lesson.id} href={`/learning/${lesson.id}`}>
              <Card className="flex items-center gap-4 transition-colors hover:border-primary/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                  {lesson.step}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">
                    {lesson.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {lesson.description}
                  </p>
                </div>
                {loaded && <LessonStatusBadge status={status} />}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
