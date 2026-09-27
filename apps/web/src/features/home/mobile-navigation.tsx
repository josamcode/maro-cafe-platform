'use client';
import { useState } from 'react';
import { Button, Dialog, DirectionArrow, IconButton, Stack } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { homeMessages } from './messages';

export function MobileNavigation({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = homeMessages[locale];
  return (
    <div className="home-mobile-navigation">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        lang={locale}
        title={t.nav}
        description={t.footer}
        closeLabel={t.close}
        trigger={
          <IconButton round variant="quiet" label={t.openNavigation}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 8h16M4 16h16" />
            </svg>
          </IconButton>
        }
      >
        <Stack gap="sm">
          {[
            { href: '#discover', label: t.menu },
            { href: '#branches', label: t.branches },
            { href: '#at-maro', label: t.story },
          ].map((link) => (
            <Button key={link.href} asChild variant="quiet" className="home-mobile-link">
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
                <DirectionArrow />
              </a>
            </Button>
          ))}
        </Stack>
      </Dialog>
    </div>
  );
}
