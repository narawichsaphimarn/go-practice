import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { lessons } from "./curriculum/index.mjs";

const contentRoot = path.resolve("src/content");
const checksPath = path.resolve(
  import.meta.dirname,
  "../../station-track-backend/internal/products/golangpractice/application/checks.json",
);

const catalog = { lessons: lessons.map(publishLesson) };
const checks = {};

for (const lesson of lessons) {
  const dir = path.join(contentRoot, lesson.level, lesson.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "th.md"), markdown("th", lesson), "utf8");
  fs.writeFileSync(path.join(dir, "en.md"), markdown("en", lesson), "utf8");
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

function publishLesson(lesson) {
  return {
    id: lesson.id,
    level: lesson.level,
    order: lesson.order,
    title: lesson.title,
    goal: lesson.goal,
    exercises: lesson.exercises.map(publishExercise),
  };
}

function publishExercise(exercise) {
  const published = {
    id: exercise.id,
    difficulty: exercise.id,
    kind: exercise.kind,
    prompt: exercise.prompt,
    rule: exercise.rule,
    starter: exercise.starter ? formatGo(exercise.starter) : "",
  };
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
