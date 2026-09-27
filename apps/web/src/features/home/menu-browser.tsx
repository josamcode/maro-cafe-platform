'use client';
import { useState } from 'react';
import {
  Button,
  IconButton,
  DirectionArrow,
  Dialog,
  EmptyState,
  Field,
  FilterChip,
  Heading,
  Inline,
  Input,
  Price,
  Stack,
  Text,
} from '@maro/ui';
import menu from '../../content/menu.snapshot.json';
import { homeMessages } from './messages';
import type { Locale } from '../../lib/locale';
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .trim();
export function MenuBrowser({
  locale,
  initialCategory = 'all',
  label,
  variant = 'default',
  compact = false,
}: {
  locale: Locale;
  initialCategory?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'quiet';
  compact?: boolean;
}) {
  const t = homeMessages[locale];
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');
  const categories = menu.categories
    .map((c) => ({
      ...c,
      items: c.items.filter(
        (i) =>
          (category === 'all' || category === c.id) &&
          normalize(i.name.ar + ' ' + i.name.en).includes(normalize(query)),
      ),
    }))
    .filter((c) => c.items.length);
  const count = categories.reduce((n, c) => n + c.items.length, 0);
  return (
    <Dialog
      wide
      trigger={
        compact ? (
          <IconButton round variant={variant} label={label ?? t.explore}>
            <DirectionArrow />
          </IconButton>
        ) : (
          <Button variant={variant}>{label ?? t.explore}</Button>
        )
      }
      title={t.menuTitle}
      description={t.menuDescription}
      closeLabel={t.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <Stack>
        <Field label={t.search}>
          {(props) => (
            <Input
              {...props}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          )}
        </Field>
        <Inline role="group" aria-label={t.categories}>
          <FilterChip selected={category === 'all'} onClick={() => setCategory('all')}>
            {t.all}
          </FilterChip>
          {menu.categories.map((c) => (
            <FilterChip selected={category === c.id} onClick={() => setCategory(c.id)} key={c.id}>
              {c.name[locale]}
            </FilterChip>
          ))}
        </Inline>
        <Text tone="muted" role="status">
          {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG').format(count)} {t.results}
        </Text>
        {count === 0 ? (
          <EmptyState title={t.empty} description={t.emptyDescription} />
        ) : (
          categories.map((c) => (
            <Stack gap="sm" key={c.id}>
              <Heading as="h3" size="title">
                {c.name[locale]}
              </Heading>
              <ul className="home-menu-list">
                {c.items.map((i) => (
                  <li key={i.id}>
                    <span>{i.name[locale]}</span>
                    <div className="home-menu-prices">
                      {i.prices.map((p) => (
                        <span key={p.label}>
                          <small>
                            {t[p.label as 'small' | 'large' | 'single' | 'double' | 'standard']}
                          </small>
                          <Price amount={p.amount} locale={locale} />
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Stack>
          ))
        )}
      </Stack>
    </Dialog>
  );
}
