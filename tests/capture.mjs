import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const response = await page.goto("http://127.0.0.1:4173/");
if (response.status() !== 200) throw Error("Production HTTP failed");
await page.getByRole("button", { name: "開啟你的占卜" }).click();
await page.screenshot({ path: "docs/setup-desktop.png", fullPage: true });
await page.getByLabel("減少動態").check();
await page.getByRole("button", { name: "專注問題，開始洗牌" }).click();
await page.getByRole("button", { name: "跳過觸牌儀式" }).click();
await page.screenshot({ path: "docs/draw-desktop.png", fullPage: true });
if (errors.length) throw Error(errors.join("\n"));
await browser.close();
console.log(
  "Production HTTP 200; setup and draw screens rendered without errors.",
);
