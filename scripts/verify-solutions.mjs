// Runs every reference solution against its hidden check, and checks that the starter does not already pass.
// Usage: node scripts/verify-solutions.mjs [lesson-id-prefix]
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { lessons } from "./curriculum/index.mjs";

// Same module file the backend sandbox writes.
const MOD_BODY = "module practice\n\ngo 1.25\n";
const prefix = process.argv[2] ?? "";
const work = fs.mkdtempSync(path.join(os.tmpdir(), "go-practice-"));
let failures = 0;
let checked = 0;

function run(source, server) {
  const dir = fs.mkdtempSync(path.join(work, "x"));
  fs.writeFileSync(path.join(dir, "go.mod"), MOD_BODY);
  fs.writeFileSync(path.join(dir, "main.go"), source);
  if (server.kind === "test") {
    fs.writeFileSync(path.join(dir, "main_test.go"), server.test);
    const result = spawnSync("go", ["test", "./..."], { cwd: dir, encoding: "utf8" });
    return { ok: result.status === 0, detail: result.stdout + result.stderr };
  }
  const result = spawnSync("go", ["run", "."], { cwd: dir, encoding: "utf8" });
  if (server.kind === "panic") {
    return { ok: result.status !== 0 && result.stderr.includes(server.needle), detail: result.stderr };
  }
  return { ok: result.status === 0 && result.stdout === server.expected, detail: result.stdout + result.stderr };
}

for (const lesson of lessons) {
  if (!lesson.id.startsWith(prefix)) {
    continue;
  }
  for (const exercise of lesson.exercises) {
    if (!exercise.solution || !exercise.server) {
      continue;
    }
    checked++;
    const name = `${lesson.id}/${exercise.id}`;
    const solution = run(exercise.solution, exercise.server);
    if (!solution.ok) {
      failures++;
      console.error(`FAIL solution ${name}\n${solution.detail}`);
    }
    if (run(exercise.starter, exercise.server).ok) {
      failures++;
      console.error(`FAIL starter already passes ${name}`);
    }
  }
}

fs.rmSync(work, { recursive: true, force: true });
console.log(`${checked} exercises checked, ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
