"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonBody } from "@/components/learning/LessonBody";
import { LessonStatusBadge } from "@/components/learning/LessonStatusBadge";
import { LESSONS, LESSONS_BY_ID } from "@/data/lessons/lessons";
import { QUIZZES_BY_LESSON } from "@/data/lessons/quizzes";
import {
  getProgressMap,
  markLessonOpened,
  recordQuizResult,
} from "@/lib/learning/progress";
import type { LearningStatus } from "@/types";

export function LessonDetailClient({ lessonId }: { lessonId: string }) {
  const lesson = LESSONS_BY_ID[lessonId];
  const quizzes = useMemo(() => QUIZZES_BY_LESSON[lessonId] ?? [], [lessonId]);

  const [status, setStatus] = useState<LearningStatus>("not_started");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setCorrectCount(0);

    (async () => {
      await markLessonOpened(lessonId);
      const map = await getProgressMap();
      setStatus(map[lessonId]?.status ?? "in_progress");
    })();
  }, [lessonId]);

  if (!lesson) return null;

  const currentIndex = LESSONS.findIndex((l) => l.id === lessonId);
  const prevLesson = LESSONS[currentIndex - 1];
  const nextLesson = LESSONS[currentIndex + 1];
  const allAnswered = quizzes.every((q) => answers[q.id]);

  async function handleSubmit() {
    const correct = quizzes.filter((q) => answers[q.id] === q.answer).length;
    setCorrectCount(correct);
    setSubmitted(true);
    const newStatus = await recordQuizResult(lessonId, correct, quizzes.length);
    setStatus(newStatus);
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setCorrectCount(0);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/learning"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          学習に戻る
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            STEP {lesson.step}
          </span>
          <LessonStatusBadge status={status} />
        </div>
        <h1 className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
          {lesson.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{lesson.description}</p>
      </div>

      <Card>
        <LessonBody content={lesson.content} />
      </Card>

      {quizzes.length > 0 && (
        <Card>
          <h2 className="text-base font-bold text-foreground">理解確認クイズ</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            全問正解でこのレッスンが「完了」になります。何度でも挑戦できます。
          </p>

          <div className="mt-4 space-y-5">
            {quizzes.map((quiz, qIndex) => {
              const selected = answers[quiz.id];
              const isCorrect = selected === quiz.answer;
              return (
                <div key={quiz.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm font-semibold text-foreground">
                    Q{qIndex + 1}. {quiz.question}
                  </p>
                  <div className="mt-3 space-y-2">
                    {quiz.options.map((option) => {
                      const isSelected = selected === option.id;
                      const showAsCorrect = submitted && option.id === quiz.answer;
                      const showAsWrong =
                        submitted && isSelected && option.id !== quiz.answer;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [quiz.id]: option.id }))
                          }
                          className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${
                            showAsCorrect
                              ? "border-success bg-success/10 text-foreground"
                              : showAsWrong
                                ? "border-danger bg-danger/10 text-foreground"
                                : isSelected
                                  ? "border-primary bg-primary/5 text-foreground"
                                  : "border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {option.label}
                          {showAsCorrect && <Check className="h-4 w-4 shrink-0 text-success" />}
                          {showAsWrong && <X className="h-4 w-4 shrink-0 text-danger" />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p
                      className={`mt-2 text-xs leading-relaxed ${isCorrect ? "text-success" : "text-muted-foreground"}`}
                    >
                      {quiz.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <Button className="mt-5" onClick={handleSubmit} disabled={!allAnswered}>
              採点する
            </Button>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold text-foreground">
                {correctCount} / {quizzes.length} 問正解
                {correctCount === quizzes.length
                  ? "・レッスン完了です！"
                  : "・もう一度挑戦してみましょう"}
              </p>
              {correctCount < quizzes.length && (
                <Button variant="secondary" onClick={handleRetry}>
                  もう一度挑戦する
                </Button>
              )}
            </div>
          )}
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        {prevLesson ? (
          <Link href={`/learning/${prevLesson.id}`}>
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <span />
        )}
        {nextLesson && (
          <Link href={`/learning/${nextLesson.id}`}>
            <Button variant="secondary">
              {nextLesson.title}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
