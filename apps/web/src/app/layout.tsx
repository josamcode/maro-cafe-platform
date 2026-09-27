import type { Metadata } from 'next';
import { getLocale, getTheme } from '../lib/locale';
import { DM_Sans, IBM_Plex_Sans_Arabic, Newsreader } from 'next/font/google';
import './globals.css';

const latin = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const arabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600'],
  subsets: ['arabic'],
  variable: '--font-plex-arabic',
  display: 'swap',
});
const display = Newsreader({ subsets: ['latin'], variable: '--font-newsreader', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'MARO — Development Preview', template: '%s | MARO' },
  description: 'MARO digital experience development preview.',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, theme] = await Promise.all([getLocale(), getTheme()]);
  return (
    <html
      lang={locale}
      data-theme={theme}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${latin.variable} ${arabic.variable} ${display.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
