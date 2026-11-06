import { expect, test } from "@playwright/test";

test("English reading, exports, saved language, and bilingual history", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("語言").selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Card library" }).click();
  await expect(page.locator(".library-card")).toHaveCount(78);
  const fool = page.locator(".library-card").first();
  await expect(fool.getByRole("heading")).toHaveText("The Fool");
  await expect(fool).toContainText("Take the first step with curiosity");
  await expect(fool).toContainText("Freedom still needs boundaries.");
  await page.getByLabel("Search card names or keywords").fill("recklessness");
  await expect(page.locator(".library-card").first()).toContainText("The Fool");

  await page.getByRole("button", { name: "Readings", exact: true }).click();
  await page.getByRole("button", { name: "Start a reading" }).click();
  await page.getByRole("button", { name: /One-card guidance/ }).click();
  await page.locator("#question").fill("What matters today?");
  await page.getByLabel("Language", { exact: true }).selectOption("zh-Hant");
  await expect(page.locator("#question")).toHaveValue("What matters today?");
  await page.getByLabel("語言").selectOption("en");
  await page.getByLabel("Reduce motion").check();
  await page.getByRole("button", { name: "Focus and shuffle" }).click();
  await page.getByRole("button", { name: "Skip the ritual" }).click();
  await page.evaluate(() => {
    const original = crypto.getRandomValues;
    crypto.getRandomValues = ((array: Uint32Array) => {
      crypto.getRandomValues = original;
      array[0] = 0;
      return array;
    }) as typeof crypto.getRandomValues;
  });
  await page.getByRole("button", { name: "Roll to draw card 1" }).click();
  await expect(
    page.getByRole("heading", { name: "Your reading" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show details" }).click();
  await expect(page.locator(".meaning-primary")).toContainText("This draw");
  await expect(page.locator(".detail")).toContainText("Drawn from position 1");
  await page.getByRole("button", { name: "Save reading" }).click();
  await expect(page.getByRole("button", { name: "Saved" })).toBeDisabled();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export PNG" }).click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
  await page.reload();
  await expect(page.getByLabel("Language", { exact: true })).toHaveValue("en");
  await page.getByRole("button", { name: "My history" }).click();
  await expect(page.locator(".history-item")).toContainText(
    "One-card guidance",
  );
  await page.getByLabel("Language", { exact: true }).selectOption("zh-Hant");
  await expect(page.locator(".history-item")).toContainText("單張指引");
  await expect(page.locator(".history-item")).toContainText(
    "What matters today?",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
