import { openDB } from "idb";
import type { Card } from "./cards";
import type { Roll } from "./engine";
import { getCardAsset } from "./deck";

async function cardImage(id: number): Promise<HTMLImageElement | null> {
  const asset = getCardAsset(id);
  if (!asset) return null;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = asset.path;
  });
}
export interface ResultCard {
  card: Card;
  reversed: boolean;
  position: string;
  drawPosition: number;
}
export interface Reading {
  id: string;
  createdAt: string;
  question: string;
  spread: string;
  meaningVersion: string;
  cards: ResultCard[];
  rolls: Roll[];
}
const database = () =>
  openDB("dice-tarot", 1, {
    upgrade(db) {
      db.createObjectStore("readings", { keyPath: "id" });
    },
  });
export async function saveReading(reading: Reading) {
  const db = await database();
  await db.put("readings", structuredClone(reading));
  db.close();
}
export async function listReadings(): Promise<Reading[]> {
  const db = await database();
  const all = await db.getAll("readings");
  db.close();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function deleteReading(id: string) {
  const db = await database();
  await db.delete("readings", id);
  db.close();
}
export function download(data: Blob, name: string) {
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportJSON(reading: Reading) {
  download(
    new Blob([JSON.stringify(reading, null, 2)], { type: "application/json" }),
    `dice-tarot-${reading.id}.json`,
  );
}
export async function exportPNG(reading: Reading) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#101b25";
  ctx.fillRect(0, 0, 1200, 1600);
  ctx.fillStyle = "#d9bf85";
  ctx.font = "36px serif";
  ctx.fillText("DICE TAROT · 骰塔羅", 60, 70);
  ctx.font = "20px sans-serif";
  ctx.fillText(new Date(reading.createdAt).toLocaleString("zh-TW"), 60, 115);
  const wrap = (text: string, x: number, y: number, width: number) => {
    let line = "";
    for (const char of text) {
      if (ctx.measureText(line + char).width > width) {
        ctx.fillText(line, x, y);
        line = "";
        y += 30;
      }
      line += char;
    }
    ctx.fillText(line, x, y);
    return y + 35;
  };
  const top = wrap(reading.question || "留給此刻的指引", 60, 170, 1080) + 25;
  for (const [i, item] of reading.cards.entries()) {
    const x = reading.cards.length === 1 ? 430 : 60 + i * 370;
    ctx.strokeStyle = "#7f6c47";
    ctx.strokeRect(x, top, 340, 1060);
    ctx.fillStyle = "#d9bf85";
    ctx.font = "24px serif";
    ctx.fillText(item.position, x + 20, top + 45);
    ctx.save();
    ctx.translate(x + 170, top + 270);
    if (item.reversed) ctx.rotate(Math.PI);
    const image = await cardImage(item.card.id);
    if (image) {
      ctx.drawImage(image, -90, -150, 180, 300);
    } else {
      ctx.fillStyle = "#ded4b6";
      ctx.fillRect(-90, -150, 180, 300);
      ctx.strokeStyle = "#9b8758";
      ctx.lineWidth = 3;
      ctx.strokeRect(-82, -142, 164, 284);
      ctx.fillStyle = ["#7e9586", "#a18e6b", "#728f98", "#9c9d75"][
        item.card.id % 4
      ];
      ctx.beginPath();
      ctx.arc(0, -8, 53, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eee2c3";
      ctx.font = "64px serif";
      ctx.textAlign = "center";
      ctx.fillText(
        item.card.suit === "寶劍" ? "⚔" : item.card.suit === "錢幣" ? "✦" : "☾",
        0,
        12,
      );
      ctx.fillStyle = "#30483e";
      ctx.font = "22px serif";
      ctx.fillText(item.card.name, 0, 123);
      ctx.font = "16px serif";
      ctx.fillText(item.card.number, 0, -115);
    }
    ctx.restore();
    ctx.fillStyle = "#d9bf85";
    ctx.font = "32px serif";
    ctx.fillText(item.card.name, x + 20, top + 490);
    ctx.font = "20px sans-serif";
    ctx.fillText(item.reversed ? "逆位" : "正位", x + 20, top + 535);
    wrap(
      (item.reversed ? item.card.reversed : item.card.upright).join(" · "),
      x + 20,
      top + 600,
      300,
    );
    ctx.fillStyle = "#d2d8d2";
    wrap(
      item.reversed ? item.card.reverseMeaning : item.card.meaning,
      x + 20,
      top + 700,
      300,
    );
    ctx.fillText(`抽牌位置 ${item.drawPosition}`, x + 20, top + 1000);
  }
  ctx.fillStyle = "#c2c7cb";
  ctx.font = "18px sans-serif";
  ctx.fillText(
    `固定牌義 ${reading.meaningVersion} · 娛樂與自我反思用途`,
    60,
    top + 1130,
  );
  await new Promise<void>((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("圖片產生失敗"));
        return;
      }
      download(blob, `dice-tarot-${reading.id}.png`);
      resolve();
    }, "image/png"),
  );
}
