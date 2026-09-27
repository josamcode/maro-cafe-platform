import Link from 'next/link';
import { Button, Container, EmptyState } from '@maro/ui';
import { getLocale } from '../../../../lib/locale';
import { branchMessages } from '../../../../features/branches/messages';

export default async function UnknownBranch() {
  const t = branchMessages[await getLocale()];
  return (
    <main id="main-content" className="branches-page">
      <Container>
        <EmptyState
          title={t.unavailable}
          description={t.recovery}
          action={
            <Button asChild>
              <Link href="/branches">{t.all}</Link>
            </Button>
          }
        />
      </Container>
    </main>
  );
}
