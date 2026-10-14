import { useEffect, useState } from "react";
import { freshDraft, templates } from "../data/templates";
import type { Draft, StudioState } from "../types/template";

export const STORAGE_KEY = "template-studio:v1";
function initialState(): StudioState {
  const fallback = { selected: templates[0].id, drafts: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (
      !saved ||
      !templates.some((template) => template.id === saved.selected) ||
      !saved.drafts ||
      typeof saved.drafts !== "object"
    )
      return fallback;
    const drafts: Record<string, Draft> = {};
    for (const template of templates) {
      const draft = saved.drafts[template.id];
      if (
        draft &&
        typeof draft.title === "string" &&
        typeof draft.html === "string" &&
        Array.isArray(draft.variables) &&
        draft.variables.every(
          (v: Record<string, unknown>) =>
            v &&
            typeof v.key === "string" &&
            /^[a-zA-Z0-9_]+$/.test(v.key) &&
            typeof v.label === "string" &&
            typeof v.value === "string",
        )
      )
        drafts[template.id] = draft;
    }
    return { selected: saved.selected, drafts };
  } catch {
    return fallback;
  }
}

export default function useStudio() {
  const [state, setState] = useState<StudioState>(initialState);
  const [saveStatus, setSaveStatus] = useState("Saving…");
  const draft = state.drafts[state.selected] ?? freshDraft(state.selected);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setSaveStatus("Saved locally");
      } catch {
        setSaveStatus("Storage unavailable");
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [state]);
  // Also preserve the latest edit when leaving before the debounce completes.
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* UI reports storage errors. */
      }
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [state]);
  function updateDraft(update: Partial<Draft>) {
    setSaveStatus("Saving…");
    setState((current) => ({
      ...current,
      drafts: {
        ...current.drafts,
        [current.selected]: {
          ...(current.drafts[current.selected] ?? freshDraft(current.selected)),
          ...update,
        },
      },
    }));
  }
  return {
    selected: state.selected,
    draft,
    saveStatus,
    updateDraft,
    select: (id: string) => {
      setSaveStatus("Saving…");
      setState((current) => ({ ...current, selected: id }));
    },
    reset: () => updateDraft(freshDraft(state.selected)),
  };
}
