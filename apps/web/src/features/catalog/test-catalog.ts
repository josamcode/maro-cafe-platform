import type { CatalogData, CatalogProduct } from '@maro/contracts';
import { toMenuCategories } from '../menu/catalog';
export const teaId = '00000000-0000-4000-8000-000000000001';
export const waterId = '00000000-0000-4000-8000-000000000002';
export const media = {
  src: '/menu/chilled-drinks.jpg',
  alt: { ar: 'صورة', en: 'Photo' },
  source: 'test',
  status: 'reference' as const,
};
export function testProduct(id: string, overrides: Partial<CatalogProduct> = {}): CatalogProduct {
  return {
    id,
    legacyId: 'herbs-0',
    name: { ar: 'شاي', en: 'Tea' },
    categoryId: 'herbs',
    prices: [{ label: 'standard', amount: 25 }],
    media,
    active: true,
    version: 1,
    featuredOrder: 1,
    pairingIds: [],
    branchSlugs: ['faisal'],
    ...overrides,
  };
}
export const testData: CatalogData = {
  categories: [{ id: 'herbs', name: { ar: 'مشروبات', en: 'Drinks' }, media }],
  branches: [],
  products: [
    testProduct(teaId),
    testProduct(waterId, {
      legacyId: 'soft-20',
      name: { ar: 'مياه', en: 'Water' },
      featuredOrder: null,
      prices: [{ label: 'small', amount: 10 }],
    }),
  ],
};
export const testCatalog = toMenuCategories(testData);
