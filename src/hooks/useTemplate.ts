import { useEffect, useReducer, useRef, useCallback } from "react";
import type { TemplateField } from "../types/template";
import { v4 as uuidv4 } from "../utils/uuid";

const SPEICHER_KEY = "dte:fields_v1";
const speicherAdapter = {
  load(): TemplateField[] | null {
    try {
      const raw = localStorage.getItem(SPEICHER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as TemplateField[];
    } catch {
      return null;
    }
  },
  save(fields: TemplateField[]) {
    try {
      localStorage.setItem(SPEICHER_KEY, JSON.stringify(fields));
    } catch (e) {
      console.warn("Speichern fehlgeschlagen", e);
    }
  },
  clear() {
    localStorage.removeItem(SPEICHER_KEY);
  },
};

type State = { fields: TemplateField[] };

type Action =
  | { type: "init"; payload: TemplateField[] }
  | { type: "updateValue"; id: string; value: string }
  | { type: "updateLabel"; id: string; label: string }
  | { type: "addField"; label?: string; fieldType?: TemplateField["type"] }
  | { type: "removeField"; id: string }
  | { type: "reorder"; fields: TemplateField[] }
  | { type: "reset" };

function defaultFields(): TemplateField[] {
  return [
    { id: "name", label: "Name", value: "", type: "text" },
    { id: "vorname", label: "Vorname", value: "", type: "text" },
    { id: "adresse", label: "Adresse", value: "", type: "textarea" },
  ];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return { fields: action.payload };
    case "updateValue":
      return {
        fields: state.fields.map((f) =>
          f.id === action.id ? { ...f, value: action.value } : f
        ),
      };
    case "updateLabel":
      return {
        fields: state.fields.map((f) =>
          f.id === action.id ? { ...f, label: action.label } : f
        ),
      };
    case "addField": {
      const newField: TemplateField = {
        id: uuidv4(),
        label: action.label ?? "Neues Eingabefeld",
        value: "",
        type: action.fieldType ?? "text",
      };
      return { fields: [...state.fields, newField] };
    }
    case "removeField":
      return { fields: state.fields.filter((f) => f.id !== action.id) };
    case "reorder":
      return { fields: action.fields };
    case "reset":
      return { fields: defaultFields() };
    default:
      return state;
  }
}

function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(fn);
  cb.current = fn;

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => cb.current(...args), delay);
    },
    [delay]
  );
}

export default function useTemplate() {
  const [state, dispatch] = useReducer(reducer, { fields: defaultFields() });

  useEffect(() => {
    const saved = speicherAdapter.load();
    if (saved) {
      dispatch({ type: "init", payload: saved });
    } else {
      dispatch({ type: "init", payload: defaultFields() });
    }
  }, []);

  const persist = useDebouncedCallback((fields: TemplateField[]) => {
    speicherAdapter.save(fields);
  }, 250);

  useEffect(() => {
    persist(state.fields);
  }, [state.fields, persist]);

  const updateField = (id: string, value: string) =>
    dispatch({ type: "updateValue", id, value });
  const updateLabel = (id: string, label: string) =>
    dispatch({ type: "updateLabel", id, label });
  const addField = (label?: string, fieldType?: TemplateField["type"]) =>
    dispatch({ type: "addField", label, fieldType });
  const removeField = (id: string) => dispatch({ type: "removeField", id });
  const reorderFields = (fields: TemplateField[]) =>
    dispatch({ type: "reorder", fields });
  const clearAll = () => {
    speicherAdapter.clear();
    dispatch({ type: "reset" });
  };

  return {
    fields: state.fields,
    updateField,
    updateLabel,
    addField,
    removeField,
    reorderFields,
    clearAll,
  };
}
