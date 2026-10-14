import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 60000,
  testDir: "./src/tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:5186",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: process.env.E2E_PRODUCTION
      ? "npm run preview -- --host 127.0.0.1 --port 5186 --strictPort"
      : "npm run dev -- --host 127.0.0.1 --port 5186",
    url: "http://127.0.0.1:5186",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
