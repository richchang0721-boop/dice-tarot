import { test, expect } from "@playwright/test";
test("three-card ritual, durable history, downloads, library and responsive layout", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /把未知交給骰子/ }),
  ).toBeVisible();
  await page.screenshot({
    path: `docs/home-${info.project.name}.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "開啟你的占卜" }).click();
  await page.getByLabel("減少動態").check();
  await page.getByLabel("也可以寫下來").fill("我應該如何面對新的挑戰？");
  await page.getByRole("button", { name: "專注問題，開始洗牌" }).click();
  await page.getByRole("button", { name: "跳過觸牌儀式" }).click();
  let attempts = 0;
  while (
    await page.getByRole("button", { name: /擲骰，抽取第|重新擲骰/ }).count()
  ) {
    await page.getByRole("button", { name: /擲骰，抽取第|重新擲骰/ }).click();
    await page.waitForTimeout(25);
    if (++attempts > 60) throw Error("too many rolls");
  }
  await expect(
    page.getByRole("heading", { name: "屬於此刻的牌語" }),
  ).toBeVisible();
  await expect(page.locator(".result-card")).toHaveCount(3);
  await expect(page.locator(".result-card .position")).toHaveText([
    "01 — 過去",
    "02 — 現在",
    "03 — 未來",
  ]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "查看詳細解讀" }).click();
  await expect(page.locator(".detail")).toHaveCount(3);
  await page.screenshot({
    path: `docs/result-${info.project.name}.png`,
    fullPage: true,
  });
  const jsonDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "匯出 JSON" }).click();
  const json = await jsonDownload;
  expect(json.suggestedFilename()).toMatch(/\.json$/);
  await json.saveAs(`test-results/reading-${info.project.name}.json`);
  const pngDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "匯出 PNG" }).click();
  const png = await pngDownload;
  expect(png.suggestedFilename()).toMatch(/\.png$/);
  await png.saveAs(`docs/export-${info.project.name}.png`);
  await page.getByRole("button", { name: "保存結果", exact: true }).click();
  await expect(page.getByRole("button", { name: "已保存" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "我的紀錄" }).click();
  await expect(page.locator(".history-item")).toHaveCount(1);
  await page.getByRole("button", { name: "查看", exact: true }).click();
  await expect(page.locator(".result-card")).toHaveCount(3);
  await page.getByRole("button", { name: "過去", exact: true }).click();
  await expect(page.locator(".result-card")).toHaveCount(1);
  await page.getByRole("button", { name: "牌陣總覽" }).click();
  await expect(page.locator(".result-card")).toHaveCount(3);
  await page.getByRole("button", { name: "牌義圖書館" }).click();
  await expect(page.locator(".library-card")).toHaveCount(78);
  await page.getByLabel("搜尋牌名或關鍵詞").fill("The Fool");
  await expect(page.locator(".library-card")).toHaveCount(1);
  await page.getByLabel("搜尋牌名或關鍵詞").fill("");
  await page.getByLabel("篩選牌組").selectOption("聖杯");
  await expect(page.locator(".library-card")).toHaveCount(14);
  await page.getByRole("button", { name: "我的紀錄" }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "刪除", exact: true }).click();
  await expect(page.locator(".history-item")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
test("single card, keyboard touch ritual and animation skipping", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "開啟你的占卜" }).click();
  await page.getByRole("button", { name: /單張指引/ }).click();
  await page.getByRole("button", { name: "專注問題，開始洗牌" }).click();
  await page.getByRole("button", { name: "跳過洗牌動畫" }).click();
  const deck = page.getByRole("button", { name: "長按牌堆" });
  await deck.focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(1400);
  await page.keyboard.up("Space");
  let n = 0;
  while (
    await page.getByRole("button", { name: /擲骰，抽取第|重新擲骰/ }).count()
  ) {
    await page.getByRole("button", { name: /擲骰，抽取第|重新擲骰/ }).click();
    await page.getByRole("button", { name: "跳過動畫，顯示結果" }).click();
    if (await page.getByRole("button", { name: "跳過動畫，顯示結果" }).count())
      await page.getByRole("button", { name: "跳過動畫，顯示結果" }).click();
    if (++n > 50) throw Error("too many attempts");
  }
  await expect(page.locator(".result-card")).toHaveCount(1);
});
