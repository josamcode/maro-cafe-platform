import Link from 'next/link';
import { AdminNavigation } from '../../../features/admin/navigation';
import { Eye } from 'lucide-react';
import { Button, Container } from '@maro/ui';
import { getLocale, getTheme } from '../../../lib/locale';
import { SitePreferences } from '../../../features/site/site-preferences';
import { adminMessages } from '../../../features/admin/messages';
import '../../../features/home/home.css';
import '../../../features/menu/menu.css';
import '../../../features/admin/admin.css';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  return (
    <>
      <header className="admin-header">
        <Container>
          <Link href="/admin" className="home-wordmark">
            MARO
          </Link>
          <SitePreferences locale={locale} theme={theme} />
          <Button asChild variant="outline" size="sm" className="admin-preview-link">
            <Link href="/" target="_blank" aria-label={adminMessages[locale].preview}>
              <Eye size={18} aria-hidden="true" />
              <span>{adminMessages[locale].preview}</span>
            </Link>
          </Button>
        </Container>
      </header>
      <main id="main-content" className="admin-main">
        <Container>
          <AdminNavigation locale={locale} />
          {children}
        </Container>
      </main>
    </>
  );
}
