import Link from 'next/link';
import { Button, Container, EmptyState } from '@maro/ui';
import { getLocale } from '../../../../lib/locale';
import { insideMessages } from '../../../../features/inside/messages';

export default async function UnknownBranch() {
  const t = insideMessages[await getLocale()];
  return (
    <main>
      <Container>
        <EmptyState
          title={t.unavailable}
          description={t.chooseBranch}
          action={
            <Button asChild>
              <Link href="/menu">{t.menu}</Link>
            </Button>
          }
        />
      </Container>
    </main>
  );
}
