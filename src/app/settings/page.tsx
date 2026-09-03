"use client";

import { useEffect, useRef, useState } from "react";
import { Database, Download, FileSpreadsheet, Upload, Trash2 } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getDb } from "@/db/db";
import { TABLE_NAMES } from "@/db/schema";
import {
  backtestsRepo,
  strategiesRepo,
  strategyVersionsRepo,
  tradesRepo,
} from "@/db/repositories";
import { downloadBackup } from "@/lib/backup/exportData";
import {
  exportBacktestsCsv,
  exportConditionsCsv,
  exportStrategyVersionsCsv,
  exportTradesCsv,
} from "@/lib/backup/csvExports";
import {
  parseBackupJson,
  restoreBackup,
  type ImportMode,
  type ImportSummary,
} from "@/lib/backup/importData";

const TABLE_LABELS: Record<(typeof TABLE_NAMES)[number], string> = {
  learningProgress: "学習進捗",
  lessons: "学習コンテンツ",
  quizzes: "クイズ",
  chartTrainingResults: "チャート問題結果",
  observations: "観察記録",
  hypotheses: "仮説",
  indicators: "インジケーター",
  strategies: "戦略",
  strategyVersions: "戦略Version",
  trades: "トレード記録",
  tradeConditions: "トレード条件",
  backtests: "バックテスト",
  improvementNotes: "改善メモ",
};

export default function SettingsPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refreshCounts() {
    const db = getDb();
    const entries = await Promise.all(
      TABLE_NAMES.map(async (name) => [name, await db[name].count()] as const)
    );
    setCounts(Object.fromEntries(entries));
  }

  useEffect(() => {
    refreshCounts();
  }, []);

  const totalRecords = counts
    ? Object.values(counts).reduce((sum, n) => sum + n, 0)
    : null;

  async function handleExport() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      await downloadBackup();
      setStatus("バックアップをダウンロードしました。");
    } catch {
      setError("エクスポートに失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (
      mode === "replace" &&
      !window.confirm(
        "既存データをすべて置き換えます。この操作は元に戻せません。続行しますか？"
      )
    ) {
      return;
    }

    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const text = await file.text();
      const backup = parseBackupJson(text);
      const summaries: ImportSummary[] = await restoreBackup(backup, mode);
      const total = summaries.reduce((sum, s) => sum + s.count, 0);
      setStatus(`${total}件のデータを読み込みました（${mode === "replace" ? "置き換え" : "追加"}）。`);
      await refreshCounts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "インポートに失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  async function handleCsvExport(kind: "trades" | "backtests" | "strategyVersions" | "conditions") {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      if (kind === "trades") {
        exportTradesCsv(await tradesRepo.list());
      } else if (kind === "backtests") {
        exportBacktestsCsv(await backtestsRepo.list());
      } else {
        const [strategies, versions] = await Promise.all([
          strategiesRepo.list(),
          strategyVersionsRepo.list(),
        ]);
        if (kind === "strategyVersions") {
          exportStrategyVersionsCsv(strategies, versions);
        } else {
          exportConditionsCsv(strategies, versions);
        }
      }
      setStatus("CSVをダウンロードしました。");
    } catch {
      setError("CSVエクスポートに失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "すべてのデータを完全に削除します。この操作は元に戻せません。本当に削除しますか？"
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const db = getDb();
      await db.transaction("rw", TABLE_NAMES.map((n) => db[n]), async () => {
        for (const name of TABLE_NAMES) {
          await db[name].clear();
        }
      });
      setStatus("すべてのデータを削除しました。");
      await refreshCounts();
    } catch {
      setError("削除に失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          データ管理
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          すべてのデータは端末内（IndexedDB）に保存されます。外部サーバーには送信されません。
        </p>
      </div>

      {(status || error) && (
        <div
          className={
            error
              ? "rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
              : "rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
          }
        >
          {error ?? status}
        </div>
      )}

      <Card>
        <CardTitle>保存データ</CardTitle>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-foreground">
            {totalRecords === null ? "読み込み中..." : `合計 ${totalRecords} 件のレコード`}
          </p>
        </div>
        {counts && (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-3">
            {TABLE_NAMES.map((name) => (
              <div key={name} className="flex justify-between gap-2">
                <dt>{TABLE_LABELS[name]}</dt>
                <dd className="font-medium text-foreground">{counts[name] ?? 0}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      <Card>
        <CardTitle>バックアップ（Export）</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          全データをJSONファイルとして書き出します。定期的なバックアップをおすすめします。
        </p>
        <Button className="mt-4" onClick={handleExport} disabled={busy}>
          <Download className="h-4 w-4" />
          JSONをエクスポート
        </Button>
      </Card>

      <Card>
        <CardTitle>CSV出力</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          分析用に、各データを表計算ソフトで開けるCSV形式で書き出します。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleCsvExport("trades")} disabled={busy}>
            <FileSpreadsheet className="h-4 w-4" />
            トレード記録
          </Button>
          <Button variant="secondary" onClick={() => handleCsvExport("backtests")} disabled={busy}>
            <FileSpreadsheet className="h-4 w-4" />
            バックテスト
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleCsvExport("strategyVersions")}
            disabled={busy}
          >
            <FileSpreadsheet className="h-4 w-4" />
            戦略Version
          </Button>
          <Button variant="secondary" onClick={() => handleCsvExport("conditions")} disabled={busy}>
            <FileSpreadsheet className="h-4 w-4" />
            条件チェックリスト
          </Button>
        </div>
      </Card>

      <Card>
        <CardTitle>復元（Import）</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          バックアップJSONを読み込みます。取り込み方法を選んでください。
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="import-mode"
              checked={mode === "merge"}
              onChange={() => setMode("merge")}
            />
            既存データを維持して追加
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name="import-mode"
              checked={mode === "replace"}
              onChange={() => setMode("replace")}
            />
            既存データを置き換え
          </label>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          className="mt-4"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          <Upload className="h-4 w-4" />
          JSONファイルを選択
        </Button>
      </Card>

      <Card>
        <CardTitle>データの初期化</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          すべてのデータを完全に削除します。事前にエクスポートしておくことをおすすめします。
        </p>
        <Button
          className="mt-4 bg-danger text-white hover:opacity-90"
          onClick={handleReset}
          disabled={busy}
        >
          <Trash2 className="h-4 w-4" />
          すべてのデータを削除
        </Button>
      </Card>
    </div>
  );
}
