import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => console.log("Browser error:", error.message));
  page.on("requestfailed", (request) =>
    console.log("Failed request:", request.url(), request.failure()?.errorText),
  );
  await page.goto("/");
  await expect(page.locator(".tox-hugerte")).toBeVisible({ timeout: 20000 });
  await expect(page.locator(".editor-loading")).toHaveCount(0);
});

test("edits rich text, resolves variables, persists independent drafts and exports HTML", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Project brief", exact: true })
    .click();
  await expect(page.locator(".editor-loading")).toHaveCount(0);
  const body = page
    .frameLocator('iframe[title="Rich Text Area"]')
    .locator("body");
  await body.click();
  await body.press("ControlOrMeta+End");
  await body.press("Enter");
  await body.pressSequentially("Built with care.");
  await page
    .getByLabel("Project name", { exact: true })
    .fill("My accessible project");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const preview = page.frameLocator('iframe[title="Live document preview"]');
  await expect(preview.locator("h1")).toHaveText("My accessible project");
  await expect(preview.locator("body")).toContainText("Built with care.");
  await expect(page.getByText("Saved locally", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue(
    "My accessible project",
  );
  await page
    .getByRole("button", { name: "Developer profile", exact: true })
    .click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Ignatius Seto",
  );
  await page
    .getByRole("button", { name: "Project brief", exact: true })
    .click();
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue(
    "My accessible project",
  );
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export HTML" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const html = Buffer.concat(chunks).toString();
  expect(html).toContain("My accessible project");
  expect(html).toContain("Built with care.");
  expect(html).not.toContain("{{project}}");
});

test("inserts a custom variable and a table, and respects reset cancellation", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add variable", exact: true }).click();
  await page.getByLabel("Variable name", { exact: true }).fill("company");
  await page.getByRole("button", { name: "Add variable", exact: true }).click();
  await page.getByLabel("company", { exact: true }).fill("My Company");
  await page
    .getByRole("button", { name: "Insert company variable", exact: true })
    .click();
  await page.getByRole("button", { name: "Try adding a table" }).click();
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const preview = page.frameLocator('iframe[title="Live document preview"]');
  await expect(preview.locator("body")).toContainText("My Company");
  await expect(preview.locator("table")).toHaveCount(2);
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Restore template" }).click();
  await expect(page.getByLabel("company", { exact: true })).toHaveValue(
    "My Company",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Restore template" }).click();
  await expect(page.getByLabel("company", { exact: true })).toHaveCount(0);
});

test("mobile navigation and preview fit a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Case study", exact: true }).click();
  await expect(page.getByLabel("Document title")).toHaveValue("Case study");
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await page
    .getByRole("button", { name: "Mobile preview", exact: true })
    .click();
  await expect(page.locator(".mobile-preview")).toBeVisible();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/studio-mobile.png",
    fullPage: true,
  });
});

test("workspace has no serious accessibility violations", async ({ page }) => {
  const result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
  await page.screenshot({
    path: "test-results/studio-desktop.png",
    fullPage: true,
  });
});

test("bundled assets load locally and editor failure leaves preview usable", async ({
  page,
}) => {
  const requested: string[] = [];
  const failedAssets: string[] = [];
  page.on("request", (request) => requested.push(request.url()));
  page.on("response", (response) => {
    if (response.status() >= 400) failedAssets.push(response.url());
  });
  await page.reload();
  await expect(page.locator(".editor-loading")).toHaveCount(0);
  expect(failedAssets).toEqual([]);
  expect(requested.some((url) => url.includes("/vendor/hugerte/"))).toBe(true);
  expect(
    requested.every(
      (url) => new URL(url).origin === new URL(page.url()).origin,
    ),
  ).toBe(true);
  const license = await page.request.get(
    "/vendor/licenses/THIRD-PARTY-NOTICES.txt",
  );
  expect(license.ok()).toBe(true);
  expect(await license.text()).toContain("MIT License");

  await page.route("**/vendor/hugerte/hugerte.min.js", (route) =>
    route.abort(),
  );
  await page.reload();
  await expect(page.getByText(/The editor could not load/)).toBeVisible();
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(
    page.frameLocator('iframe[title="Live document preview"]').locator("h1"),
  ).toHaveText("A better digital experience");
});

test("images survive preview and the about dialog restores keyboard focus", async ({
  page,
}) => {
  const image =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1xkAAAAASUVORK5CYII=";
  await page
    .getByRole("button", { name: "Insert/edit image", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Source", { exact: true }).fill(image);
  await dialog
    .getByLabel("Alternative description", { exact: true })
    .fill("A sample image");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const preview = page.frameLocator('iframe[title="Live document preview"]');
  await expect(preview.getByAltText("A sample image")).toHaveAttribute(
    "src",
    image,
  );
  await page
    .getByRole("button", { name: "About this build", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "About this build", exact: true }),
  ).toBeFocused();
});
