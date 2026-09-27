'use client';
import { useState } from 'react';
import { Button, Dialog, Price, ProductCard, RadioGroup, Stack, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import type { MenuCategory, MenuItem, PriceLabel } from './catalog';
import { menuMessages } from './messages';
import { getMenuMedia } from './media';
import { MenuPhoto } from './menu-photo';
import { picksMessages } from '../picks/messages';
import { QuickAdd, type AddPick } from './quick-add';
import { ProductPairing } from '../curation/product-pairing';
import './menu.css';

export function MenuProduct({
  item,
  category,
  locale,
  eager = false,
  onAdd,
  picksReady,
  showCategory = false,
  dismissLabel,
}: {
  item: MenuItem;
  category: Pick<MenuCategory, 'id' | 'name'>;
  locale: Locale;
  eager?: boolean;
  onAdd: AddPick;
  showCategory?: boolean;
  dismissLabel?: string;
  picksReady: boolean;
}) {
  const t = menuMessages[locale];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(item.prices[0]!.label);
  const [limitReached, setLimitReached] = useState(false);
  const p = picksMessages[locale];
  const price = item.prices.find((option) => option.label === selected)!;
  const multiple = item.prices.length > 1;
  const media = getMenuMedia(category.id, item.id);
  return (
    <ProductCard
      compact
      image={<MenuPhoto media={media} locale={locale} eager={eager} />}
      name={item.name[locale]}
      description={showCategory ? category.name[locale] : undefined}
      locale={locale}
      price={Math.min(...item.prices.map((option) => option.amount))}
      pricePrefix={multiple ? t.from : undefined}
      action={<QuickAdd item={item} locale={locale} ready={picksReady} onAdd={onAdd} />}
      details={
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={item.name[locale]}
          description={category.name[locale]}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          lang={locale}
          closeLabel={t.close}
          trigger={
            <Button
              className="maro-product-details-trigger"
              variant="quiet"
              aria-label={`${t.details} — ${item.name[locale]}`}
            />
          }
        >
          <Stack className="menu-product-details">
            <figure className="menu-detail-photo">
              <MenuPhoto media={media} locale={locale} variant="detail" />
              {media.status === 'reference' && <figcaption>{t.photoReference}</figcaption>}
            </figure>
            {multiple && (
              <RadioGroup
                label={t.chooseSize}
                name={`size-${item.id}`}
                value={selected}
                onChange={(value) => {
                  setSelected(value);
                  setLimitReached(false);
                }}
                options={item.prices.map((option) => ({
                  value: option.label,
                  label: (
                    <>
                      {t[option.label as PriceLabel]} ·{' '}
                      <Price amount={option.amount} locale={locale} />
                    </>
                  ),
                }))}
              />
            )}
            <div className="menu-selection" role="status" aria-live="polite">
              <Text tone="muted">
                {multiple ? `${t.selectedPrice} · ${t[price.label as PriceLabel]}` : t.standardSize}
              </Text>
              <Price amount={price.amount} locale={locale} />
            </div>
            <Text tone="muted" className="home-note">
              {t.menuDescription}
            </Text>
            {limitReached && (
              <Text role="status" className="home-note">
                {p.limit}
              </Text>
            )}
            <ProductPairing itemId={item.id} locale={locale} ready={picksReady} onAdd={onAdd} />
            <Button
              disabled={!picksReady}
              onClick={() => {
                if (onAdd(item.id, selected)) {
                  setLimitReached(false);
                  setOpen(false);
                } else setLimitReached(true);
              }}
            >
              {p.add}
            </Button>
            <Button variant="quiet" onClick={() => setOpen(false)}>
              {dismissLabel ?? t.done}
            </Button>
          </Stack>
        </Dialog>
      }
    />
  );
}
