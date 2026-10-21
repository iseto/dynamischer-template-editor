"use client";
import { useState } from "react";
import { useAppearance } from "../utils/useAppearance";
import type { ThemePreference, ContrastPreference } from "../utils/appearance";
const labels = {
  en: {
    appearance: "Appearance",
    theme: "Color theme",
    contrast: "Contrast",
    system: "System",
    light: "Light",
    dark: "Dark",
    standard: "Standard",
    more: "More",
    unavailable:
      "Appearance changed for this visit. Your browser could not save the preference.",
  },
  de: {
    appearance: "Darstellung",
    theme: "Farbschema",
    contrast: "Kontrast",
    system: "System",
    light: "Hell",
    dark: "Dunkel",
    standard: "Standard",
    more: "Mehr",
    unavailable:
      "Darstellung für diesen Besuch geändert. Der Browser konnte die Einstellung nicht speichern.",
  },
  id: {
    appearance: "Tampilan",
    theme: "Tema warna",
    contrast: "Kontras",
    system: "Sistem",
    light: "Terang",
    dark: "Gelap",
    standard: "Standar",
    more: "Lebih tinggi",
    unavailable:
      "Tampilan diubah untuk kunjungan ini. Browser tidak dapat menyimpan preferensi.",
  },
};
export default function AppearanceControls({
  locale = "en",
}: {
  locale?: "en" | "de" | "id";
}) {
  const { theme, contrast, changeTheme, changeContrast } =
    useAppearance("studio");
  const [notice, setNotice] = useState("");
  const t = labels[locale];
  return (
    <div className="appearance-controls" role="group" aria-label={t.appearance}>
      <label>
        <span>{t.theme}</span>
        <select
          aria-label={t.theme}
          value={theme}
          onChange={(event) =>
            setNotice(
              changeTheme(event.target.value as ThemePreference)
                ? ""
                : t.unavailable,
            )
          }
        >
          <option value="system">{t.system}</option>
          <option value="light">{t.light}</option>
          <option value="dark">{t.dark}</option>
        </select>
      </label>
      <label>
        <span>{t.contrast}</span>
        <select
          aria-label={t.contrast}
          value={contrast}
          onChange={(event) =>
            setNotice(
              changeContrast(event.target.value as ContrastPreference)
                ? ""
                : t.unavailable,
            )
          }
        >
          <option value="system">{t.system}</option>
          <option value="standard">{t.standard}</option>
          <option value="more">{t.more}</option>
        </select>
      </label>
      <span className="appearance-notice" role="status">
        {notice}
      </span>
    </div>
  );
}
