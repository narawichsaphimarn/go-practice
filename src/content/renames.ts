import { readStorage, writeStorage } from "../features/preferences/helpers/preference.ts";

// Ids that changed after learners already saved progress. Each step runs once per store, in order.
// A key is a lesson id or "lesson/exercise"; an exercise key wins over its lesson key.
const RENAME_STEPS: Record<string, string>[] = [
  {
    "b06-structs": "b07-structs",
    "b07-pointers": "b06-pointers",
    "b04-functions/twist": "b04-functions/hard",
    "b05-collections/twist": "b05-collections/hard",
    "b07-pointers/hard": "b07-structs/hard",
    "b08-errors/mid": "b08-errors/hard",
    "b08-errors/hard": "b08-errors/mid",
    "b10-defer/twist": "b10-defer/hard",
    "b10-defer/hard": "b11-panic/mid",
  },
];

const STEP_KEY_PREFIX = "go-practice.renames.";
const KEY_SEPARATOR = "/";

function renameWith(step: Record<string, string>, key: string): string {
  if (step[key]) {
    return step[key];
  }
  const [lessonId, ...rest] = key.split(KEY_SEPARATOR);
  const renamed = step[lessonId];
  return renamed ? [renamed, ...rest].join(KEY_SEPARATOR) : key;
}

// Lesson-level renames never reuse an old id, so this is safe to apply to new ids too (old links, last lesson).
export function currentLessonId(id: string): string {
  return RENAME_STEPS.reduce((current, step) => step[current] ?? current, id);
}

// Returns the renamer for steps this store has not applied yet. Call done() after the renamed keys are saved.
export function pendingRenames(store: string): { rename: (key: string) => string; done: () => void } | null {
  const storageKey = STEP_KEY_PREFIX + store;
  const applied = Number(readStorage(storageKey) ?? 0);
  const steps = RENAME_STEPS.slice(applied);
  if (steps.length === 0) {
    return null;
  }
  return {
    rename: (key) => steps.reduce((current, step) => renameWith(step, current), key),
    done: () => writeStorage(storageKey, String(RENAME_STEPS.length)),
  };
}
