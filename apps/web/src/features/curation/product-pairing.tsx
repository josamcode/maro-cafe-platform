'use client';
import { useId } from 'react';
import { Heading, Stack, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { QuickAdd, type AddPick } from '../menu/quick-add';
import { getPairings } from './catalog';
import { curationMessages } from './messages';
import { useCatalog } from '../catalog/catalog-provider';

export function ProductPairing({
  itemId,
  locale,
  ready,
  onAdd,
}: {
  itemId: string;
  locale: Locale;
  ready: boolean;
  onAdd: AddPick;
}) {
  const id = useId();
  const { catalog } = useCatalog();
  const pairings = getPairings(catalog, itemId);
  if (!pairings.length) return null;
  const t = curationMessages[locale];
  return (
    <section className="product-pairing" aria-labelledby={id}>
      <Stack gap="sm">
        <Heading as="h3" size="title" id={id}>
          {t.pairingTitle}
        </Heading>
        <Text tone="muted">{t.pairingIntro}</Text>
        {pairings.map(({ item }) => (
          <div className="product-pairing-row" key={item.id}>
            <Text>{item.name[locale]}</Text>
            <div className="product-pairing-actions">
              <QuickAdd item={item} locale={locale} ready={ready} onAdd={onAdd} showPrices />
            </div>
          </div>
        ))}
      </Stack>
    </section>
  );
}
