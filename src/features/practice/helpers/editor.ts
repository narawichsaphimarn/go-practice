import type { Monaco } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";
import { LOCALE_TH, THEME_DARK } from "../../../shared/constants/preference.ts";
import { resolveLocale } from "../../preferences/helpers/preference.ts";
import { EDITOR_LANG, MONACO_DARK, MONACO_LIGHT } from "../constants/editor.ts";
import { GO_SYMBOLS, KIND_CONSTANT, KIND_TYPE, type GoSymbol, type SymbolKind } from "../constants/symbols.ts";

const DOC_FENCE = "```go\n";
const DOC_FENCE_END = "\n```";
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

const SUGGEST_DETAILS = "shows-details";
const SUGGEST_VISIBLE = "visible";
const SUGGEST_WIDGET = ".suggest-widget";
const SUGGEST_CONTROLLER = "editor.contrib.suggestController";
const SUGGEST_BROAD_LIMIT = 50;
const DOC_RETRY_LIMIT = 20;
const DOC_RETRY_MS = 50;
export const HOVER_DELAY_MS = 1000;

let registered = false;
let themesReady = false;
let completionEditor: editor.IStandaloneCodeEditor | undefined;

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

function suggestSymbols(prefix: string): GoSymbol[] {
  if (prefix.length === 0) {
    return [];
  }
  const matched = GO_SYMBOLS.filter((item) => item.name.startsWith(prefix));
  if (prefix.includes(".")) {
    return matched;
  }
  return matched.slice(0, SUGGEST_BROAD_LIMIT);
}

function symbolKind(monaco: Monaco, kind: SymbolKind): number {
  if (kind === KIND_CONSTANT) {
    return monaco.languages.CompletionItemKind.Constant;
  }
  if (kind === KIND_TYPE) {
    return monaco.languages.CompletionItemKind.Struct;
  }
  return monaco.languages.CompletionItemKind.Function;
}

function symbolSummary(item: GoSymbol): string {
  return resolveLocale() === LOCALE_TH ? item.summary.th : item.summary.en;
}

function symbolDoc(item: GoSymbol): string {
  const heading = resolveLocale() === LOCALE_TH ? "ตัวอย่าง" : "Example";
  return `${symbolSummary(item)}\n\n${heading}\n\n${DOC_FENCE}${item.example}${DOC_FENCE_END}`;
}

const symbolsByName = new Map<string, GoSymbol[]>();
for (const item of GO_SYMBOLS) {
  const found = symbolsByName.get(item.name);
  if (found) {
    found.push(item);
  } else {
    symbolsByName.set(item.name, [item]);
  }
}

function hoverFor(word: string): GoSymbol[] {
  return symbolsByName.get(word) ?? [];
}

type SuggestSurface = {
  _isDetailsVisible?: () => boolean;
  toggleDetails?: (focused?: boolean) => void;
  _list?: { getFocusedElements?: () => unknown[] };
  _details?: {
    show?: () => void;
    widget?: { renderItem?: (item: unknown, explainMode: boolean) => void };
  };
};

function openSymbolDocs(): void {
  const box = document.querySelector(SUGGEST_WIDGET);
  if (box === null || !box.classList.contains(SUGGEST_VISIBLE) || box.classList.contains(SUGGEST_DETAILS)) {
    return;
  }
  const suggest = (completionEditor?.getContribution(SUGGEST_CONTROLLER) as {
    widget?: { value?: SuggestSurface };
  } | null)?.widget?.value;
  const item = suggest?._list?.getFocusedElements?.()[0];
  if (!suggest || item === undefined) {
    return;
  }
  if (!suggest._isDetailsVisible?.()) {
    suggest.toggleDetails?.(false);
  }
  suggest._details?.widget?.renderItem?.(item, false);
  suggest._details?.show?.();
  box.classList.add(SUGGEST_DETAILS);
}

function showSymbolDocs(attempt = 0): void {
  if (!completionEditor || attempt >= DOC_RETRY_LIMIT) {
    return;
  }
  const widget = document.querySelector(SUGGEST_WIDGET);
  const open = widget !== null && widget.classList.contains(SUGGEST_VISIBLE);
  if (!open) {
    window.setTimeout(() => showSymbolDocs(attempt + 1), DOC_RETRY_MS);
    return;
  }
  openSymbolDocs();
  window.setTimeout(openSymbolDocs, DOC_RETRY_MS * 4);
}

export function registerGoCompletions(monaco: Monaco, codeEditor: editor.IStandaloneCodeEditor): void {
  completionEditor = codeEditor;
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
      const suggestions = suggestSymbols(prefix).map((item) => {
        const summary = symbolSummary(item);
        return {
          label: {
            label: item.name,
            detail: ` ${item.signature}`,
            description: summary,
          },
          kind: symbolKind(monaco, item.kind),
          insertText: item.name,
          filterText: item.name,
          detail: item.signature,
          documentation: { value: symbolDoc(item) },
        range,
      };
      });
      window.setTimeout(showSymbolDocs, 0);
      return { suggestions };
    },
  });
  monaco.languages.registerHoverProvider(EDITOR_LANG, {
    provideHover(model: editor.ITextModel, position: Position) {
      const word = model.getWordAtPosition(position);
      const items = word === null ? [] : hoverFor(word.word);
      if (word === null || items.length === 0) {
        return null;
      }
      return {
        range: {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        },
        contents: items.flatMap((item) => [
          { value: `${DOC_FENCE}${item.signature}${DOC_FENCE_END}` },
          { value: symbolDoc(item) },
        ]),
      };
    },
  });
}
