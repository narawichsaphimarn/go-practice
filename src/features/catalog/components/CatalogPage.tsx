import { Link } from "react-router-dom";
import { LEVEL_ORDER } from "../../../content/types.ts";
import { lessons, textOf } from "../../../content/load.ts";
import { useProgress } from "../../progress/components/useProgress.ts";
import { lessonPath } from "../../../shared/helpers/routes.ts";
import {
  I18N_LEVEL_ADVANCED,
  I18N_LEVEL_BEGINNER,
  I18N_LEVEL_EXPERT,
  I18N_LEVEL_PROFESSIONAL,
  I18N_STATUS_DONE,
  I18N_STATUS_IN_PROGRESS,
  I18N_STATUS_NOT_STARTED,
} from "../../../shared/constants/preference.ts";
import {
  CLASS_PAGE,
  I18N_POINTS,
  LEVEL_ADVANCED,
  LEVEL_BEGINNER,
  LEVEL_EXPERT,
  LEVEL_PROFESSIONAL,
} from "../../../shared/constants/content.ts";
import { usePreferences } from "../../preferences/components/usePreferences.ts";

const LEVEL_KEY = {
  [LEVEL_BEGINNER]: I18N_LEVEL_BEGINNER,
  [LEVEL_ADVANCED]: I18N_LEVEL_ADVANCED,
  [LEVEL_PROFESSIONAL]: I18N_LEVEL_PROFESSIONAL,
  [LEVEL_EXPERT]: I18N_LEVEL_EXPERT,
};

export function CatalogPage() {
  const { t, locale } = usePreferences();
  const { snapshot, passedCount } = useProgress();
  const all = lessons();

  return (
    <div className={CLASS_PAGE}>
      {LEVEL_ORDER.map((level) => {
        const rows = all.filter((lesson) => lesson.level === level);
        const earned = snapshot.earned[level];
        const full = snapshot.full[level];
        return (
          <section key={level} className="level">
            <div className="level-head">
              <h2>{t(LEVEL_KEY[level])}</h2>
              <span>
                {earned} / {full} {t(I18N_POINTS)}
              </span>
            </div>
            <div className="bar">
              <div className="bar-fill" style={{ width: full === 0 ? "0%" : `${Math.min(100, Math.round((earned / full) * 100))}%` }} />
            </div>
            {rows.map((lesson) => {
              const done = passedCount(lesson.id);
              const total = lesson.exercises.length;
              const status =
                done === 0 ? t(I18N_STATUS_NOT_STARTED) : done === total ? t(I18N_STATUS_DONE) : `${t(I18N_STATUS_IN_PROGRESS)} ${done}/${total}`;
              const last = snapshot.lastLessonId === lesson.id ? " is-last" : "";
              return (
                <Link key={lesson.id} className={`row${last}`} to={lessonPath(lesson.id)}>
                  <span>
                    {lesson.id} {textOf(lesson.title, locale)}
                  </span>
                  <span>{status}</span>
                </Link>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
