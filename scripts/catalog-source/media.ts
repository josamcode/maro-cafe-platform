export type MenuMedia = {
  src: string;
  alt: { ar: string; en: string };
  source: string;
  status: 'reference' | 'verified';
  position?: string;
};

// Development references are explicitly permitted to repeat across products.
// Promote an item mapping to verified only after its identity is confirmed.
const hot: MenuMedia = {
  src: '/home/coffee-moment.jpg',
  alt: { ar: 'مشروب ساخن وحلوى من MARO', en: 'A hot drink and dessert at MARO' },
  source: 'https://www.facebook.com/photo/?fbid=969136968765833',
  status: 'reference',
  position: '50% 30%',
};
const chilled: MenuMedia = {
  src: '/menu/chilled-drinks.jpg',
  alt: { ar: 'مشروبات باردة في أكواب MARO', en: 'Chilled drinks in MARO cups' },
  source: 'https://www.facebook.com/photo/?fbid=1078581087821420',
  status: 'reference',
};
export const categoryMedia: Record<string, MenuMedia> = {
  herbs: hot,
  hot,
  fresh: chilled,
  iced: {
    src: '/home/iced-coffee.jpg',
    alt: { ar: 'قهوة باردة من MARO', en: 'Iced coffee at MARO' },
    source: 'https://www.facebook.com/photo/?fbid=1077973387882190',
    status: 'reference',
  },
  milkshake: {
    src: '/home/milkshake.jpg',
    alt: { ar: 'مشروب كريمي بارد من MARO', en: 'A creamy chilled drink at MARO' },
    source: 'https://www.facebook.com/photo/?fbid=1077974971215365',
    status: 'reference',
  },
  soft: chilled,
};

const itemMedia: Record<string, MenuMedia> = {
  'iced-7': {
    src: '/menu/strawberry-matcha.jpg',
    alt: {
      ar: 'مشروب بطبقات خضراء ووردية في كوب MARO',
      en: 'A green and pink layered drink in a MARO cup',
    },
    source: 'https://www.facebook.com/photo/?fbid=1080510667628462',
    status: 'reference',
  },
  'iced-10': {
    src: '/design-system/maro-drink.jpg',
    alt: {
      ar: 'مشروب بارد بصوص الشوكولاتة من MARO',
      en: 'A chilled drink with chocolate sauce at MARO',
    },
    source: 'https://www.facebook.com/photo/?fbid=1078060874540108',
    status: 'reference',
  },
};

export function getMenuMedia(categoryId: string, itemId?: string) {
  return (itemId && itemMedia[itemId]) || categoryMedia[categoryId] || hot;
}
