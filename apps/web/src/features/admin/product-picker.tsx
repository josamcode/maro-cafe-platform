'use client';
import { useState } from 'react';
import { Button, Field, Input, Text } from '@maro/ui';
import type { CatalogProduct } from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { normalizeSearch } from '../menu/catalog';
import { adminMessages } from './messages';

export function ProductPicker({
  products,
  value,
  onChange,
  locale,
}: {
  products: CatalogProduct[];
  value: string | undefined;
  onChange: (value: string[]) => void;
  locale: Locale;
}) {
  const [query, setQuery] = useState('');
  const t = adminMessages[locale];
  const current = products.find((p) => p.id === value);
  const matches = query.trim()
    ? products
        .filter((p) =>
          normalizeSearch(`${p.name.ar} ${p.name.en}`).includes(normalizeSearch(query)),
        )
        .slice(0, 8)
    : [];
  return (
    <div className="admin-product-picker">
      <Field label={t.pairing} hint={t.pairingHint}>
        {(props) => (
          <Input
            {...props}
            value={query}
            type="search"
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
      </Field>
      {current ? (
        <div className="admin-inline">
          <Text>{current.name[locale]}</Text>
          <Button variant="quiet" size="sm" onClick={() => onChange([])}>
            {t.clear}
          </Button>
        </div>
      ) : (
        <Text tone="muted">{t.noPair}</Text>
      )}
      <div className="admin-picker-results">
        {matches.map((p) => (
          <Button
            variant="outline"
            key={p.id}
            onClick={() => {
              onChange([p.id]);
              setQuery('');
            }}
          >
            {p.name[locale]}
          </Button>
        ))}
        {query && !matches.length && <Text role="status">{t.empty}</Text>}
      </div>
    </div>
  );
}
