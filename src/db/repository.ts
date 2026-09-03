import type { Table, UpdateSpec } from "dexie";
import { getDb } from "@/db/db";
import type { TableName } from "@/db/schema";

export interface Repository<T> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  add(item: T): Promise<string>;
  bulkAdd(items: T[]): Promise<void>;
  bulkPut(items: T[]): Promise<void>;
  /** Insert-or-overwrite by primary key. Safe to call concurrently with itself. */
  upsert(item: T): Promise<string>;
  update(id: string, changes: Partial<T>): Promise<number>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
  count(): Promise<number>;
}

export function createRepository<T extends { id: string }>(
  tableName: TableName
): Repository<T> {
  const table = () => getDb()[tableName] as unknown as Table<T, string, T>;

  return {
    list: () => table().toArray(),
    get: (id) => table().get(id),
    add: async (item) => {
      await table().add(item);
      return item.id;
    },
    bulkAdd: async (items) => {
      await table().bulkAdd(items);
    },
    bulkPut: async (items) => {
      await table().bulkPut(items);
    },
    upsert: async (item) => {
      await table().put(item);
      return item.id;
    },
    update: (id, changes) => table().update(id, changes as UpdateSpec<T>),
    remove: async (id) => {
      await table().delete(id);
    },
    clear: async () => {
      await table().clear();
    },
    count: () => table().count(),
  };
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
