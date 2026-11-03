import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { cards } from "../src/cards";
import { deckAssets, getCardAsset } from "../src/deck";
test("all 78 artwork mappings are unique, public-domain sourced and byte-verified", () => {
  assert.equal(deckAssets.length, 78);
  assert.equal(new Set(deckAssets.map((a) => a.id)).size, 78);
  assert.equal(new Set(deckAssets.map((a) => a.path)).size, 78);
  for (const card of cards) {
    const asset = getCardAsset(card.id)!;
    assert.ok(asset);
    assert.equal(asset.license, "Public domain");
    assert.ok(
      asset.sourcePage.startsWith("https://commons.wikimedia.org/wiki/File:"),
    );
    const bytes = fs.readFileSync("public" + asset.path);
    assert.equal(bytes.subarray(0, 4).toString(), "RIFF");
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      asset.sha256,
    );
    const expected =
      card.id < 22
        ? `File:RWS Tarot ${String(card.id).padStart(2, "0")} ${card.en.replace(/^The /, "")}.jpg`
        : `File:${["Wands", "Cups", "Swords", "Pents"][Math.floor((card.id - 22) / 14)]}${String(((card.id - 22) % 14) + 1).padStart(2, "0")}.jpg`;
    assert.equal(asset.fileTitle, expected);
  }
});
