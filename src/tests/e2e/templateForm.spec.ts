import { test, expect } from "@playwright/test";

test("Bearbeitbare Felder aktualisieren den Preview-Bereich", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  await page.getByTestId("field-value-name").fill("Iggy");

  const preview = page.getByRole("region", { name: "Live Preview" });
  await expect(preview).toHaveText(/Name: Iggy/);
});

test("edit field updates preview and persists after reload", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  await page.getByTestId("field-value-name").fill("Testnutzer");

  const preview = page.getByRole("region", { name: "Live Preview" });
  await expect(preview).toHaveText(/Name: Testnutzer/);
  await page.waitForTimeout(300);
  await page.reload();
  await expect(page.getByRole("region", { name: "Live Preview" })).toHaveText(
    /Name: Testnutzer/
  );
});
