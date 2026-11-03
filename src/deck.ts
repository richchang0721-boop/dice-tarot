import manifest from "./deck-assets.json";
// Artwork is independent of meanings and randomization. Stable IDs also support old reading snapshots.
export const deckAssets = manifest;
const byId = new Map(deckAssets.map((asset) => [asset.id, asset]));
export function getCardAsset(id: number) {
  return byId.get(id);
}
