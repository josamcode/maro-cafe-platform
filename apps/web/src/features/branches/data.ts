// Source-listed preview data; see assets/maro/metadata/branches.json.
// Hours, services and branch-specific photos await owner confirmation.
export const maroContact = { phone: '+201158750004' };
export const branches = [
  {
    slug: 'faisal',
    name: { ar: 'فيصل', en: 'Faisal' },
    area: { ar: 'التعاون، فيصل', en: 'Al-Taawon, Faisal' },
    address: { ar: '٦ شارع الأمراء، التعاون، فيصل', en: '6 Al-Omara Street, Al-Taawon, Faisal' },
    maps: 'https://maps.app.goo.gl/ZaSq4xeTkhSkxjcN6',
    addressConflict: false,
  },
  {
    slug: 'sahl-hamza',
    name: { ar: 'سهل حمزة', en: 'Sahl Hamza' },
    area: { ar: 'سهل حمزة، الهرم', en: 'Sahl Hamza, Haram' },
    address: { ar: '١٣ شارع سهل حمزة، الهرم، الجيزة', en: '13 Sahl Hamza Street, Haram, Giza' },
    maps: 'https://maps.app.goo.gl/W1ksi3C4dRJuXTLk8',
    addressConflict: false,
  },
  {
    slug: 'main-haram',
    name: { ar: 'الهرم الرئيسي', en: 'Main Haram' },
    area: { ar: 'شارع الهرم، الجيزة', en: 'El Haram Street, Giza' },
    address: { ar: 'شارع الهرم، الجيزة', en: 'El Haram Street, Giza' },
    maps: 'https://maps.app.goo.gl/7dMZ25kGE4Evoz8i7',
    addressConflict: true,
  },
] as const;

export type Branch = (typeof branches)[number];
export function getBranch(slug: string | null) {
  return branches.find((branch) => branch.slug === slug);
}
