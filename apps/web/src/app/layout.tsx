import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'MARO — Development Preview', template: '%s | MARO' },
  description: 'MARO digital experience development preview.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
          <Link href="/" className="text-2xl font-bold tracking-[0.25em]">
            MARO
          </Link>
          <span className="text-xs uppercase tracking-widest text-stone-600">
            Development preview
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
