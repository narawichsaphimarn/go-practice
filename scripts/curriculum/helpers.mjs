export function text(th, en) {
  return { th, en };
}

export function copy(th, en) {
  return {
    th: section(th),
    en: section(en),
  };
}

function section(parts) {
  return {
    explanation: parts[0],
    apply: parts[1],
    easy: parts[2],
    hard: parts[3],
    steps: parts[4],
  };
}

export function stdout(prompt, rule, starter, expected) {
  return {
    id: prompt.id,
    kind: "stdout",
    prompt: text(prompt.th, prompt.en),
    rule: text(rule.th, rule.en),
    starter,
    server: { kind: "stdout", expected },
  };
}

export function testEx(prompt, rule, starter, test) {
  return {
    id: prompt.id,
    kind: "test",
    prompt: text(prompt.th, prompt.en),
    rule: text(rule.th, rule.en),
    starter,
    server: { kind: "test", test: formatLater(test) },
  };
}

export function panicEx(prompt, rule, starter, needle) {
  return {
    id: prompt.id,
    kind: "stdout",
    prompt: text(prompt.th, prompt.en),
    rule: text(rule.th, rule.en),
    starter,
    server: { kind: "panic", needle },
  };
}

export function quiz(prompt, rule, choices, answer) {
  return {
    id: prompt.id,
    kind: "quiz",
    prompt: text(prompt.th, prompt.en),
    rule: text(rule.th, rule.en),
    starter: "",
    choices: { th: choices.th, en: choices.en },
    answer,
  };
}

function formatLater(source) {
  return source;
}

export function lesson(spec) {
  return spec;
}

export function withHint(exercise, th, en) {
  return { ...exercise, hint: text(th, en) };
}

// A reference answer for scripts/verify-solutions.mjs. It is never published.
export function solved(exercise, solution) {
  return { ...exercise, solution };
}

export const exact = {
  th: "ผลที่พิมพ์ต้องตรงทุกตัวอักษร รวมการขึ้นบรรทัดใหม่ท้ายสุด (Println ขึ้นบรรทัดใหม่ให้เอง)",
  en: "Printed output must match every character, including the final newline (Println adds it for you)",
};

export const tests = {
  th: "ฟังก์ชันต้องผ่านเทสต์ที่ซ่อนไว้",
  en: "The function must pass the hidden tests",
};

export const panicRule = {
  th: "โปรแกรมต้อง panic เพราะ nil pointer ตอนรันจากหน้า editor",
  en: "The program must panic on a nil pointer when run from the editor",
};
