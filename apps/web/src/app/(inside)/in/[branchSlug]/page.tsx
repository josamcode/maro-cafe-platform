import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Container, Text } from '@maro/ui';
import { getLocale, getTheme } from '../../../../lib/locale';
import { getMenuBranch } from '../../../../features/menu/catalog';
import { MenuExperience } from '../../../../features/menu/menu-experience';
import { insideMessages } from '../../../../features/inside/messages';
import '../../../../features/home/home.css';
import '../../../../features/menu/menu.css';
import '../../../../features/inside/inside.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branchSlug: string }>;
}): Promise<Metadata> {
  const [{ branchSlug }, locale] = await Promise.all([params, getLocale()]);
  const branch = getMenuBranch(branchSlug);
  return { title: `${insideMessages[locale].menu}${branch ? ` · ${branch[locale]}` : ''}` };
}

export default async function InsideMenuPage({
  params,
}: {
  params: Promise<{ branchSlug: string }>;
}) {
  const [{ branchSlug }, locale, theme] = await Promise.all([params, getLocale(), getTheme()]);
  if (!getMenuBranch(branchSlug)) notFound();
  const t = insideMessages[locale];
  return (
    <main id="main-content" className="inside-page">
      <Container>
        <MenuExperience locale={locale} inside={{ branchSlug, theme }} />
        <footer className="inside-footer">
          <Text tone="muted">{t.footer}</Text>
          <Button asChild variant="outline">
            <Link href="/">{t.website}</Link>
          </Button>
        </footer>
      </Container>
    </main>
  );
}
