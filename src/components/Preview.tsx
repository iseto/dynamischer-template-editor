import type { TemplateField } from "../types/template";

export default function Preview({ fields }: { fields: TemplateField[] }) {
  const lines = fields.map((f) => `${f.label}: ${f.value || "<leer>"}`);
  return (
    <div>
      <div className="preview" role="region" aria-label="preview">
        {lines.join("\n")}
      </div>
      <p className="small" style={{ marginTop: 8 }}>
        Live-Vorschau des generierten Dokumentinhalts.
      </p>
    </div>
  );
}
