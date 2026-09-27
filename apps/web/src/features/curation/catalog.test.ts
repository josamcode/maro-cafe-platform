import { describe, expect, it } from 'vitest';
import { getFeaturedProducts, getPairings, resolveReferences } from './catalog';
import { featuredProducts, pairingRules } from './data';
import { getMenuItem } from '../menu/catalog';

describe('editorial catalog references', () => {
  it('rejects stale identities, missing entries, duplicates and self-pairings', () => {
    const water = { id: 'soft-20', name: 'Water' };
    expect(
      resolveReferences([
        water,
        water,
        { id: 'missing', name: 'Cake' },
        { id: 'hot-4', name: 'Cake' },
      ]),
    ).toEqual([getMenuItem(water.id)]);
    expect(resolveReferences([water], water.id)).toEqual([]);
    expect(getPairings('missing')).toEqual([]);
    expect(getPairings('soft-20')).toEqual([]);
    expect(getPairings('iced-7')).toEqual([]);
  });
  it('keeps all configured previews resolvable and prices owned by the catalog', () => {
    expect(getFeaturedProducts()).toHaveLength(featuredProducts.length);
    for (const rule of pairingRules) {
      expect(resolveReferences(rule.sources)).toHaveLength(rule.sources.length);
      expect(resolveReferences(rule.targets)).toHaveLength(rule.targets.length);
      for (const source of rule.sources) {
        for (const entry of getPairings(source.id)) expect(entry).toBe(getMenuItem(entry.item.id));
      }
    }
  });
});
