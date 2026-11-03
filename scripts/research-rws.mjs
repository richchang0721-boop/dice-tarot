import fs from "node:fs";
const params = new URLSearchParams({
  action: "query",
  generator: "categorymembers",
  gcmtitle: "Category:Rider-Waite-Smith tarot deck (TaionWC)",
  gcmtype: "file",
  gcmlimit: "100",
  prop: "imageinfo",
  iiprop: "url|extmetadata|sha1|size",
  format: "json",
});
const json = await (
  await fetch("https://commons.wikimedia.org/w/api.php?" + params)
).json();
fs.writeFileSync(
  "docs/rws-source-metadata.json",
  JSON.stringify(json, null, 2),
);
console.log(
  Object.values(json.query.pages)
    .map((p) => p.title)
    .join("\n"),
);
