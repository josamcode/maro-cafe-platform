import { describe, expect, it } from 'vitest';
import { getFeaturedProducts, getPairings } from './catalog';
import { toMenuCategories } from '../menu/catalog';
import { testData, teaId, waterId } from '../catalog/test-catalog';

describe('live curation', () => {
  it('removes hidden and branch-unavailable recommendations', () => {
    const data = structuredClone(testData);
    data.products[0]!.pairingIds = [waterId];
    expect(getPairings(toMenuCategories(data), teaId)).toHaveLength(1);
    data.products[1]!.branchSlugs = ['main-haram'];
    expect(getPairings(toMenuCategories(data, 'faisal'), teaId)).toEqual([]);
    data.products[0]!.active = false;
    expect(getFeaturedProducts(toMenuCategories(data))).toEqual([]);
  });
  it('omits stale and self references while deriving prices from the live catalog', () => {
    const data = structuredClone(testData);
    data.products[0]!.pairingIds = [teaId];
    expect(getPairings(toMenuCategories(data), teaId)).toEqual([]);
    data.products[0]!.pairingIds = ['missing'];
    expect(getPairings(toMenuCategories(data), teaId)).toEqual([]);
    data.products[0]!.prices[0]!.amount = 40;
    expect(getFeaturedProducts(toMenuCategories(data))[0]!.item.prices[0]!.amount).toBe(40);
  });
});
