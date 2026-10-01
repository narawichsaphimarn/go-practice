import { useEffect, useState } from "react";
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
  I18N_CHECK,
  I18N_FORMAT,
  I18N_NEXT_EXERCISE,
  I18N_NOT_FOUND,
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
import { EDITOR_LANG, FONT_NOTEBOOK, MODE_CHECK, MODE_FORMAT, MODE_RUN, MODE_VET } from "../constants/editor.ts";
import { runPracticeAction } from "../helpers/actions.ts";
import { defineNotebookThemes, editorTheme, registerGoCompletions } from "../helpers/editor.ts";

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

  return <PracticeEditor lesson={lesson} exercise={exercise} />;
}

function PracticeEditor({ lesson, exercise }: { lesson: LessonSpec; exercise: ExerciseSpec }) {
  const { t, locale, theme } = usePreferences();
  const { markPassed, isPassed } = useProgress();
  const [source, setSource] = useState(exercise.starter);
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const passed = isPassed(lesson.id, exercise.id);

  useEffect(() => {
    setSource(exercise.starter);
    setOutput("");
  }, [exercise]);

  async function perform(mode: string) {
    setBusy(true);
    setOutput(t(I18N_WORKING));
    const result = await runPracticeAction(mode, source, lesson.id, exercise.id);
    setBusy(false);
    if (result.unavailable) {
      setOutput(t(I18N_UNAVAILABLE));
      return;
    }
    if (mode === MODE_FORMAT && result.ok && result.formatted) {
      setSource(result.formatted);
    }
    if (mode === MODE_CHECK && result.ok) {
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
          {passed ? <NextLink lesson={lesson} exercise={exercise} label={t(I18N_NEXT_EXERCISE)} /> : null}
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
              onMount={(_editor, monaco) => registerGoCompletions(monaco)}
              options={{
                minimap: { enabled: false },
                fontSize: 18,
                fontFamily: FONT_NOTEBOOK,
                scrollBeyondLastLine: false,
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
            <button type={BUTTON_TYPE} disabled={busy} onClick={() => void perform(MODE_CHECK)}>
              {t(I18N_CHECK)}
            </button>
          </div>
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

function NextLink(props: { lesson: LessonSpec; exercise: ExerciseSpec; label: string }) {
  const index = props.lesson.exercises.findIndex((item) => item.id === props.exercise.id);
  const next = props.lesson.exercises[index + 1];
  if (!next) {
    return null;
  }
  if (next.kind === KIND_QUIZ) {
    return <Link to={`${lessonPath(props.lesson.id)}#${next.id}`}>{props.label}</Link>;
  }
  return <Link to={exercisePath(props.lesson.id, next.id)}>{props.label}</Link>;
}
