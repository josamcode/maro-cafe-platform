import { getMenuItem } from '../menu/catalog';
import { featuredProducts, pairingRules, type ProductReference } from './data';

export function resolveReferences(references: ProductReference[], excludeId?: string) {
  const seen = new Set<string>(excludeId ? [excludeId] : []);
  return references.flatMap((reference) => {
    const entry = getMenuItem(reference.id);
    if (
      seen.has(reference.id) ||
      !entry ||
      entry.item.name.en !== reference.name ||
      entry.item.prices.length === 0 ||
      entry.item.prices.some((price) => !Number.isFinite(price.amount) || price.amount <= 0)
    )
      return [];
    seen.add(reference.id);
    return [entry];
  });
}

export function getFeaturedProducts() {
  return resolveReferences(featuredProducts);
}

export function getPairings(itemId: string) {
  const references = pairingRules
    .filter((rule) => resolveReferences(rule.sources).some(({ item }) => item.id === itemId))
    .flatMap((rule) => rule.targets);
  return resolveReferences(references, itemId).slice(0, 1);
}
