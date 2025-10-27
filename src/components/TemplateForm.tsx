import React from "react";
import useTemplate from "../hooks/useTemplate";
import Preview from "./Preview";

export default function TemplateForm() {
  const { fields, updateField, addField, removeField, clearAll } =
    useTemplate();

  return (
    <div className="contents">
      <section className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-xl font-semibold">Eingabefelder</h2>
        <p className="text-sm text-muted mt-1 mb-4">
          Felder bearbeiten, um Änderungen im Live Preview-Bereich zu sehen.
        </p>

        {fields.map((field) => (
          <div className="flex flex-col mb-3" key={field.id}>
            <label htmlFor={field.id} className="text-sm text-muted mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="border border-slate-200 rounded-md p-2 text-base focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
              />
            ) : (
              <input
                id={field.id}
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="border border-slate-200 rounded-md p-2 text-base focus:ring-2 focus:ring-[var(--accent)] focus:outline-none"
              />
            )}
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={() => removeField(field.id)}
                aria-label={`Entferne ${field.id} Feld`}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
              >
                Feld entfernen
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => addField()}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Feld hinzufügen
          </button>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={clearAll}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
          >
            Alles zurücksetzen
          </button>
        </div>
      </section>

      <aside className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
        <Preview fields={fields} />
      </aside>
    </div>
  );
}
