import { test } from "node:test";
import assert from "node:assert/strict";
import { cards } from "../src/cards";
import { draw, type DeckCard } from "../src/engine";
const roman = [
  "0",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
];
const majors = [
  "愚者|The Fool",
  "魔術師|The Magician",
  "女祭司|The High Priestess",
  "皇后|The Empress",
  "皇帝|The Emperor",
  "教皇|The Hierophant",
  "戀人|The Lovers",
  "戰車|The Chariot",
  "力量|Strength",
  "隱者|The Hermit",
  "命運之輪|Wheel of Fortune",
  "正義|Justice",
  "倒吊人|The Hanged Man",
  "死神|Death",
  "節制|Temperance",
  "惡魔|The Devil",
  "高塔|The Tower",
  "星星|The Star",
  "月亮|The Moon",
  "太陽|The Sun",
  "審判|Judgement",
  "世界|The World",
];
test("all 22 RWS major bilingual names and Roman numbers, Strength VIII / Justice XI", () => {
  majors.forEach((pair, i) => {
    assert.equal(cards[i].name + "|" + cards[i].en, pair);
    assert.equal(cards[i].number, roman[i]);
    assert.equal(cards[i].id, i);
    assert.equal(cards[i].suit, "大阿爾克那");
  });
});
test("all 56 minor bilingual names, suit and ranks 1-14", () => {
  const zh = [
      "王牌",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "侍者",
      "騎士",
      "皇后",
      "國王",
    ],
    en = [
      "Ace",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Page",
      "Knight",
      "Queen",
      "King",
    ];
  [
    ["權杖", "Wands"],
    ["聖杯", "Cups"],
    ["寶劍", "Swords"],
    ["錢幣", "Pentacles"],
  ].forEach(([suit, english], s) =>
    zh.forEach((rank, r) => {
      const c = cards[22 + s * 14 + r];
      assert.equal(c.name, suit + rank);
      assert.equal(c.en, en[r] + " of " + english);
      assert.equal(c.number, String(r + 1));
      assert.equal(c.suit, suit);
    }),
  );
});
test("78 unique IDs, names and complete distinct upright/reversed interpretations", () => {
  for (const key of ["id", "name", "en"] as const)
    assert.equal(new Set(cards.map((c) => c[key])).size, 78);
  for (const c of cards) {
    assert.equal(c.upright.length, 3);
    assert.equal(c.reversed.length, 3);
    assert.ok(c.upright.every(Boolean) && c.reversed.every(Boolean));
    assert.notEqual(c.meaning, c.reverseMeaning);
    assert.ok(c.meaning.length > 10 && c.reverseMeaning.length > 10);
  }
});
test("regression 19,82,32,62 retains order, orientation and complete serializable audit", () => {
  let deck: DeckCard[] = Array.from({ length: 78 }, (_, id) => ({
    id,
    reversed: id % 2 === 1,
  }));
  const original = structuredClone(deck),
    rolls = [],
    picked = [];
  for (const value of [19, 82, 32, 62]) {
    const before = structuredClone(deck);
    const r = draw(deck, value);
    rolls.push(r.roll);
    if (r.card) {
      assert.deepEqual(r.card, before[value - 1]);
      assert.deepEqual(
        r.deck,
        before.filter((_, i) => i !== value - 1),
      );
      assert.deepEqual(r.card, original[r.card.id]);
      picked.push({
        id: r.card.id,
        reversed: r.card.reversed,
        drawPosition: value,
      });
    } else {
      assert.strictEqual(r.deck, deck);
      assert.deepEqual(r.deck, before);
      assert.equal(r.roll.position, null);
      assert.equal(r.roll.cardId, null);
    }
    deck = r.deck;
  }
  assert.equal(deck.length, 75);
  assert.deepEqual(
    picked.map((c) => c.id),
    [18, 32, 63],
  );
  assert.equal(new Set(picked.map((c) => c.id)).size, 3);
  assert.ok(picked.every((c) => !deck.some((d) => d.id === c.id)));
  const json = JSON.parse(JSON.stringify({ picked, rolls }));
  assert.deepEqual(
    json.rolls.map((r: any) => [r.value, r.remaining, r.accepted, r.position]),
    [
      [19, 78, true, 19],
      [82, 77, false, null],
      [32, 77, true, 32],
      [62, 76, true, 62],
    ],
  );
  assert.deepEqual(
    json.picked.map((c: any) => c.drawPosition),
    json.rolls.filter((r: any) => r.accepted).map((r: any) => r.position),
  );
});
