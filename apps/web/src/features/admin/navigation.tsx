'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@maro/ui';
import type { Locale } from '../../lib/locale';
export function AdminNavigation({ locale }: { locale: Locale }) {
  const path = usePathname();
  const links = [
    { href: '/admin', ar: 'المنتجات', en: 'Products' },
    { href: '/admin/offers', ar: 'العروض', en: 'Offers' },
    { href: '/admin/insights', ar: 'التفاعل', en: 'Engagement' },
  ];
  return (
    <nav
      className="admin-navigation"
      aria-label={locale === 'ar' ? 'أقسام الإدارة' : 'Management sections'}
    >
      {links.map((link) => {
        const active =
          link.href === '/admin'
            ? path === '/admin' || path.startsWith('/admin/products')
            : path.startsWith(link.href);
        return (
          <Button key={link.href} asChild variant={active ? 'outline' : 'quiet'} size="sm">
            <Link href={link.href} aria-current={active ? 'page' : undefined}>
              {link[locale]}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
