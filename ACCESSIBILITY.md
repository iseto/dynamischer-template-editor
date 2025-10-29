# Barrierefreiheit (Accessibility)

Dieses Projekt wurde unter Berücksichtigung der [WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/) Richtlinien entwickelt.

## 1. Semantische Struktur

- Verwendung semantischer HTML-Elemente (`<header>`, `<main>`, `<section>`, `<form>`, `<button>`).
- `<main>`-Bereich mit `role="main"` markiert.
- `<aside>` für die Vorschau mit `aria-labelledby="preview-title"`.

## 2. Tastaturbedienbarkeit

- Alle interaktiven Elemente sind mit der Tabulatortaste erreichbar.
- Schaltflächen und Eingabefelder besitzen sichtbare Fokuszustände (`focus-visible:ring` über Tailwind).
- Drag & Drop kann alternativ über Tastaturbefehle (↑ ↓) erfolgen.

## 3. Formulare und Labels

- Jedes Eingabefeld besitzt ein zugeordnetes `<label>` mit `htmlFor`.
- ARIA-Attribute (`aria-label`, `aria-describedby`) werden eingesetzt, wo kein sichtbares Label möglich ist.

## 4. Dynamische Inhalte

- Die Vorschau-Komponente nutzt `role="region"` und `aria-live="polite"`, sodass Screenreader Änderungen ankündigen.
- Statusmeldungen oder Warnungen (z. B. Bestätigungsdialog) sind mit `role="alertdialog"` bzw. nativen Browser-Dialogen implementiert.

## 5. Farbkontrast

- Text- und Hintergrundfarben erfüllen die Kontrastanforderungen (mind. 4.5:1).
- Tailwind-Farben wurden bewusst mit hohen Kontrasten gewählt (`text-slate-900`, `bg-white`, `focus:ring-accent`).

## 6. Fokus-Management

- Beim Öffnen des Bestätigungsdialogs wird der Fokus in das Dialogfenster gesetzt.
- Beim Schließen wird der Fokus auf die ursprüngliche Schaltfläche zurückgeführt (Focus Trap in künftiger Version geplant).

## 7. Teststrategie

- **Manuell:** Überprüfung mit Tastaturnavigation, Screenreader (VoiceOver / NVDA).
- **Automatisiert:** Nutzung von `eslint-plugin-jsx-a11y` und `axe DevTools` im Browser.
- **End-to-End:** Playwright Accessibility Snapshot (`page.accessibility.snapshot()`).

## 8. Bekannte Einschränkungen

- Fokusfalle im benutzerdefinierten Dialog noch nicht implementiert.

---

**Verantwortlicher Entwickler:** [iseto](https://github.com/iseto)  
**Letzte Aktualisierung:** Oktober 2025
