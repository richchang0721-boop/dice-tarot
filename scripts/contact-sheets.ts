import { chromium } from "@playwright/test";
import fs from "node:fs";
import { cards } from "../src/cards";
import { deckAssets } from "../src/deck";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1260, height: 900 } });
for (const [group, suit] of [
  "大阿爾克那",
  "權杖",
  "聖杯",
  "寶劍",
  "錢幣",
].entries()) {
  const subset = cards.filter((c) => c.suit === suit);
  await page.setContent(
    `<html lang="zh-Hant"><style>body{margin:0;background:#101b25;color:#eee0ba;font-family:serif;padding:20px}h1{font-size:23px}.grid{display:grid;grid-template-columns:repeat(7,1fr);gap:15px}img{width:100%;height:245px;object-fit:contain}article{text-align:center;font-size:15px}small{display:block;font-size:11px}</style><h1>${suit} · 逐張對應檢查</h1><div class="grid">${subset
      .map((c) => {
        const a = deckAssets.find((x) => x.id === c.id)!;
        return `<article><img src="data:image/webp;base64,${fs.readFileSync("public" + a.path).toString("base64")}"/><div>ID ${c.id} · ${c.number} · ${c.name}</div><small>${c.en}</small></article>`;
      })
      .join("")}</div></html>`,
  );
  await page.evaluate(() =>
    Promise.all([...document.images].map((i) => i.decode())),
  );
  await page.screenshot({
    path: `docs/round1-contact-${group}.png`,
    fullPage: true,
  });
}
await browser.close();
fs.writeFileSync(
  "docs/round1-card-audit.json",
  JSON.stringify(
    cards.map((c) => ({
      ...c,
      artwork: deckAssets.find((a) => a.id === c.id)?.fileTitle,
    })),
    null,
    2,
  ),
);
