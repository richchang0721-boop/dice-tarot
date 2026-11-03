import { shuffle, draw, percentile } from "../src/engine";
import { writeFileSync } from "node:fs";
const N = 100000,
  counts = Array(78).fill(0),
  positions = Array.from({ length: 78 }, () => Array(78).fill(0)),
  dice = Array(100).fill(0);
let rev = 0,
  repeats = 0,
  previous = -1,
  invalid = 0;
for (let i = 0; i < N; i++) {
  let deck = shuffle();
  for (let p = 0; p < 78; p++) {
    positions[p][deck[p].id]++;
    if (deck[p].reversed) rev++;
  }
  let n: number;
  do {
    n = percentile();
    dice[n - 1]++;
    if (n > deck.length) invalid++;
  } while (n > deck.length);
  const first = draw(deck, n);
  counts[first.card!.id]++;
  if (previous === first.card!.id) repeats++;
  previous = first.card!.id;
  const seen = new Set([first.card!.id]);
  deck = first.deck;
  for (let j = 0; j < 2; j++) {
    do {
      n = percentile();
    } while (n > deck.length);
    const r = draw(deck, n);
    if (seen.has(r.card!.id)) throw Error("Duplicate in spread");
    seen.add(r.card!.id);
    deck = r.deck;
  }
}
const expected = N / 78;
const chi = (values: number[], e: number) =>
  values.reduce((s, v) => s + (v - e) ** 2 / e, 0);
const firstChi = chi(counts, expected);
const maxPositionChi = Math.max(...positions.map((row) => chi(row, expected)));
const reverseRate = rev / (N * 78);
const report = {
  simulations: N,
  source: "Node Web Crypto getRandomValues, actual production algorithms",
  firstDraw: {
    expectedPerCard: expected,
    min: Math.min(...counts),
    max: Math.max(...counts),
    chiSquare: firstChi,
    df: 77,
    limit: 140,
  },
  orientation: {
    samples: N * 78,
    reversed: rev,
    rate: reverseRate,
    standardError: Math.sqrt(0.25 / (N * 78)),
    sixSigmaTolerance: 6 * Math.sqrt(0.25 / (N * 78)),
  },
  fixedPositions: {
    positions: 78,
    dfPerPosition: 77,
    maxChiSquare: maxPositionChi,
    conservativeFamilyLimit: 170,
  },
  adjacentFirstCardRepeats: {
    observed: repeats,
    expected: (N - 1) / 78,
    sixSigmaTolerance: 6 * Math.sqrt(((N - 1) / 78) * (77 / 78)),
  },
  d100: {
    counts: dice,
    chiSquare: chi(dice, dice.reduce((a, b) => a + b, 0) / 100),
    df: 99,
  },
  rejectedFirstRolls: invalid,
  firstCardCounts: counts,
  passed:
    firstChi < 140 &&
    maxPositionChi < 170 &&
    Math.abs(reverseRate - 0.5) < 6 * Math.sqrt(0.25 / (N * 78)) &&
    Math.abs(repeats - (N - 1) / 78) <
      6 * Math.sqrt(((N - 1) / 78) * (77 / 78)),
};
writeFileSync("docs/statistics.json", JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      ...report,
      firstCardCounts: undefined,
      d100: { ...report.d100, counts: undefined },
    },
    null,
    2,
  ),
);
if (!report.passed) process.exitCode = 1;
