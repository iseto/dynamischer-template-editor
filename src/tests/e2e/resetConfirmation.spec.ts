import { test, expect } from "@playwright/test";

test("shows confirmation dialog before reset", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.getByLabel("Eingabe für Name").fill("Max Mustermann");

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toMatch(/wirklich alle Felder/);
    await dialog.accept(); // .dismiss()
  });

  await page.getByRole("button", { name: "Alles zurücksetzen" }).click();

  await expect(page.getByLabel("Eingabe für Name")).toHaveValue("");
});
