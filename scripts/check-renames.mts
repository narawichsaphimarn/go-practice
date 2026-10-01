// Checks the progress/draft id migration in src/content/renames.ts. Usage: node scripts/check-renames.mts
globalThis.localStorage = { store: {}, getItem(k) { return this.store[k] ?? null; }, setItem(k, v) { this.store[k] = String(v); } };
const { pendingRenames, currentLessonId } = await import(new URL("../src/content/renames.ts", import.meta.url).href);
const assert = (c, m) => { if (!c) throw new Error(m); };
const p = pendingRenames("progress");
assert(p.rename("b08-errors/mid") === "b08-errors/hard", "swap mid");
assert(p.rename("b08-errors/hard") === "b08-errors/mid", "swap hard");
assert(p.rename("b07-pointers/easy") === "b06-pointers/easy", "lesson rename");
assert(p.rename("b07-pointers/hard") === "b07-structs/hard", "exercise override");
assert(p.rename("b10-defer/hard") === "b11-panic/mid", "split");
assert(p.rename("a01-interfaces/easy") === "a01-interfaces/easy", "untouched");
p.done();
assert(pendingRenames("progress") === null, "runs once");
assert(pendingRenames("drafts") !== null, "per store");
assert(currentLessonId("b06-structs") === "b07-structs" && currentLessonId("b07-structs") === "b07-structs", "lesson alias idempotent");
console.log("renames ok");
