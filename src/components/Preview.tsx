import React from "react";
import type { TemplateField } from "../types/template";

const Preview: React.FC<{ fields: TemplateField[] }> = React.memo(
  ({ fields }) => {
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
);

export default Preview;
