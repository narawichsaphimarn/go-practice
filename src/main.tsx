import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";
import { applyLocale, applyStoredTheme, resolveLocale } from "./features/preferences/helpers/preference.ts";
import "./shared/i18n/index.ts";
import "./app/theme.css";

applyLocale(resolveLocale());
applyStoredTheme();

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("missing root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
