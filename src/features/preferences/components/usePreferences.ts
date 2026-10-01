import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import "../../../shared/i18n/index.ts";
import {
  I18N_THEME_DARK,
  I18N_THEME_LIGHT,
  LOCALE_EN,
  LOCALE_TH,
  STORAGE_KEY_LOCALE,
  STORAGE_KEY_THEME,
  THEME_DARK,
  THEME_LIGHT,
} from "../../../shared/constants/preference.ts";
import {
  applyLocale,
  applyTheme,
  resolveTheme,
  subscribeTheme,
  writeStorage,
  type Locale,
  type Theme,
} from "../helpers/preference.ts";

export function usePreferences() {
  const { t, i18n } = useTranslation();
  const theme = useSyncExternalStore(subscribeTheme, resolveTheme, resolveTheme);

  function toggleLocale() {
    const next: Locale = i18n.language === LOCALE_TH ? LOCALE_EN : LOCALE_TH;
    writeStorage(STORAGE_KEY_LOCALE, next);
    applyLocale(next);
    void i18n.changeLanguage(next);
  }

  function toggleTheme() {
    const next: Theme = theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    writeStorage(STORAGE_KEY_THEME, next);
    applyTheme(next);
  }

  const themeLabel = theme === THEME_DARK ? t(I18N_THEME_DARK) : t(I18N_THEME_LIGHT);

  return { t, locale: i18n.language, theme, themeLabel, toggleLocale, toggleTheme };
}
