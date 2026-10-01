import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { lessons } from "./curriculum/index.mjs";

const contentRoot = path.resolve("src/content");
const checksPath = path.resolve(
  import.meta.dirname,
  "../../station-track-backend/internal/products/golangpractice/application/checks.json",
);

const keptHints = previousHints();
const catalog = { lessons: lessons.map((lesson) => publishLesson(lesson, keptHints)) };
const checks = {};

for (const lesson of lessons) {
  const dir = path.join(contentRoot, lesson.level, lesson.id);
  fs.mkdirSync(dir, { recursive: true });
  writeLessonMarkdown(dir, "th", lesson);
  writeLessonMarkdown(dir, "en", lesson);
  for (const exercise of lesson.exercises) {
    if (!exercise.server) {
      continue;
    }
    const server = { ...exercise.server };
    if (server.test) {
      server.test = formatGo(server.test);
    }
    checks[`${lesson.id}/${exercise.id}`] = server;
  }
}

fs.writeFileSync(path.join(contentRoot, "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
fs.mkdirSync(path.dirname(checksPath), { recursive: true });
fs.writeFileSync(checksPath, `${JSON.stringify(checks, null, 2)}\n`, "utf8");

function writeLessonMarkdown(dir, language, lesson) {
  const file = path.join(dir, `${language}.md`);
  if (fs.existsSync(file)) {
    return;
  }
  fs.writeFileSync(file, markdown(language, lesson), "utf8");
}

function previousHints() {
  const file = path.join(contentRoot, "catalog.json");
  if (!fs.existsSync(file)) {
    return new Map();
  }
  const previous = JSON.parse(fs.readFileSync(file, "utf8"));
  const hints = new Map();
  for (const lesson of previous.lessons ?? []) {
    for (const exercise of lesson.exercises ?? []) {
      if (exercise.hint) {
        hints.set(`${lesson.id}/${exercise.id}`, exercise.hint);
      }
    }
  }
  return hints;
}

function publishLesson(lesson, hints) {
  return {
    id: lesson.id,
    level: lesson.level,
    order: lesson.order,
    title: lesson.title,
    goal: lesson.goal,
    exercises: lesson.exercises.map((exercise) => publishExercise(exercise, hints.get(`${lesson.id}/${exercise.id}`))),
  };
}

function publishExercise(exercise, keptHint) {
  const published = {
    id: exercise.id,
    difficulty: exercise.difficulty ?? exercise.id,
    kind: exercise.kind,
    prompt: exercise.prompt,
    rule: exercise.rule,
    starter: exercise.starter ? formatGo(exercise.starter) : "",
  };
  const hint = exercise.hint ?? keptHint;
  if (hint) {
    published.hint = hint;
  }
  if (exercise.choices) {
    published.choices = exercise.choices;
    published.answer = exercise.answer;
  }
  return published;
}

function markdown(language, lesson) {
  const copy = lesson.copy[language];
  return [
    "## explanation",
    copy.explanation,
    "",
    "## apply",
    copy.apply,
    "",
    "## easy",
    copy.easy,
    "",
    "## hard",
    copy.hard,
    "",
    "## steps",
    ...copy.steps.map((step) => `- ${step}`),
    "",
  ].join("\n");
}

function formatGo(source) {
  return execFileSync("gofmt", { input: source, encoding: "utf8" });
}
