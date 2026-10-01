import { checkSource, formatSource, runSource, vetSource, type PracticeResult } from "../../../shared/api/practice.ts";
import { MODE_CHECK, MODE_FORMAT, MODE_RUN, MODE_VET } from "../constants/editor.ts";

export function runPracticeAction(mode: string, source: string, lessonId: string, exerciseId: string): Promise<PracticeResult> {
  if (mode === MODE_FORMAT) {
    return formatSource(source);
  }
  if (mode === MODE_VET) {
    return vetSource(source);
  }
  if (mode === MODE_RUN) {
    return runSource(source);
  }
  if (mode === MODE_CHECK) {
    return checkSource(source, lessonId, exerciseId);
  }
  return Promise.resolve({ ok: false, stdout: "", stderr: "", exitCode: 1, unavailable: true });
}
