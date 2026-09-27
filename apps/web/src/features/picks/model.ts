import { catalog } from '../menu/catalog';

export const MAX_PICK_QUANTITY = 99;
export type SavedPick = { itemId: string; itemName: string; variant: string; quantity: number };
export const pickKey = (pick: Pick<SavedPick, 'itemId' | 'variant'>) =>
  `${pick.itemId}:${pick.variant}`;
const items = new Map(
  catalog.flatMap((category) =>
    category.items.map((item) => [item.id, { item, category }] as const),
  ),
);

export function resolvePick(pick: SavedPick) {
  const entry = items.get(pick.itemId);
  const option = entry?.item.prices.find((price) => price.label === pick.variant);
  if (!entry || !option || pick.itemName !== entry.item.name.en) return null;
  return { ...pick, ...entry, unitPrice: option.amount, total: option.amount * pick.quantity };
}

export function readPicks(raw: string | null | undefined): SavedPick[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (
      !data ||
      typeof data !== 'object' ||
      !('version' in data) ||
      data.version !== 1 ||
      !('items' in data) ||
      !Array.isArray(data.items)
    )
      return [];
    const merged = new Map<string, SavedPick>();
    for (const value of data.items.slice(0, 200)) {
      if (
        !value ||
        typeof value !== 'object' ||
        typeof value.itemId !== 'string' ||
        typeof value.itemName !== 'string' ||
        typeof value.variant !== 'string' ||
        !Number.isInteger(value.quantity) ||
        value.quantity < 1 ||
        value.quantity > MAX_PICK_QUANTITY
      )
        continue;
      const pick: SavedPick = {
        itemId: value.itemId,
        itemName: value.itemName,
        variant: value.variant,
        quantity: value.quantity,
      };
      if (!resolvePick(pick)) continue;
      const key = pickKey(pick);
      pick.quantity = Math.min(MAX_PICK_QUANTITY, pick.quantity + (merged.get(key)?.quantity ?? 0));
      merged.set(key, pick);
    }
    return [...merged.values()];
  } catch {
    return [];
  }
}

export function makePick(itemId: string, variant: string): SavedPick | null {
  const entry = items.get(itemId);
  if (!entry?.item.prices.some((price) => price.label === variant)) return null;
  return { itemId, itemName: entry.item.name.en, variant, quantity: 1 };
}
