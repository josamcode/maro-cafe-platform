import type { Metadata } from 'next';
import { HomePage } from '../../features/home/home-page';
import { getLocale, getTheme } from '../../lib/locale';
import { homeMessages } from '../../features/home/messages';
export async function generateMetadata(): Promise<Metadata> {
  const t = homeMessages[await getLocale()];
  return { title: 'MARO Mini Café', description: t.intro };
}
export default async function Page() {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  return <HomePage locale={locale} theme={theme} />;
}
