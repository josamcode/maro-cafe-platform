'use client';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, MapPin } from 'lucide-react';
import {
  Button,
  Disclosure,
  EmptyState,
  Field,
  FilterChip,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
} from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import { InsideHeader } from '../inside/inside-header';
import { BranchSelector } from '../inside/branch-selector';
import { AtMaroPrompt } from '../branches/at-maro-prompt';
import { catalog, filterCatalog, getMenuBranch } from './catalog';
import { menuMessages } from './messages';
import { MenuProduct } from './product-details';
import { getMenuMedia } from './media';
import { MenuPhoto } from './menu-photo';
import { usePickActions } from '../picks/use-pick-actions';
import { PicksPanel } from '../picks/picks-panel';

export function MenuExperience({
  locale,
  inside,
}: {
  locale: Locale;
  inside?: { branchSlug: string; theme: Theme };
}) {
  const t = menuMessages[locale];
  const { picks, add, announcement } = usePickActions(locale);
  const params = useSearchParams();
  const requestedCategory = params.get('category');
  const category = catalog.some((group) => group.id === requestedCategory)
    ? requestedCategory!
    : 'all';
  const query = params.get('q') ?? '';
  const branch = getMenuBranch(params.get('branch'));
  const groups = filterCatalog(category, query);
  const count = groups.reduce((total, group) => total + group.items.length, 0);
  const number = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG');
  const categoryList = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const list = categoryList.current;
    const selected = list?.querySelector('[aria-pressed="true"]');
    if (!list || !selected) return;
    const bounds = list.getBoundingClientRect();
    const target = selected.getBoundingClientRect();
    list.scrollBy({ left: target.left + target.width / 2 - bounds.left - bounds.width / 2 });
  }, [category, locale]);

  function update(values: Record<string, string>, push = false) {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value && value !== 'all') next.set(key, value);
      else next.delete(key);
    }
    const url = `${window.location.pathname}${next.size ? `?${next}` : ''}`;
    if (push) window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }

  return (
    <>
      {inside && (
        <InsideHeader
          locale={locale}
          theme={inside.theme}
          picks={picks}
          onSearch={() => {
            searchInput.current?.focus();
            searchInput.current?.scrollIntoView({ block: 'center' });
          }}
        />
      )}
      <div className="menu-intro" id={inside ? 'inside-menu' : undefined}>
        <Stack gap="sm">
          {!inside && <Text tone="eyebrow">{t.menuTitle}</Text>}
          <Heading as="h1" size="section">
            {t.title}
          </Heading>
          {!inside && <Text tone="muted">{t.intro}</Text>}
        </Stack>
        {inside && <BranchSelector branchSlug={inside.branchSlug} locale={locale} />}
        {!inside && branch && (
          <Text className="menu-branch-context">
            <MapPin size={18} aria-hidden="true" />
            {t.inside} · {branch[locale]}
          </Text>
        )}
      </div>
      {!inside && <AtMaroPrompt locale={locale} branchSlug={params.get('branch') ?? undefined} />}
      <div className="menu-tools">
        <Field label={t.search}>
          {(props) => (
            <div className="menu-search">
              <Search size={20} aria-hidden="true" />
              <Input
                {...props}
                ref={searchInput}
                type="search"
                value={query}
                placeholder={t.searchPlaceholder}
                maxLength={120}
                onChange={(event) => update({ q: event.target.value })}
              />
              {query && (
                <IconButton
                  label={t.clear}
                  variant="quiet"
                  onClick={() => {
                    update({ q: '' });
                    document.getElementById(props.id)?.focus();
                  }}
                >
                  <X size={18} aria-hidden="true" />
                </IconButton>
              )}
            </div>
          )}
        </Field>
        <div ref={categoryList} className="menu-categories" role="group" aria-label={t.categories}>
          {[
            { id: 'all', name: { ar: menuMessages.ar.all, en: menuMessages.en.all } },
            ...catalog,
          ].map((group) => (
            <FilterChip
              key={group.id}
              selected={category === group.id}
              onClick={() => {
                update({ category: group.id }, true);
              }}
            >
              {group.name[locale]}
            </FilterChip>
          ))}
        </div>
      </div>
      <div className="menu-result-summary">
        <Text tone="muted" role="status">
          {number.format(count)} {t.results}
        </Text>
        <div className="menu-result-actions">
          {(query || category !== 'all') && (
            <Button
              variant="quiet"
              size="sm"
              onClick={() => update({ q: '', category: 'all' }, true)}
            >
              {t.reset}
            </Button>
          )}
          {!inside && <PicksPanel picks={picks} locale={locale} />}
        </div>
      </div>
      {announcement}
      <div className="menu-results">
        {count > 0 && (
          <Text tone="muted" className="menu-photo-note">
            {t.photoPreview}
          </Text>
        )}
        {count === 0 ? (
          <EmptyState
            title={t.empty}
            description={t.emptyDescription}
            action={
              <Button variant="outline" onClick={() => update({ q: '', category: 'all' }, true)}>
                {t.reset}
              </Button>
            }
          />
        ) : (
          groups.map((group, groupIndex) => (
            <Disclosure
              key={`${group.id}:${category}:${query}`}
              mobileOnly
              title={group.name[locale]}
              meta={`${number.format(group.items.length)} ${t.results}`}
              className="menu-group"
              defaultExpanded={Boolean(query.trim()) || category !== 'all'}
              media={
                <MenuPhoto media={getMenuMedia(group.id)} locale={locale} variant="category" />
              }
            >
              <div className="menu-product-grid">
                {group.items.map((item, itemIndex) => (
                  <MenuProduct
                    key={item.id}
                    item={item}
                    category={group}
                    locale={locale}
                    eager={groupIndex === 0 && itemIndex === 0}
                    picksReady={picks.ready}
                    onAdd={add}
                  />
                ))}
              </div>
            </Disclosure>
          ))
        )}
      </div>
      <Text tone="muted" className="menu-source-note">
        {t.menuDescription}
      </Text>
    </>
  );
}
