import { getLocale, getTheme } from '../../../lib/locale';
import { SiteHeader, SiteFooter } from '../../../features/site/site-shell';
import '../../../features/branches/branches.css';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  return (
    <>
      <SiteHeader locale={locale} theme={theme} />
      {children}
      <SiteFooter locale={locale} />
    </>
  );
}
