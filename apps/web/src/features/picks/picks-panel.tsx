'use client';
import { useRef, useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import {
  Button,
  Dialog,
  EmptyState,
  Heading,
  IconButton,
  Price,
  QuantityControl,
  Stack,
  Text,
} from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { menuMessages } from '../menu/messages';
import type { PriceLabel } from '../menu/catalog';
import { getMenuMedia } from '../menu/media';
import { MenuPhoto } from '../menu/menu-photo';
import { MAX_PICK_QUANTITY, pickKey } from './model';
import { picksMessages } from './messages';
import type { PicksState } from './use-picks';
import './picks.css';

export function PicksPanel({ picks, locale }: { picks: PicksState; locale: Locale }) {
  const t = picksMessages[locale];
  const [open, setOpen] = useState(false);
  const [cashier, setCashier] = useState(false);
  const back = useRef<HTMLButtonElement>(null);
  const number = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG');
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setCashier(false);
      }}
      title={cashier ? t.cashierTitle : t.title}
      description={t.description}
      closeLabel={t.close}
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      trigger={
        <Button
          className="picks-launcher"
          data-filled={picks.count > 0}
          variant={picks.count ? 'default' : 'quiet'}
          disabled={!picks.ready}
          aria-label={t.title}
        >
          <Bookmark size={20} aria-hidden="true" />
          <span>
            {t.title}
            {picks.count > 0 && (
              <small>
                {number.format(picks.count)} {t.count}
              </small>
            )}
          </span>
          {picks.count > 0 && <Price amount={picks.total} locale={locale} />}
        </Button>
      }
    >
      <Stack className="picks-content" data-cashier={cashier}>
        {!picks.persistent && (
          <Text role="status" className="picks-note">
            {t.storageNotice}
          </Text>
        )}
        {picks.lines.length === 0 ? (
          <EmptyState title={t.empty} description={t.emptyDescription} />
        ) : (
          <>
            <ul className="picks-list">
              {picks.lines.map((line) => {
                const key = pickKey(line);
                const variant =
                  line.variant === 'standard'
                    ? null
                    : menuMessages[locale][line.variant as PriceLabel];
                const label = `${line.item.name[locale]}${variant ? ` · ${variant}` : ''}`;
                return (
                  <li className="picks-item" key={key}>
                    <div className="picks-item-heading">
                      {!cashier && (
                        <MenuPhoto
                          media={getMenuMedia(line.category.id, line.itemId)}
                          locale={locale}
                          variant="category"
                        />
                      )}
                      <Stack gap="sm">
                        <Heading as="h3" size="title">
                          {line.item.name[locale]}
                        </Heading>
                        {variant && <Text tone="muted">{variant}</Text>}
                        <Text tone="muted" className="picks-unit">
                          {t.unit} <Price amount={line.unitPrice} locale={locale} />
                        </Text>
                      </Stack>
                      {!cashier && (
                        <IconButton
                          label={`${t.remove} — ${label}`}
                          variant="quiet"
                          onClick={() => {
                            picks.remove(key);
                            requestAnimationFrame(() => back.current?.focus());
                          }}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </IconButton>
                      )}
                    </div>
                    <div className="picks-line-summary">
                      {cashier ? (
                        <Text>
                          {t.quantity}: {number.format(line.quantity)}
                        </Text>
                      ) : (
                        <QuantityControl
                          value={line.quantity}
                          onChange={(value) => picks.setQuantity(key, value)}
                          locale={locale}
                          max={MAX_PICK_QUANTITY}
                          label={`${t.quantity} — ${label}`}
                          increaseLabel={`${t.increase} — ${label}`}
                          decreaseLabel={`${t.decrease} — ${label}`}
                        />
                      )}
                      <Price amount={line.total} locale={locale} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="picks-total" role="status">
              <Text>{t.total}</Text>
              <Price amount={picks.total} locale={locale} />
            </div>
            <Text tone="muted" className="picks-note">
              {t.priceNote}
            </Text>
            <Button onClick={() => setCashier(!cashier)}>{cashier ? t.edit : t.cashier}</Button>
          </>
        )}
        <Button
          ref={back}
          variant="outline"
          onClick={() => {
            setOpen(false);
            setCashier(false);
          }}
        >
          {t.back}
        </Button>
      </Stack>
    </Dialog>
  );
}
