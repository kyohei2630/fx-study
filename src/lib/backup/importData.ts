import type { Table } from "dexie";
import { getDb } from "@/db/db";
import { TABLE_NAMES, type TableName } from "@/db/schema";
import type { BackupFile } from "@/lib/backup/exportData";

type AnyRecord = Record<string, unknown> & { id: string };

export type ImportMode = "merge" | "replace";

export interface ImportSummary {
  table: TableName;
  count: number;
}

function isBackupFile(value: unknown): value is BackupFile {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.app === "fx-learning-app" &&
    typeof candidate.data === "object" &&
    candidate.data !== null
  );
}

export function parseBackupJson(text: string): BackupFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("JSONとして読み込めませんでした。ファイルを確認してください。");
  }
  if (!isBackupFile(parsed)) {
    throw new Error("このアプリのバックアップファイルではないようです。");
  }
  return parsed;
}

export async function restoreBackup(
  backup: BackupFile,
  mode: ImportMode
): Promise<ImportSummary[]> {
  const db = getDb();
  const summaries: ImportSummary[] = [];

  await db.transaction("rw", TABLE_NAMES.map((name) => db[name]), async () => {
    for (const tableName of TABLE_NAMES) {
      const rows = backup.data[tableName];
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const table = db[tableName] as unknown as Table<AnyRecord, string, AnyRecord>;
      if (mode === "replace") {
        await table.clear();
      }
      await table.bulkPut(rows as AnyRecord[]);
      summaries.push({ table: tableName, count: rows.length });
    }
  });

  return summaries;
}
