'use client';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DirectionArrow,
  IconButton,
  Price,
  ProductCard,
  RadioGroup,
  Stack,
  Text,
} from '@maro/ui';
import type { Locale } from '../../lib/locale';
import type { MenuCategory, MenuItem, PriceLabel } from './catalog';
import { menuMessages } from './messages';
import { getMenuMedia } from './media';
import { MenuPhoto } from './menu-photo';

export function MenuProduct({
  item,
  category,
  locale,
  eager = false,
}: {
  item: MenuItem;
  category: Pick<MenuCategory, 'id' | 'name'>;
  locale: Locale;
  eager?: boolean;
}) {
  const t = menuMessages[locale];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(item.prices[0]!.label);
  const price = item.prices.find((option) => option.label === selected)!;
  const multiple = item.prices.length > 1;
  const media = getMenuMedia(category.id, item.id);
  return (
    <ProductCard
      compact
      image={<MenuPhoto media={media} locale={locale} eager={eager} />}
      name={item.name[locale]}
      locale={locale}
      description={
        multiple
          ? item.prices.map((option) => t[option.label as PriceLabel]).join(' / ')
          : undefined
      }
      price={Math.min(...item.prices.map((option) => option.amount))}
      pricePrefix={multiple ? t.from : undefined}
      action={
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={item.name[locale]}
          description={category.name[locale]}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          lang={locale}
          closeLabel={t.close}
          trigger={
            <IconButton round variant="outline" label={`${t.details} — ${item.name[locale]}`}>
              <DirectionArrow />
            </IconButton>
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
                onChange={setSelected}
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
            <Button onClick={() => setOpen(false)}>{t.done}</Button>
          </Stack>
        </Dialog>
      }
    />
  );
}
