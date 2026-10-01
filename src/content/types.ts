import {
  EXERCISE_EASY,
  EXERCISE_HARD,
  EXERCISE_MID,
  EXERCISE_CAPSTONE,
  EXERCISE_TWIST,
  LEVEL_ADVANCED,
  LEVEL_BEGINNER,
  LEVEL_EXPERT,
  LEVEL_PROFESSIONAL,
} from "../shared/constants/content.ts";

export type Localized = {
  th: string;
  en: string;
};

export type ExerciseSpec = {
  id: string;
  difficulty: string;
  kind: string;
  prompt: Localized;
  rule: Localized;
  hint?: Localized;
  starter: string;
  choices?: ChoiceSet;
  answer?: number;
};

export type ChoiceSet = {
  th: string[];
  en: string[];
};

export type LessonSpec = {
  id: string;
  level: string;
  order: number;
  title: Localized;
  goal: Localized;
  exercises: ExerciseSpec[];
};

export type CatalogFile = {
  lessons: LessonSpec[];
};

export const LEVEL_ORDER = [
  LEVEL_BEGINNER,
  LEVEL_ADVANCED,
  LEVEL_PROFESSIONAL,
  LEVEL_EXPERT,
] as const;

export function pointsFor(difficulty: string): number {
  if (difficulty === EXERCISE_EASY) {
    return 1;
  }
  if (difficulty === EXERCISE_MID) {
    return 2;
  }
  if (difficulty === EXERCISE_HARD) {
    return 3;
  }
  if (difficulty === EXERCISE_TWIST || difficulty === EXERCISE_CAPSTONE) {
    return 1;
  }
  return 0;
}

export function exerciseLabel(id: string, twistLabel: string): string {
  if (id === EXERCISE_TWIST) {
    return twistLabel;
  }
  return id;
}
