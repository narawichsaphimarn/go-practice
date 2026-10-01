export const BUTTON_TYPE = "button";
export const CLASS_PAGE = "page";

export const LEVEL_BEGINNER = "beginner";
export const LEVEL_ADVANCED = "advanced";
export const LEVEL_PROFESSIONAL = "professional";
export const LEVEL_EXPERT = "expert";

export const EXERCISE_EASY = "easy";
export const EXERCISE_MID = "mid";
export const EXERCISE_HARD = "hard";

export const KIND_STDOUT = "stdout";
export const KIND_TEST = "test";
export const KIND_QUIZ = "quiz";

export const ROUTE_LESSONS = "/lessons/";
export const ROUTE_EXERCISES = "/exercises/";

const API_BASE_URL_DEV = "http://localhost:8080";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || API_BASE_URL_DEV).replace(/\/$/, "");
export const API_FORMAT = "/v1/golang-practice/format";
export const API_VET = "/v1/golang-practice/vet";
export const API_RUN = "/v1/golang-practice/run";
export const API_CHECK = "/v1/golang-practice/check";

export const PROGRESS_DB = "go-practice-progress";
export const STORAGE_KEY_LAST_LESSON = "go-practice.lastLesson";

export const I18N_NOT_FOUND = "shell.notFound";
export const I18N_BACK = "shell.back";
export const I18N_NOT_READY = "shell.notReady";
export const I18N_GOAL = "shell.goal";
export const I18N_EXPLAIN = "shell.explain";
export const I18N_APPLY = "shell.apply";
export const I18N_EASY_CASE = "shell.easyCase";
export const I18N_HARD_CASE = "shell.hardCase";
export const I18N_TO_EXERCISE = "shell.toExercise";
export const I18N_QUESTION = "shell.question";
export const I18N_RULE = "shell.rule";
export const I18N_FORMAT = "shell.format";
export const I18N_VET = "shell.vet";
export const I18N_RUN = "shell.run";
export const I18N_HINT = "shell.hint";
export const I18N_CHECK = "shell.check";
export const I18N_OUTPUT = "shell.output";
export const I18N_WORKING = "shell.working";
export const I18N_PASSED = "shell.passed";
export const I18N_NOT_PASSED = "shell.notPassed";
export const I18N_NEXT_EXERCISE = "shell.nextExercise";
export const I18N_UNAVAILABLE = "shell.unavailable";
export const I18N_SUBMIT = "shell.submit";
export const I18N_QUIZ_WRONG = "shell.quizWrong";
export const I18N_POINTS = "shell.points";
export const I18N_NO_RUN = "shell.noRun";
