// Editorial preview selections, pending MARO approval. No sales ranking is implied.
// Names guard the positional snapshot IDs until the authoritative catalog supplies stable IDs.
export type ProductReference = { id: string; name: string };

export const featuredProducts: ProductReference[] = [
  { id: 'hot-4', name: 'Espresso' },
  { id: 'iced-1', name: 'Iced Spanish Latte' },
  { id: 'iced-7', name: 'Strawberry Matcha Latte' },
];

export const pairingRules: {
  sources: ProductReference[];
  targets: ProductReference[];
}[] = [
  {
    sources: [
      { id: 'hot-0', name: 'Turkish Coffee' },
      { id: 'hot-4', name: 'Espresso' },
      { id: 'hot-5', name: 'Macchiato' },
      { id: 'hot-7', name: 'Cortado' },
      { id: 'hot-8', name: 'Americano' },
      { id: 'hot-10', name: 'Cappuccino' },
      { id: 'hot-11', name: 'Latte' },
      { id: 'hot-12', name: 'Flat White' },
      { id: 'iced-0', name: 'Iced Latte' },
      { id: 'iced-1', name: 'Iced Spanish Latte' },
      { id: 'iced-6', name: 'Iced Americano' },
    ],
    targets: [{ id: 'soft-20', name: 'Water' }],
  },
];
