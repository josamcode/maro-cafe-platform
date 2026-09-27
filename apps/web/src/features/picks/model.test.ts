import { describe, expect, it } from 'vitest';
import { makePick, readPicks, resolvePick } from './model';

const tea = { itemId: 'herbs-0', itemName: 'Tea', variant: 'standard', quantity: 2 };
const stored = (items: unknown[]) => JSON.stringify({ version: 1, items });

describe('saved picks validation', () => {
  it('discards malformed data, unsupported versions and invalid quantities', () => {
    expect(readPicks('{broken')).toEqual([]);
    expect(readPicks(JSON.stringify({ version: 2, items: [tea] }))).toEqual([]);
    expect(
      readPicks(
        stored([null, {}, ...[-2, 0, 1.5, 100, '2'].map((quantity) => ({ ...tea, quantity }))]),
      ),
    ).toEqual([]);
  });
  it('rejects obsolete identities and unsupported options', () => {
    expect(
      readPicks(
        stored([
          { ...tea, itemName: 'Different product' },
          { ...tea, itemId: 'missing' },
          { ...tea, variant: 'large' },
        ]),
      ),
    ).toEqual([]);
    expect(makePick('missing', 'standard')).toBeNull();
  });
  it('merges duplicate variants and caps the recovered quantity', () => {
    expect(readPicks(stored([tea, { ...tea, quantity: 3 }]))).toEqual([{ ...tea, quantity: 5 }]);
    expect(readPicks(stored([{ ...tea, quantity: 98 }, tea]))[0]?.quantity).toBe(99);
  });
  it('ignores saved prices and calculates totals from the current catalog', () => {
    const [pick] = readPicks(stored([{ ...tea, unitPrice: 1, total: 2 }]));
    expect(resolvePick(pick!)?.unitPrice).toBe(25);
    expect(resolvePick(pick!)?.total).toBe(50);
  });
});
