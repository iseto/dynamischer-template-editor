import React from "react";
import useTemplate from "../hooks/useTemplate";
import Preview from "./Preview";

export default function TemplateForm() {
  const { fields, updateField, addField, removeField } = useTemplate();

  return (
    <div style={{ display: "contents" }}>
      <section className="card">
        <h2>Eingabefelder</h2>
        <p className="small">
          Felder bearbeiten, um Änderungen im Live Preview-Bereich zu sehen.
        </p>

        {fields.map((field) => (
          <div className="field" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
              />
            ) : (
              <input
                id={field.id}
                value={field.value}
                onChange={(e) => updateField(field.id, e.target.value)}
              />
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                onClick={() => removeField(field.id)}
                aria-label={`Entferne ${field.id} Feld`}
              >
                Feld entfernen
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => addField()}>Feld hinzufügen</button>
        </div>
      </section>

      <aside className="card">
        <h2>Live Preview</h2>
        <Preview fields={fields} />
      </aside>
    </div>
  );
}
