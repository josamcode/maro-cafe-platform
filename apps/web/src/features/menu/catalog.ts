import type { CatalogData, CatalogCategory, CatalogProduct } from '@maro/contracts';
export type MenuItem = CatalogProduct;
export type MenuCategory = CatalogCategory & { items: MenuItem[] };
export type PriceLabel = MenuItem['prices'][number]['label'];
export function toMenuCategories(data: CatalogData, branchSlug?: string): MenuCategory[] {
  return data.categories.map((category) => ({
    ...category,
    items: data.products.filter(
      (p) =>
        p.active &&
        p.categoryId === category.id &&
        (!branchSlug || p.branchSlugs.includes(branchSlug)),
    ),
  }));
}
export function getMenuItem(catalog: MenuCategory[], id: string) {
  for (const category of catalog) {
    const item = category.items.find((p) => p.id === id);
    if (item) return { item, category };
  }
  return undefined;
}
export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .trim();
}

export function filterCatalog(catalog: MenuCategory[], category: string, query: string) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return catalog
    .filter((group) => category === 'all' || group.id === category)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const name = normalizeSearch(`${item.name.ar} ${item.name.en}`);
        return terms.every((term) => name.includes(term));
      }),
    }))
    .filter((group) => group.items.length > 0);
}
