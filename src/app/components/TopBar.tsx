import { Link } from "react-router-dom";
import {
  I18N_APP_NAME,
  I18N_LANGUAGE_TOGGLE,
  I18N_LEVEL_ADVANCED,
  I18N_LEVEL_BEGINNER,
  I18N_LEVEL_CURRENT,
  I18N_LEVEL_EXPERT,
  I18N_LEVEL_PROFESSIONAL,
  I18N_LEVEL_UNRANKED,
  ROUTE_HOME,
} from "../../shared/constants/preference.ts";
import {
  BUTTON_TYPE,
  LEVEL_ADVANCED,
  LEVEL_BEGINNER,
  LEVEL_EXPERT,
  LEVEL_PROFESSIONAL,
} from "../../shared/constants/content.ts";
import { usePreferences } from "../../features/preferences/components/usePreferences.ts";
import { useProgress } from "../../features/progress/components/useProgress.ts";

const LEVEL_LABEL = {
  [LEVEL_BEGINNER]: I18N_LEVEL_BEGINNER,
  [LEVEL_ADVANCED]: I18N_LEVEL_ADVANCED,
  [LEVEL_PROFESSIONAL]: I18N_LEVEL_PROFESSIONAL,
  [LEVEL_EXPERT]: I18N_LEVEL_EXPERT,
};

export function TopBar() {
  const { t, themeLabel, toggleLocale, toggleTheme } = usePreferences();
  const { snapshot } = useProgress();
  const levelKey = snapshot.level === null ? I18N_LEVEL_UNRANKED : LEVEL_LABEL[snapshot.level];

  return (
    <header className="topbar">
      <Link className="topbar-title" to={ROUTE_HOME}>
        {t(I18N_APP_NAME)}
      </Link>
      <span className="topbar-spacer" />
      <span className="topbar-level">
        {t(I18N_LEVEL_CURRENT)}: {t(levelKey)}
      </span>
      <button type={BUTTON_TYPE} onClick={toggleLocale}>
        {t(I18N_LANGUAGE_TOGGLE)}
      </button>
      <button type={BUTTON_TYPE} onClick={toggleTheme}>
        {themeLabel}
      </button>
    </header>
  );
}
