import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { lessonById, textOf } from "../../../content/load.ts";
import type { ExerciseSpec, LessonSpec } from "../../../content/types.ts";
import { usePreferences } from "../../preferences/components/usePreferences.ts";
import { useProgress } from "../../progress/components/useProgress.ts";
import {
  BUTTON_TYPE,
  CLASS_PAGE,
  I18N_BACK,
  I18N_BACK_TO_LESSON,
  I18N_CHECK,
  I18N_FORMAT,
  I18N_HINT,
  I18N_NEXT_EXERCISE,
  I18N_NOT_FOUND,
  I18N_PREV_EXERCISE,
  I18N_NOT_PASSED,
  I18N_OUTPUT,
  I18N_PASSED,
  I18N_QUESTION,
  I18N_RUN,
  I18N_UNAVAILABLE,
  I18N_VET,
  I18N_WORKING,
  KIND_QUIZ,
} from "../../../shared/constants/content.ts";
import { ROUTE_HOME } from "../../../shared/constants/preference.ts";
import { exercisePath, lessonPath } from "../../../shared/helpers/routes.ts";
import type { PracticeResult } from "../../../shared/api/practice.ts";
import { readDraft, writeDraft } from "../../progress/helpers/drafts.ts";
import { DRAFT_SAVE_DELAY_MS, EDITOR_LANG, FONT_NOTEBOOK, MODE_CHECK, MODE_FORMAT, MODE_RUN, MODE_VET, RUN_FAILS_BEFORE_HINT } from "../constants/editor.ts";
import { runPracticeAction } from "../helpers/actions.ts";
import { defineNotebookThemes, editorTheme, HOVER_DELAY_MS, registerGoCompletions } from "../helpers/editor.ts";

export function PracticePage() {
  const { lessonId = "", exerciseId = "" } = useParams();
  const lesson = lessonById(lessonId);
  const exercise = lesson?.exercises.find((item) => item.id === exerciseId);
  const { t } = usePreferences();

  if (!lesson || !exercise || exercise.kind === KIND_QUIZ) {
    return (
      <div className={CLASS_PAGE}>
        <Link to={ROUTE_HOME}>{t(I18N_BACK)}</Link>
        <p>{t(I18N_NOT_FOUND)}</p>
      </div>
    );
  }

  return <PracticeEditor key={`${lesson.id}/${exercise.id}`} lesson={lesson} exercise={exercise} />;
}

function PracticeEditor({ lesson, exercise }: { lesson: LessonSpec; exercise: ExerciseSpec }) {
  const { t, locale, theme } = usePreferences();
  const { markPassed, isPassed } = useProgress();
  const [source, setSource] = useState(() => readDraft(lesson.id, exercise.id)?.source ?? exercise.starter);
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [runFails, setRunFails] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const saveReady = useRef(false);
  const passed = isPassed(lesson.id, exercise.id);
  const showHint = runFails > RUN_FAILS_BEFORE_HINT && exercise.hint !== undefined;
  const previous = previousCoding(lesson, exercise.id);

  useEffect(() => {
    if (passed) {
      setOutput((current) => (current.length === 0 ? t(I18N_PASSED) : current));
    }
  }, [passed, t]);

  useEffect(() => {
    if (!saveReady.current) {
      saveReady.current = true;
      return;
    }
    const handle = window.setTimeout(() => {
      writeDraft(lesson.id, exercise.id, { source });
    }, DRAFT_SAVE_DELAY_MS);
    return () => {
      window.clearTimeout(handle);
      writeDraft(lesson.id, exercise.id, { source });
    };
  }, [source, lesson.id, exercise.id]);

  async function perform(mode: string) {
    setBusy(true);
    setOutput(t(I18N_WORKING));
    const result = await runPracticeAction(mode, source, lesson.id, exercise.id);
    setBusy(false);
    if (result.unavailable) {
      setOutput(t(I18N_UNAVAILABLE));
      return;
    }
    if (mode === MODE_RUN && !result.ok) {
      setRunFails((count) => count + 1);
    }
    if (mode === MODE_FORMAT && result.ok && result.formatted) {
      setSource(result.formatted);
    }
    if (mode === MODE_CHECK && result.ok) {
      writeDraft(lesson.id, exercise.id, { source });
      await markPassed(lesson.id, exercise.id);
      setOutput(t(I18N_PASSED));
      return;
    }
    setOutput(panelText(mode, result, t(I18N_NOT_PASSED)));
  }

  return (
    <div className={CLASS_PAGE}>
      <Link to={lessonPath(lesson.id)}>{t(I18N_BACK)}</Link>
      <div className="practice-grid">
        <section>
          <h1>
            {t(I18N_QUESTION)} {exercise.id}
          </h1>
          <p>{textOf(exercise.prompt, locale)}</p>
          <p>{textOf(exercise.rule, locale)}</p>
          {previous || passed ? (
            <div className="actions">
              {previous ? <Link to={exercisePath(lesson.id, previous.id)}>{t(I18N_PREV_EXERCISE)}</Link> : null}
              {passed ? (
                <NextLink
                  lesson={lesson}
                  exercise={exercise}
                  nextLabel={t(I18N_NEXT_EXERCISE)}
                  backLabel={t(I18N_BACK_TO_LESSON)}
                />
              ) : null}
            </div>
          ) : null}
        </section>
        <section>
          <div className="editor-pane">
            <Editor
              height="100%"
              language={EDITOR_LANG}
              theme={editorTheme(theme)}
              value={source}
              onChange={(value) => setSource(value ?? "")}
              beforeMount={defineNotebookThemes}
              onMount={(codeEditor, monaco) => registerGoCompletions(monaco, codeEditor)}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                fontFamily: FONT_NOTEBOOK,
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
                hover: { delay: HOVER_DELAY_MS },
                bracketPairColorization: { enabled: false },
              }}
            />
          </div>
          <div className="actions">
            <button type={BUTTON_TYPE} disabled={busy} onClick={() => void perform(MODE_FORMAT)}>
              {t(I18N_FORMAT)}
            </button>
            <button type={BUTTON_TYPE} disabled={busy} onClick={() => void perform(MODE_VET)}>
              {t(I18N_VET)}
            </button>
            <button type={BUTTON_TYPE} disabled={busy} onClick={() => void perform(MODE_RUN)}>
              {t(I18N_RUN)}
            </button>
            {showHint ? (
              <button type={BUTTON_TYPE} onClick={() => setHintOpen(true)}>
                {t(I18N_HINT)}
              </button>
            ) : null}
            <button type={BUTTON_TYPE} disabled={busy} onClick={() => void perform(MODE_CHECK)}>
              {t(I18N_CHECK)}
            </button>
          </div>
          {hintOpen && exercise.hint ? <p>{textOf(exercise.hint, locale)}</p> : null}
          <h2>{t(I18N_OUTPUT)}</h2>
          <pre className="output">{output}</pre>
        </section>
      </div>
    </div>
  );
}

function panelText(mode: string, result: PracticeResult, fallback: string): string {
  const text = `${result.stdout}\n${result.stderr}`.trim();
  if (text.length > 0) {
    return text;
  }
  if (mode === MODE_CHECK || !result.ok) {
    return fallback;
  }
  return "";
}

function previousCoding(lesson: LessonSpec, exerciseId: string): ExerciseSpec | undefined {
  const index = lesson.exercises.findIndex((item) => item.id === exerciseId);
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const item = lesson.exercises[cursor];
    if (item.kind !== KIND_QUIZ) {
      return item;
    }
  }
  return undefined;
}

function NextLink(props: { lesson: LessonSpec; exercise: ExerciseSpec; nextLabel: string; backLabel: string }) {
  const index = props.lesson.exercises.findIndex((item) => item.id === props.exercise.id);
  const next = props.lesson.exercises[index + 1];
  if (!next) {
    return <Link to={lessonPath(props.lesson.id)}>{props.backLabel}</Link>;
  }
  if (next.kind === KIND_QUIZ) {
    return <Link to={`${lessonPath(props.lesson.id)}#${next.id}`}>{props.nextLabel}</Link>;
  }
  return <Link to={exercisePath(props.lesson.id, next.id)}>{props.nextLabel}</Link>;
}
