import type { Monaco } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";
import { THEME_DARK } from "../../../shared/constants/preference.ts";
import { EDITOR_LANG, MONACO_DARK, MONACO_LIGHT } from "../constants/editor.ts";
import { GO_SYMBOLS } from "../constants/symbols.ts";

const WORD_PATTERN = /[A-Za-z_][\w.]*/g;
const PREFIX_PATTERN = /[A-Za-z0-9_.]*$/;
const PAPER_LIGHT = "#f4ecd8";
const INK_LIGHT = "#3a3832";
const INK_LIGHT_TOKEN = "3a3832";
const MARK_LIGHT = "#ffe56a99";
const GUTTER_LIGHT = "#8a8378";
const PAPER_DARK = "#2c2822";
const INK_DARK = "#e6dcc8";
const INK_DARK_TOKEN = "e6dcc8";
const MARK_DARK = "#c9a22799";
const GUTTER_DARK = "#8a8074";
const LINE_CLEAR = "#00000000";
const PENCIL_TOKENS = ["keyword", "string", "number", "comment", "type", "delimiter", "operator", "identifier"];

let registered = false;
let themesReady = false;

export function editorTheme(theme: string): string {
  return theme === THEME_DARK ? MONACO_DARK : MONACO_LIGHT;
}

export function defineNotebookThemes(monaco: Monaco): void {
  if (themesReady) {
    return;
  }
  themesReady = true;
  monaco.editor.defineTheme(MONACO_LIGHT, {
    base: "vs",
    inherit: true,
    rules: pencilRules(INK_LIGHT_TOKEN),
    colors: notebookColors(PAPER_LIGHT, INK_LIGHT, MARK_LIGHT, GUTTER_LIGHT),
  });
  monaco.editor.defineTheme(MONACO_DARK, {
    base: "vs-dark",
    inherit: true,
    rules: pencilRules(INK_DARK_TOKEN),
    colors: notebookColors(PAPER_DARK, INK_DARK, MARK_DARK, GUTTER_DARK),
  });
}

function pencilRules(ink: string): editor.ITokenThemeRule[] {
  return PENCIL_TOKENS.map((token) => ({ token, foreground: ink }));
}

function notebookColors(paper: string, ink: string, mark: string, gutter: string): editor.IColors {
  return {
    "editor.background": paper,
    "editor.foreground": ink,
    "editorCursor.foreground": ink,
    "editor.selectionBackground": mark,
    "editor.lineHighlightBackground": LINE_CLEAR,
    "editorLineNumber.foreground": gutter,
    "editorGutter.background": paper,
    "editorBracketHighlight.foreground1": ink,
    "editorBracketHighlight.foreground2": ink,
    "editorBracketHighlight.foreground3": ink,
  };
}

export function registerGoCompletions(monaco: Monaco): void {
  if (registered) {
    return;
  }
  registered = true;
  monaco.languages.setLanguageConfiguration(EDITOR_LANG, { wordPattern: WORD_PATTERN });
  monaco.languages.registerCompletionItemProvider(EDITOR_LANG, {
    triggerCharacters: ["."],
    provideCompletionItems(model: editor.ITextModel, position: Position) {
      const line = model.getLineContent(position.lineNumber);
      const prefix = PREFIX_PATTERN.exec(line.slice(0, position.column - 1))?.[0] ?? "";
      const start = position.column - prefix.length;
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: start,
        endColumn: position.column,
      };
      const suggestions = GO_SYMBOLS.filter((label) => label.startsWith(prefix)).map((label) => ({
        label,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: label,
        filterText: label,
        range,
      }));
      return { suggestions };
    },
  });
}
