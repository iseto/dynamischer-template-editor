# Production readiness assessment

**Assessed: 14 October 2026. Verdict: ready for a static portfolio/demo release.**

No blocking defects were found within the browser-local demo scope. This is an assessment of the application and built assets; no live hosting environment has been deployed or assessed.

## Verification

- TypeScript checking and the Vite production build pass.
- ESLint and formatting checks pass.
- All **8 unit tests** pass, covering independent draft persistence, malformed storage, quota failure, immediate page-exit saving, template restoration, safe variable substitution, malicious HTML removal, and escaped document titles.
- All **6 browser workflows run against the built `dist/` application** pass: rich text editing/export, variables/tables/reset, mobile navigation and previews, accessibility, local asset loading/failure recovery, and images/dialog focus.
- Mobile overflow is checked at **320, 390, and 768 px**. Desktop and mobile screenshots are inspected.
- The axe scan finds **no serious or critical violations** in the default desktop workspace, including the editor iframe. This does not establish full WCAG compliance for arbitrary user-created documents.
- Full and production-only npm dependency audits report **0 known vulnerabilities** at assessment time.
- Runtime assets are served locally. Browser tests verify editor assets load without a CDN and a failed editor script still allows document preview.
- HugeRTE assets preserve their MIT license. Generated third-party notices include the editor integration, runtime dependencies, and locally bundled font licenses.

## Deployment

Run `npm ci`, then `npm run build`, and deploy the complete **`dist/`** directory to a static HTTPS host. Include `assets/` and `vendor/`; omitting editor plugins, skins, fonts, or license files breaks the release. Use the host's normal compression and caching facilities. Do not expose the Vite development server as the public application.

For a subdirectory deployment, build with the appropriate Vite `--base` value; the favicon and editor use Vite's base path. The browser release check targets deployment at the origin root.

Reproduce the release checks with `npx playwright install chromium` followed by `npm run test:e2e:production`. This command builds the application and serves the output through Vite preview solely for testing.

## Scope and remaining limits

- Drafts live in localStorage on one browser and origin. They are not shared across devices, and clearing browser data removes them. HTML export provides a portable copy.
- Embedded images are limited to 3 MB each. Multiple images or large documents may exceed localStorage capacity; the UI reports storage unavailability while retaining the current editable draft in memory.
- Preview/export sanitizes HTML and inserts variable values as text. The preview is sandboxed. These checks are not a penetration test.
- Automated browser verification covers Chromium. Safari, Firefox, and a manual screen-reader audit remain unverified.
- Host-specific HTTPS, security headers, caching, and deployment availability must be verified on the chosen host. Those settings are outside this repository assessment.

No account, cloud persistence, collaboration, or backend service is required for the portfolio/demo release described here.
