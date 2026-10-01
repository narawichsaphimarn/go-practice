import type { Monaco } from "@monaco-editor/react";
import type { editor, Position } from "monaco-editor";
import { THEME_DARK } from "../../../shared/constants/preference.ts";
import { EDITOR_LANG, MONACO_DARK, MONACO_LIGHT } from "../constants/editor.ts";
import { GO_SYMBOLS } from "../constants/symbols.ts";

const WORD_PATTERN = /[A-Za-z_][\w.]*/g;
const PREFIX_PATTERN = /[A-Za-z0-9_.]*$/;

let registered = false;

export function editorTheme(theme: string): string {
  return theme === THEME_DARK ? MONACO_DARK : MONACO_LIGHT;
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
