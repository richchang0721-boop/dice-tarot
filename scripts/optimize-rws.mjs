import fs from "node:fs";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
const manifest = JSON.parse(fs.readFileSync("src/deck-assets.json", "utf8"));
const browser = await chromium.launch();
const page = await browser.newPage();
fs.mkdirSync(".asset-cache/rws", { recursive: true });
for (const item of manifest) {
  const source = `.asset-cache/rws/${String(item.id).padStart(2, "0")}.jpg`;
  const bytes = fs.readFileSync(source);
  const encoded = await page.evaluate(async (base64) => {
    const img = new Image();
    img.src = "data:image/jpeg;base64," + base64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 480;
    c.height = Math.round((img.height * 480) / img.width);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/webp", 0.88).split(",")[1];
  }, bytes.toString("base64"));
  const output = Buffer.from(encoded, "base64");
  item.originalSha256 = createHash("sha256").update(bytes).digest("hex");
  item.sha256 = createHash("sha256").update(output).digest("hex");
  item.path = item.path.replace(".jpg", ".webp");
  item.transform =
    "Scaled to width 480px; aspect ratio preserved; WebP quality .88; no recoloring or content changes";
  fs.writeFileSync("public" + item.path, output);
}
await browser.close();
fs.writeFileSync("src/deck-assets.json", JSON.stringify(manifest, null, 2));
console.log("Optimized all 78; originals retained in .asset-cache/rws");
