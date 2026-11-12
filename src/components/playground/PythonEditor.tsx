"use client";

import React, { useEffect, useRef } from "react";
import { Compartment, EditorState } from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { tags } from "@lezer/highlight";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const pythonLightHighlight = HighlightStyle.define([
  { tag: tags.comment, color: "#94A3B8", fontStyle: "italic" },
  { tag: tags.keyword, color: "#3776AB", fontWeight: "600" },
  { tag: [tags.string, tags.special(tags.string)], color: "#15803D" },
  { tag: [tags.number, tags.integer, tags.float], color: "#B45309" },
  { tag: [tags.bool, tags.null], color: "#3776AB", fontWeight: "600" },
  {
    tag: [
      tags.function(tags.variableName),
      tags.definition(tags.function(tags.variableName)),
    ],
    color: "#1D4ED8",
  },
  {
    tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator],
    color: "#475569",
  },
  { tag: tags.variableName, color: "#243247" },
  { tag: tags.punctuation, color: "#64748B" },
]);

const pythonDarkHighlight = HighlightStyle.define([
  { tag: tags.comment, color: "#64748B", fontStyle: "italic" },
  { tag: tags.keyword, color: "#6EB2ED", fontWeight: "600" },
  { tag: [tags.string, tags.special(tags.string)], color: "#4ADE80" },
  { tag: [tags.number, tags.integer, tags.float], color: "#FBBF24" },
  { tag: [tags.bool, tags.null], color: "#6EB2ED", fontWeight: "600" },
  {
    tag: [
      tags.function(tags.variableName),
      tags.definition(tags.function(tags.variableName)),
    ],
    color: "#93C5FD",
  },
  {
    tag: [tags.operator, tags.compareOperator, tags.arithmeticOperator],
    color: "#94A3B8",
  },
  { tag: tags.variableName, color: "#E2E8F0" },
  { tag: tags.punctuation, color: "#94A3B8" },
]);

const pythonLightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#FFFFFF",
      color: "#243247",
      fontSize: "14px",
      fontFamily:
        "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    ".cm-scroller": {
      overflow: "auto",
      lineHeight: "1.6",
    },
    ".cm-content": {
      padding: "14px 12px",
      minHeight: "260px",
      caretColor: "#3776AB",
    },
    ".cm-gutters": {
      backgroundColor: "#F8FAFC",
      color: "#94A3B8",
      borderRight: "1px solid #E2E8F0",
      minWidth: "42px",
      userSelect: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 10px 0 8px",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "#F8FAFC",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#F1F5F9",
      color: "#243247",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "#DBEAFE !important",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#3776AB",
      borderLeftWidth: "2px",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-matchingBracket": {
      backgroundColor: "#EAF2F9",
      outline: "1px solid #C7DDF0",
    },
  },
  { dark: false }
);

const pythonDarkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#131D2E",
      color: "#E2E8F0",
      fontSize: "14px",
      fontFamily:
        "var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
    },
    ".cm-scroller": {
      overflow: "auto",
      lineHeight: "1.6",
    },
    ".cm-content": {
      padding: "14px 12px",
      minHeight: "260px",
      caretColor: "#6EB2ED",
    },
    ".cm-gutters": {
      backgroundColor: "#0F172A",
      color: "#64748B",
      borderRight: "1px solid #26354B",
      minWidth: "42px",
      userSelect: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 10px 0 8px",
      fontSize: "12px",
    },
    ".cm-activeLine": {
      backgroundColor: "#182438",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#1C293D",
      color: "#E2E8F0",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "#1E3A5F !important",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#6EB2ED",
      borderLeftWidth: "2px",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-matchingBracket": {
      backgroundColor: "#172B47",
      outline: "1px solid #2C5282",
    },
  },
  { dark: true }
);

function buildThemeExtension(isDark: boolean) {
  return isDark
    ? [syntaxHighlighting(pythonDarkHighlight), pythonDarkTheme]
    : [syntaxHighlighting(pythonLightHighlight), pythonLightTheme];
}

interface PythonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRunShortcut?: () => void;
  className?: string;
  minHeight?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}

export function PythonEditor({
  value,
  onChange,
  onRunShortcut,
  className,
  minHeight = "320px",
  readOnly = false,
  ariaLabel = "Python code editor",
}: PythonEditorProps) {
  const { isDark } = useTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartmentRef = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRunShortcut);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onRunRef.current = onRunShortcut;
  }, [onRunShortcut]);

  useEffect(() => {
    const parent = hostRef.current;
    if (!parent) return;

    const runShortcutKeymap = keymap.of([
      {
        key: "Mod-Enter",
        run: () => {
          onRunRef.current?.();
          return true;
        },
      },
      {
        key: "Escape",
        run: (view) => {
          view.contentDOM.blur();
          return true;
        },
      },
    ]);

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        indentUnit.of("    "),
        bracketMatching(),
        highlightActiveLine(),
        python(),
        themeCompartmentRef.current.of(buildThemeExtension(isDark)),
        EditorView.theme({
          ".cm-content": { minHeight },
        }),
        EditorView.contentAttributes.of({
          "aria-label": ariaLabel,
        }),
        EditorState.readOnly.of(readOnly),
        runShortcutKeymap,
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        updateListener,
      ],
    });

    const view = new EditorView({ state, parent });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Intentionally initialize CodeMirror once per mount; external value & theme updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamically switch CodeMirror Light / Dark theme without losing editor state
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: themeCompartmentRef.current.reconfigure(
        buildThemeExtension(isDark)
      ),
    });
  }, [isDark]);

  // Sync external updates (e.g., Reset or Load Example) without rebuilding editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      className={cn(
        "overflow-hidden bg-surface focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-inset",
        className
      )}
    />
  );
}
