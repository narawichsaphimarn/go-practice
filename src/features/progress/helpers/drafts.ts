import { STORAGE_KEY_DRAFTS } from "../../../shared/constants/content.ts";
import { writeStorage } from "../../preferences/helpers/preference.ts";
import { pendingRenames } from "../../../content/renames.ts";

const DRAFTS_STORE = "drafts";

export type Draft = {
  source?: string;
  pick?: number;
};

function draftId(lessonId: string, exerciseId: string): string {
  return `${lessonId}/${exerciseId}`;
}

const ESCAPED_NEWLINE = "\\n";
const ESCAPED_TAB = "\\t";
const ESCAPED_QUOTE = '\\"';

function sourceText(source: string): string {
  if (source.includes("\n") || !source.includes(ESCAPED_NEWLINE)) {
    return source;
  }
  return source.replaceAll(ESCAPED_NEWLINE, "\n").replaceAll(ESCAPED_TAB, "\t").replaceAll(ESCAPED_QUOTE, '"');
}

function asDraft(value: unknown): Draft {
  if (!value || typeof value !== "object") {
    return {};
  }
  const record = value as { source?: unknown; pick?: unknown };
  const draft: Draft = {};
  if (typeof record.source === "string") {
    draft.source = sourceText(record.source);
  }
  if (typeof record.pick === "number") {
    draft.pick = record.pick;
  }
  return draft;
}

function readAll(): Record<string, Draft> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFTS);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    const drafts: Record<string, Draft> = {};
    for (const [id, value] of Object.entries(parsed)) {
      drafts[id] = asDraft(value);
    }
    return drafts;
  } catch {
    return {};
  }
}

function renameDrafts(): void {
  const pending = pendingRenames(DRAFTS_STORE);
  if (!pending) {
    return;
  }
  const renamed: Record<string, Draft> = {};
  for (const [id, draft] of Object.entries(readAll())) {
    renamed[pending.rename(id)] = draft;
  }
  writeStorage(STORAGE_KEY_DRAFTS, JSON.stringify(renamed));
  pending.done();
}

renameDrafts();

export function readDraft(lessonId: string, exerciseId: string): Draft | undefined {
  const draft = readAll()[draftId(lessonId, exerciseId)];
  if (!draft || (draft.source === undefined && draft.pick === undefined)) {
    return undefined;
  }
  return draft;
}

export function writeDraft(lessonId: string, exerciseId: string, patch: Draft): void {
  const all = readAll();
  const id = draftId(lessonId, exerciseId);
  all[id] = { ...all[id], ...patch };
  writeStorage(STORAGE_KEY_DRAFTS, JSON.stringify(all));
}
