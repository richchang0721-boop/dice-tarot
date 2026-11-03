import fs from "node:fs";
import { createHash } from "node:crypto";
const pages = Object.values(
  JSON.parse(fs.readFileSync("docs/rws-source-metadata.json", "utf8")).query
    .pages,
);
const manifest = pages
  .map((p) => {
    const info = p.imageinfo[0],
      m = info.extmetadata;
    if (
      m.LicenseShortName?.value !== "Public domain" ||
      m.Copyrighted?.value !== "False"
    )
      throw Error("Unclear license " + p.title);
    const major = p.title.match(/RWS Tarot (\d+)/),
      minor = p.title.match(/(Wands|Cups|Swords|Pents)(\d+)/);
    const id = major
      ? Number(major[1])
      : 22 +
        ["Wands", "Cups", "Swords", "Pents"].indexOf(minor[1]) * 14 +
        Number(minor[2]) -
        1;
    return {
      id,
      path: `/decks/rws/${String(id).padStart(2, "0")}.jpg`,
      fileTitle: p.title,
      sourcePage: info.descriptionurl,
      url: info.url,
      description: m.ImageDescription.value,
      artist: m.Artist.value,
      license: m.LicenseShortName.value,
      sourceCredit: m.Credit?.value,
      width: info.width,
      height: info.height,
      commonsSha1: info.sha1,
    };
  })
  .sort((a, b) => a.id - b.id);
if (manifest.length !== 78 || new Set(manifest.map((m) => m.id)).size !== 78)
  throw Error("Invalid mapping");
fs.mkdirSync(".asset-cache/rws", { recursive: true });
for (const item of manifest) {
  const path = `.asset-cache/rws/${String(item.id).padStart(2, "0")}.jpg`;
  if (!fs.existsSync(path)) {
    let response;
    for (let attempt = 0; attempt < 6; attempt++) {
      response = await fetch(item.url);
      if (response.ok || ![429, 503].includes(response.status)) break;
      await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
    }
    if (!response.ok) throw Error(`${response.status}: ${item.fileTitle}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes[0] !== 255 || bytes[1] !== 216) throw Error("Invalid JPEG");
    fs.writeFileSync(path, bytes);
    await new Promise((r) => setTimeout(r, 1800));
  }
  item.sha256 = createHash("sha256")
    .update(fs.readFileSync(path))
    .digest("hex");
  console.log(`${item.id + 1}/78 ${item.fileTitle}`);
}
fs.writeFileSync("src/deck-assets.json", JSON.stringify(manifest, null, 2));
