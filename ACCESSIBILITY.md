# Accessibility

Template Studio includes semantic landmarks, labeled form fields and icon buttons, a skip link, visible focus outlines, and keyboard-accessible document tabs (Left/Right arrow keys). The About dialog uses native `showModal()` for focus containment, Escape dismissal, and return of focus to its opener. Export/validation feedback is announced through a polite status region.

The template navigation adapts to a mobile drawer. The editor, preview, and variable controls fit narrow screens without horizontal page scrolling. Inputs use a 16 px font on phones to avoid automatic zoom. Reduced-motion preferences disable interface transitions.

HugeRTE provides its own editing toolbar, dialogs, and keyboard interaction. The live document preview is a titled, sandboxed iframe; it does not automatically announce every keystroke. User-created document content can still have accessibility problems (for example, images without useful alternative text or irregular heading levels).

Automated verification uses ESLint's accessibility rules and an axe scan of the desktop workspace, plus browser tests for mobile overflow and interaction. These checks do not establish full WCAG compliance or replace testing with assistive technologies. A screen-reader audit has not been performed.
