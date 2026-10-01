import { useSyncExternalStore } from "react";
import {
  isPassed,
  markPassed,
  passedCount,
  progressSnapshot,
  rememberLesson,
  subscribeProgress,
} from "../helpers/store.ts";

export function useProgress() {
  const snapshot = useSyncExternalStore(subscribeProgress, progressSnapshot);
  return { snapshot, markPassed, rememberLesson, passedCount, isPassed };
}
