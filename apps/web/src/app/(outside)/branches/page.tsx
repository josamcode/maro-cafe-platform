import type { Metadata } from 'next';
import { Container, Heading, Stack, Text } from '@maro/ui';
import { getLocale } from '../../../lib/locale';
import { branchMessages } from '../../../features/branches/messages';
import { BranchList } from '../../../features/branches/branch-list';
import { BranchMood } from '../../../features/branches/branch-mood';
import { AtMaroPrompt } from '../../../features/branches/at-maro-prompt';

export async function generateMetadata(): Promise<Metadata> {
  const t = branchMessages[await getLocale()];
  return { title: t.locations, description: t.intro };
}
export default async function BranchesPage() {
  const locale = await getLocale();
  const t = branchMessages[locale];
  return (
    <main id="main-content" className="branches-page">
      <Container>
        <div className="branch-directory">
          <section className="branches-intro">
            <Stack gap="lg">
              <Text tone="eyebrow">{t.locations}</Text>
              <Heading as="h1" size="display">
                {t.title}
              </Heading>
              <Text tone="muted">{t.intro}</Text>
              <AtMaroPrompt locale={locale} />
            </Stack>
          </section>
          <BranchList locale={locale} />
          <BranchMood locale={locale} />
        </div>
      </Container>
    </main>
  );
}
