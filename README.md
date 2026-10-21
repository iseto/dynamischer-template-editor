# Template Studio

A minimalist, responsive document workspace by **Ignatius Seto**, built with React, TypeScript, Vite, and the MIT-licensed [HugeRTE](https://hugerte.org) editor.

## Run locally

Use Node.js 22.12+ (or 24 LTS) and npm:

```sh
npm ci
npm run dev
```

The `predev` and `prebuild` scripts copy HugeRTE from the installed package into ignored `public/vendor/hugerte/`. Editor scripts, plugins, skins, fonts, and the editor's license ship locally with the app. No CDN or API key is required.

```sh
npm run build       # Type-check and create dist/
npm run preview     # Preview the production build
npm run test        # Unit tests and coverage
npm run test:e2e    # Browser workflows; run npx playwright install chromium once
npm run test:e2e:production # Build and test the production output
npm run lint
npm run format:check
```

## Try it

- Choose a project brief, case study, developer profile, or blank canvas.
- Format text and insert links, lists, tables, images, and code samples using HugeRTE.
- Change variable values; click a `{{token}}` to insert it at the cursor.
- Add custom variables or remove ones you don't need. Unknown tokens remain visible.
- Switch between editing, a desktop/mobile preview, and resolved HTML.
- Export a standalone HTML document with responsive styling and variable values.
- Rename documents. Each template retains its own browser-local draft across reloads.
- Restore the selected template after confirming; other drafts are preserved.

Local images are embedded as data URLs, with a 3 MB per-image limit. Large drafts can exceed browser storage quotas; the workspace then shows **Storage unavailable**. Export the document to retain it outside the browser. Clearing browser data removes saved drafts. Drafts are not synced across devices.

Example client/project names are editable sample content. The developer profile focuses on the React, TypeScript, responsive UI, and testing techniques demonstrated by this repository, without invented work history or results.

## Structure

- `src/App.tsx`: workspace, templates, variables, view controls, and exports
- `src/components/RichEditor.tsx`: self-hosted HugeRTE integration
- `src/hooks/useStudio.ts`: validated, versioned local persistence
- `src/data/templates.ts`: editable portfolio-oriented starter documents
- `src/utils/document.ts`: sanitized HTML generation and safe variable substitution
- `src/tests`: persistence/security unit tests and real-browser workflows

HTML is sanitized before preview/export, and variables are inserted as text. The live preview uses a sandboxed iframe. Browser storage is still local data, not encrypted storage; only use this demo for content you intend to keep in this browser.

## Cleanup

npm is the single package manager. Replaced the old plain-field form and preview, removed unused Tailwind/PostCSS configuration and dependencies, consolidated lockfiles, updated Vite and dependencies, replaced duplicate favicons, and rewrote stale test and accessibility documentation. Generated build/cache/test output remains ignored.

## Licensing

HugeRTE and its React integration are MIT-licensed dependencies. The copied HugeRTE assets retain their package license. Generated `vendor/licenses/THIRD-PARTY-NOTICES.txt` retains notices for the editor integration, bundled runtime dependencies, and fonts. Other bundled dependencies retain their own licenses. This repository does not assign a new license to Ignatius Seto's application code.

## Release assessment

See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) for the release verdict, production verification, deployment requirements, and known limits.

## Automated dependency maintenance

Weekly Dependabot updates and daily full dependency audits are configured.
See [automation schedules and notification behavior](docs/AUTOMATIONS.md).

## Portfolio listing

`portfolio.json` supplies the title, technology tags, and English/German/Indonesian descriptions for [the portfolio landing page](https://github.com/iseto/portfolio-landing). Update it when shipping user-facing features. The landing page checks this file and the repository homepage hourly, validates all three translations and live links, and publishes verified changes automatically. Set the GitHub repository website to the canonical deployed demo URL. Screenshots and case-study evidence are maintained separately.
