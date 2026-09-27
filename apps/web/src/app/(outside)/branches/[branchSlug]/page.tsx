import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Container, Heading, Stack, Text } from '@maro/ui';
import { getLocale } from '../../../../lib/locale';
import { getPublicBranch, getPublicCatalog } from '../../../../lib/catalog';
import { branchMessages } from '../../../../features/branches/messages';
import { BranchList } from '../../../../features/branches/branch-list';
import { BranchMood } from '../../../../features/branches/branch-mood';
import { BranchActions } from '../../../../features/branches/branch-actions';
import { AtMaroPrompt } from '../../../../features/branches/at-maro-prompt';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branchSlug: string }>;
}): Promise<Metadata> {
  const [{ branchSlug }, locale] = await Promise.all([params, getLocale()]);
  const branch = await getPublicBranch(branchSlug);
  return {
    title: branch
      ? `${branch.name[locale]} · ${branchMessages[locale].locations}`
      : branchMessages[locale].unavailable,
  };
}

export default async function BranchPage({ params }: { params: Promise<{ branchSlug: string }> }) {
  const [{ branchSlug }, locale] = await Promise.all([params, getLocale()]);
  const branch = await getPublicBranch(branchSlug);
  if (!branch) notFound();
  const { branches } = await getPublicCatalog();
  const t = branchMessages[locale];
  return (
    <main id="main-content" className="branches-page">
      <Container>
        <nav aria-label={t.locations}>
          <Button asChild variant="quiet" size="sm">
            <Link href="/branches">{t.all}</Link>
          </Button>
        </nav>
        <section className="branch-hero" aria-labelledby="branch-title">
          <Stack gap="lg">
            <Stack gap="sm">
              <Text tone="eyebrow">{t.locations}</Text>
              <Heading as="h1" size="display" id="branch-title">
                {branch.name[locale]}
              </Heading>
            </Stack>
            <Stack gap="sm">
              <Text tone="eyebrow">{t.address}</Text>
              <address className="branch-address">{branch.address[locale]}</address>
              {branch.addressConflict && (
                <Text tone="muted" className="branch-note">
                  {t.mapHint}
                </Text>
              )}
            </Stack>
            <Stack gap="sm">
              <BranchActions branch={branch} locale={locale} full />
              <Text tone="muted" className="branch-note">
                {t.contactHint}
              </Text>
            </Stack>
            <AtMaroPrompt locale={locale} branchSlug={branch.slug} />
          </Stack>
          <BranchMood locale={locale} />
        </section>
        <section className="branch-visit" aria-label={t.visit}>
          <Stack gap="sm">
            <Heading size="title">{t.hours}</Heading>
            <Text tone="muted">{t.hoursHint}</Text>
          </Stack>
          <Stack gap="sm">
            <Heading size="title">{t.services}</Heading>
            <Text tone="muted">{t.servicesHint}</Text>
          </Stack>
        </section>
        <section className="branch-other" aria-labelledby="other-branches">
          <Heading id="other-branches" size="title">
            {t.choose}
          </Heading>
          <BranchList
            locale={locale}
            items={branches.filter((item) => item.slug !== branch.slug)}
          />
        </section>
      </Container>
    </main>
  );
}
