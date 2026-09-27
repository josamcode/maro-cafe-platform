'use client';
import { useEffect, useId, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Button, Price, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import type { MenuItem, PriceLabel } from './catalog';
import { menuMessages } from './messages';
import { picksMessages } from '../picks/messages';

export type AddPick = (itemId: string, variant: string) => boolean;

export function QuickAdd({
  item,
  locale,
  ready,
  onAdd,
  showPrices = false,
}: {
  item: MenuItem;
  locale: Locale;
  ready: boolean;
  onAdd: AddPick;
  showPrices?: boolean;
}) {
  const priceId = useId();
  const [added, setAdded] = useState<{ variant: string; revision: number } | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const t = menuMessages[locale];
  const p = picksMessages[locale];
  const multiple = item.prices.length > 1;
  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [added]);
  return (
    <>
      {item.prices.map((option) => (
        <Button
          key={option.label}
          variant="outline"
          size="sm"
          className="menu-quick-add"
          disabled={!ready}
          aria-describedby={showPrices ? `${priceId}-${option.label}` : undefined}
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
          {showPrices && (
            <span id={`${priceId}-${option.label}`}>
              <Price amount={option.amount} locale={locale} />
            </span>
          )}
        </Button>
      ))}
      {limitReached && (
        <Text role="status" className="menu-quick-add-note">
          {p.limit}
        </Text>
      )}
      {showPrices && (
        <span className="picks-announcement" role="status">
          {added && `${p.added} — ${item.name[locale]}`}
        </span>
      )}
    </>
  );
}
