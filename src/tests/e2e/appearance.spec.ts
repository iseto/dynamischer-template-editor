import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("appearance changes retain the live editor, document, undo history and exported content", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".editor-loading")).toHaveCount(0);
  const frame = page.locator('iframe[title="Rich Text Area"]');
  await expect(frame).toBeVisible();
  await frame.evaluate((el) => {
    el.setAttribute("data-editor-identity", "preserved");
  });
  const body = page
    .frameLocator('iframe[title="Rich Text Area"]')
    .locator("body");
  await body.click();
  await body.press("ControlOrMeta+End");
  await body.press("Enter");
  await body.pressSequentially("Keep this draft.");
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Appearance regression");
  await page.getByLabel("Color theme").selectOption("dark");
  await page.getByLabel("Contrast", { exact: true }).selectOption("more");
  await expect(frame).toHaveAttribute("data-editor-identity", "preserved");
  await expect(body).toContainText("Keep this draft.");
  await expect(body).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(body).not.toContainText("Keep this draft.");
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(body).toContainText("Keep this draft.");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(
    page.frameLocator('iframe[title="Live document preview"]').locator("body"),
  ).toHaveCSS("background-color", "rgb(19, 32, 25)");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export HTML" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const html = Buffer.concat(chunks).toString();
  expect(html).toContain("Keep this draft.");
  expect(html).toContain("Appearance regression");
  expect(html).not.toContain("#132019");
  await page.reload();
  await expect(page.getByLabel("Color theme")).toHaveValue("dark");
  await expect(page.getByLabel("Contrast", { exact: true })).toHaveValue(
    "more",
  );
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue(
    "Appearance regression",
  );
  expect(errors).toEqual([]);
});

for (const theme of ["light", "dark"])
  for (const contrast of ["standard", "more"]) {
    test(`${theme}/${contrast}: workspace, editor menus and mobile reflow`, async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page.locator(".editor-loading")).toHaveCount(0);
      await page.getByLabel("Color theme").selectOption(theme);
      await page.getByLabel("Contrast", { exact: true }).selectOption(contrast);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("html")).toHaveAttribute(
        "data-contrast",
        contrast,
      );
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations).toEqual([]);
      await page
        .getByRole("button", { name: "Insert/edit link", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      const dialogAudit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(dialogAudit.violations).toEqual([]);
      await page.keyboard.press("Escape");
      for (const width of [320, 390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    });
  }

test("system and forced colors keep editor and navigation usable", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", contrast: "more" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-contrast", "more");
  await page.emulateMedia({ forcedColors: "active" });
  await page.getByLabel("Color theme").selectOption("light");
  await page.getByRole("button", { name: "Case study", exact: true }).click();
  await expect(page.getByLabel("Document title")).toHaveValue("Case study");
  await expect(page.locator('iframe[title="Rich Text Area"]')).toBeVisible();
});
