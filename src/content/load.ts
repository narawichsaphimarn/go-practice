import catalogFile from "./catalog.json";
import { LOCALE_EN, LOCALE_TH } from "../shared/constants/preference.ts";
import type { CatalogFile, LessonSpec, Localized } from "./types.ts";
import { currentLessonId } from "./renames.ts";

const markdownFiles = import.meta.glob("./**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const catalog = catalogFile as CatalogFile;

export function lessons(): LessonSpec[] {
  return [...catalog.lessons].sort((left, right) => left.order - right.order);
}

export function lessonById(id: string): LessonSpec | undefined {
  const current = currentLessonId(id);
  return catalog.lessons.find((lesson) => lesson.id === current);
}

export function nextLesson(lessonId: string): LessonSpec | undefined {
  const all = lessons();
  const index = all.findIndex((lesson) => lesson.id === currentLessonId(lessonId));
  return index === -1 ? undefined : all[index + 1];
}

export function textOf(value: Localized, locale: string): string {
  return locale === LOCALE_TH ? value.th : value.en;
}

export function lessonMarkdown(level: string, id: string, locale: string): string | null {
  const language = locale === LOCALE_TH ? LOCALE_TH : LOCALE_EN;
  const key = `./${level}/${id}/${language}.md`;
  return markdownFiles[key] ?? null;
}
