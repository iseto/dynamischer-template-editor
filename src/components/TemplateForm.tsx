import { useEffect, useRef } from "react";
import useTemplate from "../hooks/useTemplate";
import Preview from "./Preview";

export default function TemplateForm() {
  const { fields, updateField, updateLabel, addField, removeField, clearAll } =
    useTemplate();

  const neuesLabelRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (neuesLabelRef.current) {
      neuesLabelRef.current.focus();
    }
  }, [fields.length]);

  return (
    <div className="contents">
      <section
        aria-labelledby="form-heading"
        role="form"
        className="bg-white rounded-xl shadow-sm p-5"
      >
        <h2 id="form-heading" className="text-xl font-semibold">
          Eingabefelder
        </h2>
        <p className="text-sm text-muted mt-1 mb-4">
          Felder bearbeiten, um Änderungen im Live Preview-Bereich zu sehen.
        </p>

        {fields.map((field, index) => (
          <div className="flex flex-col mb-3" key={field.id}>
            {/* <label htmlFor={field.id} className="text-sm text-muted mb-1">
              {field.label}
            </label> */}
            <input
              ref={index === fields.length - 1 ? neuesLabelRef : null}
              type="text"
              value={field.label}
              onChange={(e) => updateLabel(field.id, e.target.value)}
              placeholder="Feldbezeichnung eingeben"
              aria-label={`Label für Feld ${index + 1}`}
              className="border border-slate-300 rounded-md p-2 mb-1 text-sm focus:ring-2 focus:ring-accent"
            />
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
                aria-label={`Entferne Feld ${field.label || field.id}`}
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
            className="bg-accent text-white px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
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

      <aside
        role="region"
        aria-labelledby="preview-heading"
        aria-live="polite"
        className="bg-white rounded-xl shadow-sm p-5"
      >
        <h2 id="preview-heading" className="text-xl font-semibold mb-2">
          Live Preview
        </h2>
        <Preview fields={fields} />
      </aside>
    </div>
  );
}
