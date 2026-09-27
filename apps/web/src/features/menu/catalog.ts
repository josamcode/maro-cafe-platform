import snapshot from '../../content/menu.snapshot.json';

// Preview adapter. Replace with the authoritative catalog API before ordering.
export const catalog = snapshot.categories;
export type MenuCategory = (typeof catalog)[number];
export type MenuItem = MenuCategory['items'][number];
export type PriceLabel = 'small' | 'large' | 'single' | 'double' | 'standard';

export function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .trim();
}

export function filterCatalog(category: string, query: string) {
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

export const menuBranches = {
  faisal: { ar: 'فيصل', en: 'Faisal' },
  'sahl-hamza': { ar: 'سهل حمزة', en: 'Sahl Hamza' },
  'main-haram': { ar: 'الهرم الرئيسي', en: 'Main Haram' },
};

export function getMenuBranch(value: string | null) {
  return value && Object.hasOwn(menuBranches, value)
    ? menuBranches[value as keyof typeof menuBranches]
    : undefined;
}
