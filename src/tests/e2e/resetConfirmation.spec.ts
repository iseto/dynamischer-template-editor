import { test, expect } from "@playwright/test";

test("zeigt Bestätigungs-Dialogfenster vor Zurücksetzen des Formulars", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");
  await page.getByTestId("field-value-name").fill("Max Mustermann");
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toMatch(/wirklich alle Felder/);
    await dialog.accept();
  });
  await page.getByTestId("reset-all").click();
  await expect(page.getByTestId("field-value-name")).toHaveValue("");
});
