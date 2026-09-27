'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Dialog, DirectionArrow, Stack } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { branches, getBranch } from './data';
import { branchMessages } from './messages';
import './branches.css';

export function AtMaroPrompt({ locale, branchSlug }: { locale: Locale; branchSlug?: string }) {
  const t = branchMessages[locale];
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const next = new URLSearchParams();
  for (const key of ['q', 'category']) {
    const value = params.get(key);
    if (value) next.set(key, value);
  }
  const href = (slug: string) => `/in/${slug}${next.size ? `?${next}` : ''}`;
  const branch = getBranch(branchSlug ?? null);
  if (branch)
    return (
      <Button asChild variant="quiet" size="sm" className="at-maro-prompt">
        <Link href={href(branch.slug)}>
          {t.atMaro} {t.inside}
        </Link>
      </Button>
    );
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={t.chooseInside}
      description={t.insideHint}
      closeLabel={t.close}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      trigger={
        <Button variant="quiet" size="sm" className="at-maro-prompt">
          {t.atMaro}
        </Button>
      }
    >
      <Stack gap="sm">
        {branches.map((item) => (
          <Button key={item.slug} asChild variant="outline">
            <Link href={href(item.slug)} onClick={() => setOpen(false)}>
              {item.name[locale]}
              <DirectionArrow />
            </Link>
          </Button>
        ))}
      </Stack>
    </Dialog>
  );
}
