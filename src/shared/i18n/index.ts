import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LOCALE_EN, LOCALE_TH } from "../constants/preference.ts";
import { resolveLocale } from "../../features/preferences/helpers/preference.ts";
import { messagesEn } from "./messages-en.ts";
import { messagesTh } from "./messages-th.ts";

void i18n.use(initReactI18next).init({
  resources: {
    [LOCALE_TH]: { translation: messagesTh },
    [LOCALE_EN]: { translation: messagesEn },
  },
  lng: resolveLocale(),
  fallbackLng: LOCALE_EN,
  interpolation: { escapeValue: false },
});

export { i18n };
