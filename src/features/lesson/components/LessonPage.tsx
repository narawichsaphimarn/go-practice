import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { lessonById, lessonMarkdown, textOf } from "../../../content/load.ts";
import { KIND_QUIZ, BUTTON_TYPE } from "../../../shared/constants/content.ts";

import {
  I18N_APPLY,
  I18N_BACK,
  I18N_EASY_CASE,
  I18N_EXPLAIN,
  I18N_GOAL,
  I18N_HARD_CASE,
  I18N_NOT_FOUND,
  I18N_NOT_READY,
  I18N_NO_RUN,
  I18N_QUIZ_WRONG,
  I18N_SUBMIT,
  I18N_TO_EXERCISE,
} from "../../../shared/constants/content.ts";
import { I18N_STATUS_IN_PROGRESS, LOCALE_TH, ROUTE_HOME } from "../../../shared/constants/preference.ts";
import { CLASS_PAGE } from "../../../shared/constants/content.ts";
import { exercisePath } from "../../../shared/helpers/routes.ts";
import { usePreferences } from "../../preferences/components/usePreferences.ts";
import { useProgress } from "../../progress/components/useProgress.ts";
import { parseLesson } from "../helpers/parse-markdown.ts";
import { AnimationPlayer } from "./AnimationPlayer.tsx";
import type { ExerciseSpec } from "../../../content/types.ts";

export function LessonPage() {
  const { lessonId = "" } = useParams();
  const lesson = lessonById(lessonId);
  const { t, locale } = usePreferences();
  const { rememberLesson, passedCount, isPassed, markPassed } = useProgress();

  useEffect(() => {
    if (lesson) {
      rememberLesson(lesson.id);
    }
  }, [lesson, rememberLesson]);

  if (!lesson) {
    return (
      <div className={CLASS_PAGE}>
        <Link to={ROUTE_HOME}>{t(I18N_BACK)}</Link>
        <p>{t(I18N_NOT_FOUND)}</p>
      </div>
    );
  }

  const markdown = lessonMarkdown(lesson.level, lesson.id, locale);
  const body = markdown ? parseLesson(markdown) : null;
  if (!body) {
    return (
      <div className={CLASS_PAGE}>
        <Link to={ROUTE_HOME}>{t(I18N_BACK)}</Link>
        <h1>{lesson.id}</h1>
        <p>{t(I18N_NOT_READY)}</p>
      </div>
    );
  }

  const done = passedCount(lesson.id);
  const next = lesson.exercises.find((exercise) => !isPassed(lesson.id, exercise.id)) ?? lesson.exercises[lesson.exercises.length - 1];

  return (
    <div className={CLASS_PAGE}>
      <div className="level-head">
        <Link to={ROUTE_HOME}>{t(I18N_BACK)}</Link>
        <span>
          {t(I18N_STATUS_IN_PROGRESS)} {done}/{lesson.exercises.length}
        </span>
      </div>
      <h1>
        {lesson.id} {textOf(lesson.title, locale)}
      </h1>
      <p>
        {t(I18N_GOAL)}: {textOf(lesson.goal, locale)}
      </p>
      <h2>{t(I18N_EXPLAIN)}</h2>
      <RichText text={body.explanation} />
      <h2>{t(I18N_APPLY)}</h2>
      <RichText text={body.apply} />
      <div className="cases">
        <section>
          <h2>{t(I18N_EASY_CASE)}</h2>
          <RichText text={body.easy} />
        </section>
        <section>
          <h2>{t(I18N_HARD_CASE)}</h2>
          <RichText text={body.hard} />
        </section>
      </div>
      {body.steps.length > 0 ? <AnimationPlayer steps={body.steps} /> : null}
      {next ? <NextExercise lessonId={lesson.id} exercise={next} label={t(I18N_TO_EXERCISE)} /> : null}
      <QuizList
        lessonId={lesson.id}
        exercises={lesson.exercises.filter((exercise) => exercise.kind === KIND_QUIZ)}
        locale={locale}
        wrongLabel={t(I18N_QUIZ_WRONG)}
        submitLabel={t(I18N_SUBMIT)}
        noRunLabel={t(I18N_NO_RUN)}
        isPassed={isPassed}
        markPassed={markPassed}
      />
    </div>
  );
}

function NextExercise({ lessonId, exercise, label }: { lessonId: string; exercise: ExerciseSpec; label: string }) {
  if (exercise.kind === KIND_QUIZ) {
    return <a href={`#${exercise.id}`}>{label}</a>;
  }
  return <Link to={exercisePath(lessonId, exercise.id)}>{label}</Link>;
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((block) =>
        block.startsWith("```") ? (
          <pre key={block}>{block.replaceAll("```", "").trim()}</pre>
        ) : (
          <p key={block}>{block}</p>
        ),
      )}
    </>
  );
}

function QuizList(props: {
  lessonId: string;
  exercises: ExerciseSpec[];
  locale: string;
  wrongLabel: string;
  submitLabel: string;
  noRunLabel: string;
  isPassed: (lessonId: string, exerciseId: string) => boolean;
  markPassed: (lessonId: string, exerciseId: string) => Promise<boolean>;
}) {
  if (props.exercises.length === 0) {
    return null;
  }
  return (
    <div>
      <p>{props.noRunLabel}</p>
      {props.exercises.map((exercise) => (
        <QuizCard
          key={exercise.id}
          lessonId={props.lessonId}
          exercise={exercise}
          locale={props.locale}
          wrongLabel={props.wrongLabel}
          submitLabel={props.submitLabel}
          passed={props.isPassed(props.lessonId, exercise.id)}
          markPassed={props.markPassed}
        />
      ))}
    </div>
  );
}

function QuizCard(props: {
  lessonId: string;
  exercise: ExerciseSpec;
  locale: string;
  wrongLabel: string;
  submitLabel: string;
  passed: boolean;
  markPassed: (lessonId: string, exerciseId: string) => Promise<boolean>;
}) {
  const [pick, setPick] = useState(-1);
  const [note, setNote] = useState("");
  const choices = props.locale === LOCALE_TH ? (props.exercise.choices?.th ?? []) : (props.exercise.choices?.en ?? []);

  function submit() {
    if (pick !== props.exercise.answer) {
      setNote(props.wrongLabel);
      return;
    }
    void props.markPassed(props.lessonId, props.exercise.id);
    setNote("");
  }

  return (
    <section id={props.exercise.id}>
      <h2>{textOf(props.exercise.prompt, props.locale)}</h2>
      {choices.map((choice, index) => (
        <button key={choice} type={BUTTON_TYPE} className={pick === index ? "is-current" : ""} onClick={() => setPick(index)}>
          {choice}
        </button>
      ))}
      <button type={BUTTON_TYPE} onClick={submit} disabled={props.passed}>
        {props.submitLabel}
      </button>
      {props.passed ? <p>{textOf(props.exercise.rule, props.locale)}</p> : null}
      {note ? <p>{note}</p> : null}
    </section>
  );
}
