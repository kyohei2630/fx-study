"use client";

import { useEffect, useState } from "react";
import { GraduationCap, LineChart, NotebookPen, ArrowRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { LESSONS } from "@/data/lessons/lessons";
import { ensureLearningContentSeeded } from "@/lib/learning/seed";
import { getProgressMap, computeOverallPercent } from "@/lib/learning/progress";
import type { LearningProgress } from "@/types";

export default function HomePage() {
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
  const currentLesson =
    LESSONS.find((l) => progress[l.id]?.status !== "completed") ?? LESSONS[0];
  const currentIndex = LESSONS.findIndex((l) => l.id === currentLesson.id);
  const nextLesson = LESSONS[currentIndex + 1];
  const started = loaded && Object.keys(progress).length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          ホーム
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          「学ぶ → 観察する → 仮説を立てる → 検証する → 戦略化する → 実践する →
          分析する → 改善する」という研究サイクルで進めましょう。
        </p>
      </div>

      <Card className="bg-primary text-primary-foreground">
        <p className="text-sm font-medium opacity-90">はじめに</p>
        <h2 className="mt-1 text-lg font-bold">
          このアプリは「勝てる手法を教えるアプリ」ではありません
        </h2>
        <p className="mt-2 text-sm leading-relaxed opacity-90">
          チャートを読む力、相場を構造的に考える力、仮説を立てて検証する力を、
          自分自身のペースで身につけていくための学習・研究ノートです。まずは
          「学習」からローソク足と高値・安値の基礎を学びましょう。
        </p>
        <LinkButton
          href={`/learning/${currentLesson.id}`}
          variant="secondary"
          className="mt-4 bg-white text-primary hover:bg-white/90"
        >
          {started ? "学習を続ける" : "学習を始める"}
          <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardTitle>現在の学習ステップ</CardTitle>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                STEP {currentLesson.step}・{currentLesson.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {started ? `進捗 ${overallPercent}%` : "まだ学習を開始していません"}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardTitle>今日の課題</CardTitle>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm border border-muted-foreground" />
              {currentLesson.title}を学習する
            </li>
            {nextLesson && (
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm border border-muted-foreground" />
                次は「{nextLesson.title}」に進む
              </li>
            )}
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm border border-muted-foreground" />
              用語辞典を眺めてみる
            </li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>チャート練習</CardTitle>
            <p className="mt-1 text-sm text-foreground">
              高値・安値を見極める力を鍛える
            </p>
          </div>
          <LinkButton href="/chart-training" variant="ghost" className="px-2">
            <LineChart className="h-5 w-5" />
          </LinkButton>
        </Card>
        <Card className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>観察記録</CardTitle>
            <p className="mt-1 text-sm text-foreground">
              気づきを記録して仮説につなげる
            </p>
          </div>
          <LinkButton href="/observations" variant="ghost" className="px-2">
            <NotebookPen className="h-5 w-5" />
          </LinkButton>
        </Card>
      </div>

      <Card>
        <CardTitle>現在の戦略</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          学習が進み、仮説を検証できるようになると、ここに戦略Versionの成績が
          表示されます。
        </p>
      </Card>
    </div>
  );
}
