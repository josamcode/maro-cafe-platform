import type { Metadata } from 'next';
import { HomePage } from '../../features/home/home-page';
import { getLocale } from '../../lib/locale';
import { homeMessages } from '../../features/home/messages';
export async function generateMetadata(): Promise<Metadata> {
  const t = homeMessages[await getLocale()];
  return { title: 'MARO Mini Café', description: t.intro };
}
export default async function Page() {
  return <HomePage locale={await getLocale()} />;
}
