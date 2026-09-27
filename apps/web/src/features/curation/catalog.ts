import { getMenuItem, type MenuCategory } from '../menu/catalog';
export function getFeaturedProducts(catalog: MenuCategory[]) {
  return catalog
    .flatMap((category) =>
      category.items
        .filter((item) => item.featuredOrder !== null)
        .map((item) => ({ item, category })),
    )
    .sort((a, b) => a.item.featuredOrder! - b.item.featuredOrder!)
    .slice(0, 6);
}
export function getPairings(catalog: MenuCategory[], itemId: string) {
  const item = getMenuItem(catalog, itemId)?.item;
  return (item?.pairingIds ?? [])
    .filter((id) => id !== itemId)
    .flatMap((id) => {
      const entry = getMenuItem(catalog, id);
      return entry ? [entry] : [];
    })
    .slice(0, 1);
}
