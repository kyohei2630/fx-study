import { getDb } from "@/db/db";
import { TABLE_NAMES } from "@/db/schema";

export interface BackupFile {
  app: "fx-learning-app";
  schemaVersion: number;
  exportedAt: string;
  data: Partial<Record<(typeof TABLE_NAMES)[number], unknown[]>>;
}

export async function buildBackup(): Promise<BackupFile> {
  const db = getDb();
  const data: BackupFile["data"] = {};

  for (const tableName of TABLE_NAMES) {
    data[tableName] = await db[tableName].toArray();
  }

  return {
    app: "fx-learning-app",
    schemaVersion: db.verno,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function backupFileName(date: Date = new Date()): string {
  const iso = date.toISOString().slice(0, 10);
  return `fx-app-backup-${iso}.json`;
}

export async function downloadBackup(): Promise<void> {
  const backup = await buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = backupFileName();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
