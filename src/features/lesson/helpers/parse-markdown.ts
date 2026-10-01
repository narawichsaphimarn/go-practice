export type LessonBody = {
  explanation: string;
  apply: string;
  easy: string;
  hard: string;
};

const HEADING_PREFIX = "## ";
const MARKDOWN_HEADING = "\n## ";
const HEAD_EXPLANATION = "explanation";
const HEAD_APPLY = "apply";
const HEAD_EASY = "easy";
const HEAD_HARD = "hard";

export function parseLesson(markdown: string): LessonBody | null {
  const normalized = markdown.startsWith(HEADING_PREFIX) ? `\n${markdown}` : markdown;
  const sections = new Map<string, string>();
  for (const chunk of normalized.split(MARKDOWN_HEADING)) {
    const lineBreak = chunk.indexOf("\n");
    if (lineBreak < 0) {
      continue;
    }
    const title = chunk.slice(0, lineBreak).trim();
    sections.set(title, chunk.slice(lineBreak + 1).trim());
  }
  const explanation = sections.get(HEAD_EXPLANATION) ?? "";
  if (explanation.length === 0) {
    return null;
  }
  return {
    explanation,
    apply: sections.get(HEAD_APPLY) ?? "",
    easy: sections.get(HEAD_EASY) ?? "",
    hard: sections.get(HEAD_HARD) ?? "",
  };
}

export const BLOCK_TEXT = "text";
export const BLOCK_LIST = "list";
export const BLOCK_CODE = "code";

const FENCE = "```";
const LIST_PREFIX = "- ";
const INLINE_CODE = "`";

export type LessonBlock = { kind: string; body: string; items: string[] };

export function lessonBlocks(text: string): LessonBlock[] {
  const blocks: LessonBlock[] = [];
  const prose: string[] = [];
  let code: string[] | null = null;
  function flushProse() {
    const lines = prose.map((line) => line.trim()).filter((line) => line.length > 0);
    prose.length = 0;
    if (lines.length === 0) {
      return;
    }
    if (lines.every((line) => line.startsWith(LIST_PREFIX))) {
      blocks.push({ kind: BLOCK_LIST, body: "", items: lines.map((line) => line.slice(LIST_PREFIX.length)) });
      return;
    }
    blocks.push({ kind: BLOCK_TEXT, body: lines.join(" "), items: [] });
  }
  for (const line of text.split("\n")) {
    if (code !== null) {
      if (line.startsWith(FENCE)) {
        blocks.push({ kind: BLOCK_CODE, body: code.join("\n").trim(), items: [] });
        code = null;
      } else {
        code.push(line);
      }
      continue;
    }
    if (line.startsWith(FENCE)) {
      flushProse();
      code = [];
      continue;
    }
    if (line.trim().length === 0) {
      flushProse();
      continue;
    }
    prose.push(line);
  }
  flushProse();
  return blocks;
}

// Odd-numbered pieces sat between backticks.
export function inlineSpans(text: string): { code: boolean; body: string }[] {
  return text
    .split(INLINE_CODE)
    .map((body, index) => ({ code: index % 2 === 1, body }))
    .filter((span) => span.body.length > 0);
}
