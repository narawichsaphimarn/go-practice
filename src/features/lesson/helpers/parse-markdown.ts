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

export function lessonBlocks(text: string): { code: boolean; body: string }[] {
  const blocks: { code: boolean; body: string }[] = [];
  const prose: string[] = [];
  let code: string[] | null = null;
  function flushProse() {
    const body = prose.join("\n").trim();
    prose.length = 0;
    if (body.length > 0) {
      blocks.push({ code: false, body });
    }
  }
  for (const line of text.split("\n")) {
    if (code !== null) {
      if (line.startsWith("```")) {
        blocks.push({ code: true, body: code.join("\n").trim() });
        code = null;
      } else {
        code.push(line);
      }
      continue;
    }
    if (line.startsWith("```")) {
      flushProse();
      code = [];
      continue;
    }
    prose.push(line);
  }
  flushProse();
  return blocks;
}
