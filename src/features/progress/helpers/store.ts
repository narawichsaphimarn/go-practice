import { PROGRESS_FEATURE_ID } from "../constants/feature.ts";
import { PROGRESS_DB, STORAGE_KEY_LAST_LESSON } from "../../../shared/constants/content.ts";
import { writeStorage } from "../../preferences/helpers/preference.ts";
import { lessonById, lessons } from "../../../content/load.ts";
import { pointsFor } from "../../../content/types.ts";
import { currentLessonId, pendingRenames } from "../../../content/renames.ts";
import { currentLevel, emptyScores, lessonPoints, totals, type LevelId, type LevelScore } from "./level.ts";

export type ProgressRow = {
  id: string;
  lessonId: string;
  exerciseId: string;
  points: number;
};

export type ProgressSnapshot = {
  rows: ProgressRow[];
  earned: LevelScore;
  full: LevelScore;
  level: LevelId | null;
  lastLessonId: string;
};

const listeners = new Set<() => void>();
let snapshot: ProgressSnapshot = {
  rows: [],
  earned: emptyScores(),
  full: totals(),
  level: null,
  lastLessonId: readLastLesson(),
};

function readLastLesson(): string {
  try {
    return currentLessonId(localStorage.getItem(STORAGE_KEY_LAST_LESSON) ?? "");
  } catch {
    return "";
  }
}

function rowId(lessonId: string, exerciseId: string): string {
  return `${lessonId}/${exerciseId}`;
}

function derive(rows: ProgressRow[]): ProgressSnapshot {
  const earned = emptyScores();
  for (const lesson of lessons()) {
    const passed = rows.filter((row) => row.lessonId === lesson.id).map((row) => row.exerciseId);
    earned[lesson.level as LevelId] += lessonPoints(lesson, passed);
  }
  const full = totals();
  return {
    rows,
    earned,
    full,
    level: currentLevel(earned, full),
    lastLessonId: readLastLesson(),
  };
}

function emit(rows: ProgressRow[]): void {
  snapshot = derive(rows);
  for (const listener of listeners) {
    listener();
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROGRESS_DB, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(PROGRESS_FEATURE_ID, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readRows(): Promise<ProgressRow[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const store = db.transaction(PROGRESS_FEATURE_ID).objectStore(PROGRESS_FEATURE_ID);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as ProgressRow[]);
    request.onerror = () => reject(request.error);
  });
}

async function renameRows(rows: ProgressRow[]): Promise<ProgressRow[]> {
  const pending = pendingRenames(PROGRESS_FEATURE_ID);
  if (!pending) {
    return rows;
  }
  const renamed = new Map<string, ProgressRow>();
  for (const row of rows) {
    const id = pending.rename(row.id);
    const [lessonId, exerciseId] = id.split("/");
    renamed.set(id, { ...row, id, lessonId, exerciseId });
  }
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(PROGRESS_FEATURE_ID, "readwrite");
    const store = transaction.objectStore(PROGRESS_FEATURE_ID);
    store.clear();
    for (const row of renamed.values()) {
      store.put(row);
    }
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  pending.done();
  return [...renamed.values()];
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function progressSnapshot(): ProgressSnapshot {
  return snapshot;
}

export function rememberLesson(lessonId: string): void {
  writeStorage(STORAGE_KEY_LAST_LESSON, lessonId);
  snapshot = { ...snapshot, lastLessonId: lessonId };
  for (const listener of listeners) {
    listener();
  }
}

export async function markPassed(lessonId: string, exerciseId: string): Promise<boolean> {
  const id = rowId(lessonId, exerciseId);
  if (snapshot.rows.some((row) => row.id === id)) {
    return false;
  }
  const lesson = lessonById(lessonId);
  const exercise = lesson?.exercises.find((item) => item.id === exerciseId);
  if (!exercise) {
    return false;
  }
  const row: ProgressRow = {
    id,
    lessonId,
    exerciseId,
    points: pointsFor(exercise.difficulty),
  };
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const store = db.transaction(PROGRESS_FEATURE_ID, "readwrite").objectStore(PROGRESS_FEATURE_ID);
    const request = store.add(row);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  emit([...snapshot.rows, row]);
  return true;
}

export function passedCount(lessonId: string): number {
  return snapshot.rows.filter((row) => row.lessonId === lessonId).length;
}

export function isPassed(lessonId: string, exerciseId: string): boolean {
  return snapshot.rows.some((row) => row.id === rowId(lessonId, exerciseId));
}

void readRows()
  .then(renameRows)
  .then((rows) => emit(rows))
  .catch(() => undefined);
