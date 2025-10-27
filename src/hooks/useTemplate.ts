import { useEffect, useState } from "react";
import type { TemplateField } from "../types/template";
import { v4 as uuidv4 } from "../utils/uuid";

const SPEICHER_KEY = "dynamic-template-editor-fields";

export function defaultFields(): TemplateField[] {
  return [
    { id: "vorname", label: "Vorname", value: "", type: "text" },
    { id: "name", label: "Name", value: "", type: "text" },
    { id: "adresse", label: "Adresse", value: "", type: "textarea" },
  ];
}

function loadFromStorage(): TemplateField[] | null {
  try {
    const data = localStorage.getItem(SPEICHER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.warn("Es kann nicht von LocalStorage geladen werden", err);
    return null;
  }
}

function saveToStorage(fields: TemplateField[]) {
  try {
    localStorage.setItem(SPEICHER_KEY, JSON.stringify(fields));
  } catch (err) {
    console.warn("Es kann nicht in LocalStorage gespeichert werden", err);
  }
}

export default function useTemplate(initial = defaultFields()) {
  const [fields, setFields] = useState<TemplateField[]>(
    () => loadFromStorage() ?? initial
  );

  useEffect(() => {
    saveToStorage(fields);
  }, [fields]);

  function updateField(id: string, value: string) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  }

  function updateLabel(id: string, label: string) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, label } : f)));
  }

  function addField(label = "New Field", type: TemplateField["type"] = "text") {
    const newField: TemplateField = { id: uuidv4(), label, value: "", type };
    setFields((prev) => [...prev, newField]);
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }

  function reorderFields(newFields: TemplateField[]) {
    setFields(newFields);
  }

  function clearAll() {
    localStorage.removeItem(SPEICHER_KEY);
    setFields(defaultFields());
  }

  return {
    fields,
    updateField,
    updateLabel,
    addField,
    removeField,
    reorderFields,
    clearAll,
  };
}
