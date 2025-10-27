import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: { baseURL: "http://127.0.0.1:5173" },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5173",
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    testIgnore: ["src/tests/**/*.test.tsx"],
  },
  projects: [
    {
      name: "chromium",
      use: { channel: "chrome" },
      testDir: "src/tests",
      testMatch: "**/*.spec.ts",
    },
  ],
});
