import { test } from "node:test";
import assert from "node:assert/strict";
import { cards } from "../src/cards";
import {
  randomInt,
  shuffle,
  draw,
  percentile,
  diceDigits,
} from "../src/engine";
test("78 unique complete cards and fixed meanings", () => {
  assert.equal(cards.length, 78);
  assert.equal(new Set(cards.map((c) => c.id)).size, 78);
  assert.equal(cards.filter((c) => c.suit === "大阿爾克那").length, 22);
  for (const c of cards)
    for (const key of [
      "name",
      "en",
      "number",
      "suit",
      "meaning",
      "reverseMeaning",
    ] as const)
      assert.ok(c[key]);
});
test("rejection sampling discards biased tail", () => {
  const seq = [4294967295, 4294967294, 77];
  assert.equal(
    randomInt(78, () => seq.shift()!),
    77,
  );
  assert.equal(seq.length, 0);
  assert.throws(() => randomInt(0));
});
test("all cards reachable; no duplicates; order and orientation preserved", () => {
  let deck = shuffle();
  const original = structuredClone(deck);
  const seen = new Set<number>();
  while (deck.length) {
    const idx = Math.floor(deck.length / 2) + 1;
    const before = structuredClone(deck);
    const r = draw(deck, idx);
    assert.deepEqual(r.card, before[idx - 1]);
    seen.add(r.card!.id);
    assert.deepEqual(r.deck, [
      ...before.slice(0, idx - 1),
      ...before.slice(idx),
    ]);
    assert.equal(
      r.card!.reversed,
      original.find((c) => c.id === r.card!.id)!.reversed,
    );
    deck = r.deck;
  }
  assert.equal(seen.size, 78);
});
test("D100 overflow never moves the deck; decreasing ranges", () => {
  let deck = shuffle();
  for (const size of [78, 77, 76]) {
    assert.equal(deck.length, size);
    const bad = draw(deck, 100);
    assert.equal(bad.card, null);
    assert.strictEqual(bad.deck, deck);
    assert.equal(bad.roll.accepted, false);
    const good = draw(deck, size);
    assert.equal(good.roll.position, size);
    deck = good.deck;
  }
  assert.throws(() => draw(deck, 0));
  assert.throws(() => draw(deck, 101));
});
test("percentile 00+0 means 100; tens and units remain distinct", () => {
  assert.equal(
    percentile(() => 99),
    100,
  );
  assert.deepEqual(diceDigits(100), { tens: 0, ones: 0 });
  assert.deepEqual(diceDigits(37), { tens: 30, ones: 7 });
  assert.deepEqual(diceDigits(10), { tens: 10, ones: 0 });
});
