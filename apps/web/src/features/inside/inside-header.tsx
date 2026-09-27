'use client';
import { Search } from 'lucide-react';
import { IconButton } from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import { SitePreferences } from '../site/site-preferences';
import { PicksPanel } from '../picks/picks-panel';
import type { PicksState } from '../picks/use-picks';
import { insideMessages } from './messages';

export function InsideHeader({
  locale,
  theme,
  picks,
  onSearch,
}: {
  locale: Locale;
  theme: Theme;
  picks: PicksState;
  onSearch: () => void;
}) {
  const t = insideMessages[locale];
  return (
    <header className="inside-header">
      <a className="home-skip maro-button maro-button-primary" href="#inside-menu">
        {t.skip}
      </a>
      <nav className="inside-nav" aria-label={t.menu}>
        <a
          className="home-wordmark inside-wordmark"
          href="#inside-menu"
          aria-label={t.menu}
          lang="en"
          dir="ltr"
        >
          MARO
        </a>
        <div className="inside-actions">
          <IconButton label={t.search} variant="quiet" onClick={onSearch}>
            <Search size={20} aria-hidden="true" />
          </IconButton>
          <PicksPanel picks={picks} locale={locale} compact />
          <SitePreferences locale={locale} theme={theme} />
        </div>
      </nav>
    </header>
  );
}
