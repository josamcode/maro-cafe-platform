'use client';
import { useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button, Dialog, Price, ProductCard, RadioGroup, Stack, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import type { MenuCategory, MenuItem, PriceLabel } from './catalog';
import { menuMessages } from './messages';
import { getMenuMedia } from './media';
import { MenuPhoto } from './menu-photo';
import { picksMessages } from '../picks/messages';

export function MenuProduct({
  item,
  category,
  locale,
  eager = false,
  onAdd,
  picksReady,
}: {
  item: MenuItem;
  category: Pick<MenuCategory, 'id' | 'name'>;
  locale: Locale;
  eager?: boolean;
  onAdd: (itemId: string, variant: string) => boolean;
  picksReady: boolean;
}) {
  const t = menuMessages[locale];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(item.prices[0]!.label);
  const [limitReached, setLimitReached] = useState(false);
  const [added, setAdded] = useState<{ variant: string; revision: number } | null>(null);
  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [added]);
  const p = picksMessages[locale];
  const price = item.prices.find((option) => option.label === selected)!;
  const multiple = item.prices.length > 1;
  const media = getMenuMedia(category.id, item.id);
  return (
    <ProductCard
      compact
      image={<MenuPhoto media={media} locale={locale} eager={eager} />}
      name={item.name[locale]}
      locale={locale}
      price={Math.min(...item.prices.map((option) => option.amount))}
      pricePrefix={multiple ? t.from : undefined}
      action={
        <>
          {item.prices.map((option) => (
            <Button
              key={option.label}
              variant="outline"
              size="sm"
              className="menu-quick-add"
              disabled={!picksReady}
              aria-label={`${p.add} — ${item.name[locale]}${multiple ? ` · ${t[option.label as PriceLabel]}` : ''}`}
              onClick={() => {
                const success = onAdd(item.id, option.label);
                setLimitReached(!success);
                if (success)
                  setAdded((previous) => ({
                    variant: option.label,
                    revision: (previous?.revision ?? 0) + 1,
                  }));
              }}
            >
              {added?.variant === option.label ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Plus size={18} aria-hidden="true" />
              )}
              {multiple && t[option.label as PriceLabel]}
            </Button>
          ))}
          {limitReached && !open && (
            <Text role="status" className="menu-quick-add-note">
              {p.limit}
            </Text>
          )}
        </>
      }
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
              {t.done}
            </Button>
          </Stack>
        </Dialog>
      }
    />
  );
}
