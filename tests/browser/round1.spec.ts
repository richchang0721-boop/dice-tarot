import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("exact 19→82→32→62 audit, reroll presentation, snapshot reload and exports", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    const native = crypto.getRandomValues.bind(crypto);
    const sequence = [
      ...Array.from({ length: 78 }, (_, i) => i % 2),
      ...Array(77).fill(0),
      18,
      81,
      31,
      61,
    ];
    crypto.getRandomValues = ((array: any) => {
      if (
        array instanceof Uint32Array &&
        array.length === 1 &&
        sequence.length
      ) {
        array[0] = sequence.shift()!;
        return array;
      }
      return native(array);
    }) as typeof crypto.getRandomValues;
  });
  await page.goto("/");
  await page.getByRole("button", { name: "開啟你的占卜" }).click();
  await page.getByLabel("減少動態").check();
  await page.getByRole("button", { name: "專注問題，開始洗牌" }).click();
  await page.getByRole("button", { name: "跳過觸牌儀式" }).click();
  await page.getByRole("button", { name: /擲骰，抽取第/ }).click();
  await expect(page.locator(".result-card")).toHaveCount(1);
  await expect(page.locator(".deck-area")).toContainText("77 CARDS");
  await page.getByRole("button", { name: /擲骰，抽取第/ }).click();
  await expect(page.getByRole("status")).toHaveText(
    "82點，超出目前77張牌的範圍，請重新擲骰",
  );
  await expect(page.locator(".deck-strip .target")).toHaveCount(0);
  await expect(page.locator(".deck-area")).not.toContainText("定位：");
  await expect(page.locator(".deck-strip span")).toHaveCount(77);
  await expect(page.locator(".result-card")).toHaveCount(1);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: `docs/round1-reroll-${info.project.name}.png`,
    fullPage: true,
    animations: "disabled",
  });
  await expect(page.getByRole("status")).toHaveText("", { timeout: 8000 });
  await page.getByRole("button", { name: "重新擲骰" }).click();
  await expect(page.locator(".result-card")).toHaveCount(2);
  await page.getByRole("button", { name: /擲骰，抽取第/ }).click();
  await expect(page.locator(".result-card")).toHaveCount(3);
  await page.getByRole("button", { name: "查看詳細解讀" }).click();
  await expect(page.locator(".meaning-primary")).toHaveText([
    /逆位解讀/,
    /逆位解讀/,
    /正位解讀/,
  ]);
  await expect(page.locator(".meaning-secondary")).toHaveText([
    /正位參考/,
    /正位參考/,
    /逆位參考/,
  ]);
  await expect(page.locator(".detail")).toHaveText([
    /第 19 張抽出/,
    /第 32 張抽出/,
    /第 62 張抽出/,
  ]);
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "匯出 JSON" }).click();
  const file = await event;
  const result = JSON.parse(await readFile((await file.path())!, "utf8"));
  expect(
    result.rolls.map((r: any) => [
      r.value,
      r.remaining,
      r.accepted,
      r.position,
    ]),
  ).toEqual([
    [19, 78, true, 19],
    [82, 77, false, null],
    [32, 77, true, 32],
    [62, 76, true, 62],
  ]);
  expect(
    result.cards.map((r: any) => [r.card.id, r.drawPosition, r.reversed]),
  ).toEqual([
    [19, 19, true],
    [33, 32, true],
    [64, 62, false],
  ]);
  const imageEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "匯出 PNG" }).click();
  const png = await imageEvent;
  const bytes = await readFile((await png.path())!);
  expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  await png.saveAs(`docs/round1-export-${info.project.name}.png`);
  await page.getByRole("button", { name: "保存結果", exact: true }).click();
  await expect(page.getByRole("button", { name: "已保存" })).toBeVisible();
  await page.reload();
  await page.getByLabel("減少動態").check();
  await page.getByRole("button", { name: "我的紀錄" }).click();
  await page.getByRole("button", { name: "查看", exact: true }).click();
  await page.getByRole("button", { name: "查看詳細解讀" }).click();
  await expect(page.locator(".detail")).toHaveText([
    /第 19 張抽出/,
    /第 32 張抽出/,
    /第 62 張抽出/,
  ]);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: `docs/round1-result-${info.project.name}.png`,
    fullPage: true,
    animations: "disabled",
  });
  await page.getByRole("button", { name: "牌義圖書館" }).click();
  await expect(page.getByRole("status")).toHaveText("");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("78 artwork images load, IDs and visible numbers match data", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "牌義圖書館" }).click();
  const frames = page.locator(".library-card .card-art-frame");
  await expect(frames).toHaveCount(78);
  for (let id = 0; id < 78; id++) {
    const frame = frames.nth(id),
      img = frame.locator("img");
    await frame.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(await frame.getAttribute("data-card-id")).toBe(String(id));
    const number = await frame.getAttribute("data-card-number");
    await expect(img).toHaveAttribute("alt", new RegExp("（" + number + "）"));
  }
});
