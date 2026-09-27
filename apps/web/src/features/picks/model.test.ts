import { describe, expect, it } from 'vitest';
import { makePick, readPicks, resolvePick } from './model';
import { testCatalog as catalog, teaId } from '../catalog/test-catalog';
const tea = { itemId: teaId, itemName: 'Tea', variant: 'standard', quantity: 2 };
const stored = (items: unknown[]) => JSON.stringify({ version: 1, items });

describe('saved picks with authoritative data', () => {
  it('rejects invalid storage, versions and quantities', () => {
    expect(readPicks('{broken', catalog)).toEqual([]);
    expect(readPicks(JSON.stringify({ version: 2, items: [tea] }), catalog)).toEqual([]);
    expect(
      readPicks(
        stored([null, {}, ...[-2, 0, 1.5, 100, '2'].map((quantity) => ({ ...tea, quantity }))]),
        catalog,
      ),
    ).toEqual([]);
  });
  it('migrates legacy identity once, and keeps stable identity through renaming', () => {
    expect(readPicks(stored([{ ...tea, itemId: 'herbs-0' }]), catalog)).toEqual([tea]);
    expect(
      readPicks(stored([{ ...tea, itemId: 'herbs-0', itemName: 'Different product' }]), catalog),
    ).toEqual([]);
    expect(readPicks(stored([{ ...tea, itemName: 'Old name' }]), catalog)).toEqual([tea]);
    expect(makePick('missing', 'standard', catalog)).toBeNull();
  });
  it('merges variants, caps quantities and ignores stored prices', () => {
    const saved = readPicks(stored([tea, { ...tea, quantity: 3, unitPrice: 1 }]), catalog);
    expect(saved[0]!.quantity).toBe(5);
    expect(resolvePick(saved[0]!, catalog)?.total).toBe(125);
    expect(readPicks(stored([{ ...tea, quantity: 98 }, tea]), catalog)[0]!.quantity).toBe(99);
  });
  it('retains unavailable stable identities without charging stale prices', () => {
    expect(readPicks(stored([tea]), [])).toEqual([tea]);
    expect(resolvePick(tea, [])).toBeNull();
    expect(resolvePick({ ...tea, variant: 'large' }, catalog)).toBeNull();
  });
});
