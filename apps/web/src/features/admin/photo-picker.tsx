'use client';
import { useRef, useState, useTransition } from 'react';
import { Button, Dialog, Stack, Text } from '@maro/ui';
import type { CatalogData, CatalogMedia } from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { MenuPhoto } from '../menu/menu-photo';
import { uploadImage } from './actions';
import { adminMessages } from './messages';

export function PhotoPicker({
  data,
  value,
  locale,
  onChange,
}: {
  data: CatalogData;
  value: CatalogMedia;
  locale: Locale;
  onChange: (media: CatalogMedia) => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [busy, start] = useTransition();
  const input = useRef<HTMLInputElement>(null);
  const t = adminMessages[locale];
  const library = [
    ...new Map(
      [...data.categories.map((c) => c.media), ...data.products.map((p) => p.media)].map(
        (media) => [media.src, media],
      ),
    ).values(),
  ];
  return (
    <div className="admin-photo-field">
      <MenuPhoto media={value} locale={locale} variant="category" />
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!busy) setOpen(next);
        }}
        title={t.photo}
        description={t.photoHint}
        closeLabel={t.close}
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        trigger={<Button variant="outline">{t.changePhoto}</Button>}
      >
        <Stack>
          <Button disabled={busy} onClick={() => input.current?.click()}>
            {busy ? t.saving : t.upload}
          </Button>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const form = new FormData();
              form.set('image', file);
              start(async () => {
                setError(false);
                const result = await uploadImage(form);
                if (result.error || !result.src) setError(true);
                else {
                  onChange({
                    ...value,
                    src: result.src,
                    status: 'reference',
                    source: 'Staff upload',
                  });
                  setOpen(false);
                }
              });
              e.target.value = '';
            }}
          />
          {error && <Text role="alert">{t.uploadError}</Text>}
          <div className="admin-image-library">
            {library.map((media) => (
              <Button
                key={media.src}
                variant="quiet"
                disabled={busy}
                className="admin-image-option"
                aria-label={media.alt[locale]}
                aria-pressed={media.src === value.src}
                onClick={() => {
                  onChange({ ...media, status: 'reference' });
                  setOpen(false);
                }}
              >
                <MenuPhoto media={media} locale={locale} variant="category" />
              </Button>
            ))}
          </div>
        </Stack>
      </Dialog>
    </div>
  );
}
