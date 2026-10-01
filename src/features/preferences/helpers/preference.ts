import {
  DATA_THEME,
  LOCALE_EN,
  LOCALE_TH,
  STORAGE_KEY_LOCALE,
  STORAGE_KEY_THEME,
  THEME_DARK,
  THEME_LIGHT,
} from "../../../shared/constants/preference.ts";

export type Locale = typeof LOCALE_TH | typeof LOCALE_EN;
export type Theme = typeof THEME_LIGHT | typeof THEME_DARK;

const SCHEME_DARK = "(prefers-color-scheme: dark)";
const themeListeners = new Set<() => void>();

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function resolveLocale(language = navigator.language): Locale {
  const stored = readStorage(STORAGE_KEY_LOCALE);
  if (stored === LOCALE_TH || stored === LOCALE_EN) {
    return stored;
  }
  return language.toLowerCase().startsWith(LOCALE_TH) ? LOCALE_TH : LOCALE_EN;
}

export function resolveTheme(prefersDark = window.matchMedia(SCHEME_DARK).matches): Theme {
  const stored = readStorage(STORAGE_KEY_THEME);
  if (stored === THEME_LIGHT || stored === THEME_DARK) {
    return stored;
  }
  return prefersDark ? THEME_DARK : THEME_LIGHT;
}

export function applyStoredTheme(): void {
  const stored = readStorage(STORAGE_KEY_THEME);
  if (stored === THEME_LIGHT || stored === THEME_DARK) {
    document.documentElement.setAttribute(DATA_THEME, stored);
  }
}

export function subscribeTheme(listener: () => void): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(DATA_THEME, theme);
  for (const listener of themeListeners) {
    listener();
  }
}

export function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale;
}
