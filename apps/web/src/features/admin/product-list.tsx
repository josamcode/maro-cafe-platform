'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { Button, Field, Input, Select, Heading, Price, Text } from '@maro/ui';
import type { CatalogData } from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { normalizeSearch } from '../menu/catalog';
import { MenuPhoto } from '../menu/menu-photo';
import { adminMessages } from './messages';

export function ProductList({ data, locale }: { data: CatalogData; locale: Locale }) {
  const t = adminMessages[locale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const items = data.products.filter(
    (p) =>
      (category === 'all' || p.categoryId === category) &&
      normalizeSearch(`${p.name.ar} ${p.name.en}`).includes(normalizeSearch(query)),
  );
  return (
    <>
      <div className="admin-title">
        <div>
          <Heading as="h1" size="section">
            {t.title}
          </Heading>
          <Text tone="muted">{t.intro}</Text>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus size={18} />
            {t.newProduct}
          </Link>
        </Button>
      </div>
      <div className="admin-filters">
        <Field label={t.search}>
          {(props) => (
            <Input
              {...props}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
        </Field>
        <Field label={t.category}>
          {(props) => (
            <Select
              {...props}
              placeholder={t.all}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              value={category}
              onValueChange={setCategory}
              options={[
                { value: 'all', label: t.all },
                ...data.categories.map((c) => ({ value: c.id, label: c.name[locale] })),
              ]}
            />
          )}
        </Field>
      </div>
      <Text tone="muted" role="status">
        {new Intl.NumberFormat(locale).format(items.length)} {t.count}
      </Text>
      <div className="admin-products">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}`}
            className="admin-product-row"
            aria-label={`${t.edit} — ${p.name[locale]}`}
          >
            <MenuPhoto media={p.media} locale={locale} variant="category" />
            <div>
              <Heading as="h2" size="title">
                {p.name[locale]}
              </Heading>
              <Text tone="muted">{p.active && p.branchSlugs.length ? t.visible : t.hidden}</Text>
            </div>
            <Price amount={Math.min(...p.prices.map((price) => price.amount))} locale={locale} />
            <Pencil size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
      {!items.length && <Text>{t.empty}</Text>}
    </>
  );
}
