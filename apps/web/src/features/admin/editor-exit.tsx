'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Dialog, Stack } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { adminMessages } from './messages';
export function useEditorExit(dirty: boolean, locale: Locale, destination: string) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = adminMessages[locale];
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  return {
    leave: () => (dirty ? setOpen(true) : router.push(destination)),
    dialog: (
      <Dialog
        open={open}
        onOpenChange={setOpen}
        trigger={<span />}
        title={t.discardTitle}
        description={t.discardText}
        closeLabel={t.close}
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <Stack>
          <Button onClick={() => router.push(destination)}>{t.discard}</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.stay}
          </Button>
        </Stack>
      </Dialog>
    ),
  };
}
