import { test, expect } from "@playwright/test";

test("Bearbeitbare Felder aktualisieren den Preview-Bereich", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  const nameInput = page.getByLabel("Name");
  await nameInput.fill("Iggy");

  const preview = page.getByRole("region", { name: "Live Preview" });
  await expect(preview).toHaveText(/Name: Iggy/);
});

test("Ein neues Inputfeld hinzufügen und den Preview-Bereich aktualisieren", async ({
  page,
}) => {
  await page.goto("http://localhost:5173");

  const newFieldInput = page.getByLabel("Neues Feld Name");
  await newFieldInput.fill("Unternehmen");

  await page.getByRole("button", { name: "Feld hinzufügen" }).click();

  const companyInput = page.getByLabel("Unternehmen");
  await companyInput.fill("Beispielfirma AG");

  const preview = page.getByRole("region", { name: "Live Preview" });
  await expect(preview).toHaveText(/Unternehmen: Beispielfirma AG/);
});
