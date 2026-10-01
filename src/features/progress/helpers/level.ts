import {
  LEVEL_ADVANCED,
  LEVEL_BEGINNER,
  LEVEL_EXPERT,
  LEVEL_PROFESSIONAL,
} from "../../../shared/constants/content.ts";
import { lessons } from "../../../content/load.ts";
import { pointsFor, type LessonSpec } from "../../../content/types.ts";

export type LevelId =
  | typeof LEVEL_BEGINNER
  | typeof LEVEL_ADVANCED
  | typeof LEVEL_PROFESSIONAL
  | typeof LEVEL_EXPERT;

const ORDER: LevelId[] = [
  LEVEL_BEGINNER,
  LEVEL_ADVANCED,
  LEVEL_PROFESSIONAL,
  LEVEL_EXPERT,
];

export type LevelScore = Record<LevelId, number>;

export function emptyScores(): LevelScore {
  return {
    [LEVEL_BEGINNER]: 0,
    [LEVEL_ADVANCED]: 0,
    [LEVEL_PROFESSIONAL]: 0,
    [LEVEL_EXPERT]: 0,
  };
}

export function totals(): LevelScore {
  const score = emptyScores();
  for (const lesson of lessons()) {
    score[lesson.level as LevelId] += lesson.exercises.reduce(
      (sum, exercise) => sum + pointsFor(exercise.difficulty),
      0,
    );
  }
  return score;
}

export function currentLevel(earned: LevelScore, full: LevelScore): LevelId | null {
  let reached: LevelId | null = null;
  for (const level of ORDER) {
    if (!meetsThreshold(earned[level], full[level])) {
      break;
    }
    reached = level;
  }
  return reached;
}

function meetsThreshold(earned: number, full: number): boolean {
  return full > 0 && earned * 5 >= full * 4;
}

export function lessonPoints(lesson: LessonSpec, passedIds: string[]): number {
  return lesson.exercises.reduce((sum, exercise) => {
    if (!passedIds.includes(exercise.id)) {
      return sum;
    }
    return sum + pointsFor(exercise.difficulty);
  }, 0);
}
