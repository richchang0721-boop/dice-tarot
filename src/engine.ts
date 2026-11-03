export interface DeckCard {
  id: number;
  reversed: boolean;
}
export interface Roll {
  value: number;
  remaining: number;
  accepted: boolean;
  position: number | null;
  cardId: number | null;
}
export type UintSource = () => number;
const cryptoUint: UintSource = () =>
  crypto.getRandomValues(new Uint32Array(1))[0];
export function randomInt(
  max: number,
  source: UintSource = cryptoUint,
): number {
  if (!Number.isInteger(max) || max < 1 || max > 2 ** 32)
    throw new RangeError("Invalid range");
  const limit = Math.floor(2 ** 32 / max) * max;
  let n: number;
  do {
    n = source();
  } while (n >= limit);
  return n % max;
}
export function shuffle(source?: UintSource): DeckCard[] {
  const deck = Array.from({ length: 78 }, (_, id) => ({
    id,
    reversed: randomInt(2, source) === 1,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = randomInt(i + 1, source);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
export function percentile(source?: UintSource) {
  return randomInt(100, source) + 1;
}
export function diceDigits(value: number) {
  return { tens: Math.floor((value % 100) / 10) * 10, ones: value % 10 };
}
export function draw(deck: DeckCard[], value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 100)
    throw new RangeError("Invalid D100");
  const card = value <= deck.length ? deck[value - 1] : null;
  return {
    card,
    deck: card ? deck.filter((_, i) => i !== value - 1) : deck,
    roll: {
      value,
      remaining: deck.length,
      accepted: !!card,
      position: card ? value : null,
      cardId: card?.id ?? null,
    } satisfies Roll,
  };
}
