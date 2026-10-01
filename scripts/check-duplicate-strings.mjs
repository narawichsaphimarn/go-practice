import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const minLength = 3;
const maxOccurrences = 3;
const counts = new Map();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      scan(full);
    }
  }
}

function scan(file) {
  const text = fs
    .readFileSync(file, "utf8")
    .replace(/\bfrom\s+["'][^"']+["']/g, "")
    .replace(/\bimport\s+["'][^"']+["']/g, "");
  const pattern = /(["'])(?:\\.|(?!\1)[^\\\n])*\1/g;
  for (const match of text.matchAll(pattern)) {
    const raw = match[0];
    const value = raw.slice(1, -1);
    if (value.length < minLength) {
      continue;
    }
    const hits = counts.get(value) ?? [];
    hits.push(path.relative(root, file));
    counts.set(value, hits);
  }
}

walk(root);

const duplicates = [...counts.entries()].filter(([, hits]) => hits.length > maxOccurrences);
if (duplicates.length === 0) {
  process.exit(0);
}

for (const [value, hits] of duplicates) {
  console.error(`"${value}" appears ${hits.length} times (max ${maxOccurrences}): ${hits.join(", ")}`);
}
process.exit(1);
