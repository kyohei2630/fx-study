import { FxDatabase } from "@/db/schema";

// IndexedDB only exists in the browser. Dexie schedules an auto-open shortly
// after construction, which throws in Node during Next.js's static prerender
// pass. Constructing lazily — only when a client effect/handler first needs
// the database — keeps module import side-effect-free.
let instance: FxDatabase | null = null;

export function getDb(): FxDatabase {
  if (!instance) {
    instance = new FxDatabase();
  }
  return instance;
}
