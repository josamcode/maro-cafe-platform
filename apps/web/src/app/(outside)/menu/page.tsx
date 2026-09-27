import type { Metadata } from 'next';
import { Container } from '@maro/ui';
import { getLocale, getTheme } from '../../../lib/locale';
import { MenuExperience } from '../../../features/menu/menu-experience';
import { menuMessages } from '../../../features/menu/messages';
import { SiteHeader, SiteFooter } from '../../../features/site/site-shell';
import '../../../features/menu/menu.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = menuMessages[await getLocale()];
  return { title: t.menuTitle, description: t.intro };
}

export default async function MenuPage() {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  return (
    <>
      <SiteHeader locale={locale} theme={theme} />
      <main id="main-content" className="menu-page">
        <Container>
          <MenuExperience locale={locale} />
        </Container>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
