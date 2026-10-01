export type LessonBody = {
  explanation: string;
  apply: string;
  easy: string;
  hard: string;
  steps: string[];
};

const HEADING_PREFIX = "## ";
const MARKDOWN_HEADING = "\n## ";
const HEAD_EXPLANATION = "explanation";
const HEAD_APPLY = "apply";
const HEAD_EASY = "easy";
const HEAD_HARD = "hard";
const HEAD_STEPS = "steps";

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
    steps: stepLines(sections.get(HEAD_STEPS) ?? ""),
  };
}

function stepLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));
}
