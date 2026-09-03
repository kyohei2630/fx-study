"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw, Check, AlertTriangle, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CandlestickChart, type CandlestickMarker } from "@/components/chart/CandlestickChart";
import { generateProblem } from "@/lib/chart/problemGenerator";
import { gradeChoiceAnswer, gradeClickAnswer, SCORE_LABELS } from "@/lib/chart/grade";
import { randomSeed } from "@/lib/chart/random";
import { generateId } from "@/db/repository";
import { chartTrainingResultsRepo } from "@/db/repositories";
import { typeLabel } from "@/lib/chart/problemGenerator";
import type { ChartTrainingScore, ChartTrainingType } from "@/types/learning";

const SCORE_STYLES: Record<ChartTrainingScore, string> = {
  correct: "bg-success/10 text-success",
  acceptable: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  difficult: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  incorrect: "bg-danger/10 text-danger",
};

const SCORE_ICONS: Record<ChartTrainingScore, typeof Check> = {
  correct: Check,
  acceptable: AlertTriangle,
  difficult: AlertTriangle,
  incorrect: X,
};

export function ChartTrainingClient({ type }: { type: ChartTrainingType }) {
  // Seed starts null and is only randomized after mount: generating it during
  // the initial render would run on both the server (build-time static HTML)
  // and the client, and Math.random() never agrees between the two — a
  // guaranteed hydration mismatch on the whole SVG.
  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => setSeed(randomSeed()), []);

  const problem = useMemo(
    () => (seed === null ? null : generateProblem(type, seed)),
    [type, seed]
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [score, setScore] = useState<ChartTrainingScore | null>(null);

  if (!problem) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/chart-training"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            チャート練習に戻る
          </Link>
          <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
            {typeLabel(type)}
          </h1>
        </div>
        <Card className="h-96 animate-pulse" />
      </div>
    );
  }

  // Narrow to a fresh const: TS won't carry the `if (!problem) return` guard's
  // narrowing into the closures below since `problem` itself is captured by
  // reference across renders.
  const currentProblem = problem;

  function nextProblem() {
    setSeed(randomSeed());
    setSelectedIndex(null);
    setSelectedChoiceId(null);
    setScore(null);
  }

  async function handleSelectCandle(index: number) {
    if (score !== null) return;
    setSelectedIndex(index);
    const result = gradeClickAnswer(currentProblem, index);
    setScore(result);
    await chartTrainingResultsRepo.add({
      id: generateId(),
      type,
      symbol: "TRAINING",
      timeframe: "synthetic",
      correctPosition: String(currentProblem.correctIndex ?? ""),
      userPosition: String(index),
      score: result,
      difficulty: 1,
      createdAt: new Date().toISOString(),
    });
  }

  async function handleSelectChoice(choiceId: string) {
    if (score !== null) return;
    setSelectedChoiceId(choiceId);
    const result = gradeChoiceAnswer(currentProblem, choiceId);
    setScore(result);
    await chartTrainingResultsRepo.add({
      id: generateId(),
      type,
      symbol: "TRAINING",
      timeframe: "synthetic",
      correctPosition: currentProblem.correctChoiceId ?? "",
      userPosition: choiceId,
      score: result,
      difficulty: 1,
      createdAt: new Date().toISOString(),
    });
  }

  const markers: CandlestickMarker[] = [];
  if (score !== null && selectedIndex !== null) {
    markers.push({
      index: selectedIndex,
      color: score === "correct" ? "success" : score === "incorrect" ? "danger" : "primary",
    });
    if (currentProblem.correctIndex !== undefined && currentProblem.correctIndex !== selectedIndex) {
      markers.push({ index: currentProblem.correctIndex, color: "success" });
    }
  }

  const ScoreIcon = score ? SCORE_ICONS[score] : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/chart-training"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          チャート練習に戻る
        </Link>
        <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
          {typeLabel(type)}
        </h1>
      </div>

      <Card>
        <p className="text-sm font-medium text-foreground">{currentProblem.question}</p>

        <div className="mt-4">
          <CandlestickChart
            candles={currentProblem.candles}
            highlightRange={currentProblem.highlightRange}
            markers={markers}
            interactive={currentProblem.interaction === "click" && score === null}
            onSelect={handleSelectCandle}
          />
        </div>

        {currentProblem.interaction === "choice" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {currentProblem.choices?.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const isCorrectChoice = score !== null && choice.id === currentProblem.correctChoiceId;
              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={score !== null}
                  onClick={() => handleSelectChoice(choice.id)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-default ${
                    isCorrectChoice
                      ? "border-success bg-success/10 text-foreground"
                      : isSelected
                        ? "border-danger bg-danger/10 text-foreground"
                        : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        )}

        {score && ScoreIcon && (
          <div className="mt-4 space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${SCORE_STYLES[score]}`}
            >
              <ScoreIcon className="h-4 w-4" />
              {SCORE_LABELS[score]}
            </span>
            <p className="text-sm leading-relaxed text-foreground">
              {currentProblem.explanation}
            </p>
          </div>
        )}

        <Button className="mt-5" variant="secondary" onClick={nextProblem}>
          <RefreshCcw className="h-4 w-4" />
          次の問題
        </Button>
      </Card>
    </div>
  );
}
