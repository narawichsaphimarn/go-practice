import { ROUTE_EXERCISES, ROUTE_LESSONS } from "../constants/content.ts";
import { ROUTE_HOME } from "../constants/preference.ts";

export function routerBasename(): string {
  const base = import.meta.env.BASE_URL;
  if (base === ROUTE_HOME) {
    return ROUTE_HOME;
  }
  if (base.endsWith(ROUTE_HOME)) {
    return base.slice(0, -1);
  }
  return base;
}

export function lessonPath(lessonId: string): string {
  return `${ROUTE_LESSONS}${lessonId}`;
}

export function exercisePath(lessonId: string, exerciseId: string): string {
  return `${ROUTE_LESSONS}${lessonId}${ROUTE_EXERCISES}${exerciseId}`;
}
