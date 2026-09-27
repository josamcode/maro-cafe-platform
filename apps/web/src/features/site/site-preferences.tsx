import { Button, Inline } from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import { changeLocale } from '../home/actions';
import { homeMessages } from '../home/messages';
import { ThemeControl } from '../home/theme-control';

export function SitePreferences({ locale, theme }: { locale: Locale; theme: Theme }) {
  const t = homeMessages[locale];
  return (
    <Inline className="home-preferences">
      <ThemeControl locale={locale} theme={theme} />
      <form action={changeLocale} className="home-language">
        <input type="hidden" name="locale" value={locale === 'ar' ? 'en' : 'ar'} />
        <Button type="submit" variant="quiet" size="sm" aria-label={t.switchLabel}>
          <span className="home-language-full" lang={locale === 'ar' ? 'en' : 'ar'}>
            {t.language}
          </span>
          <span className="home-language-short" lang={locale === 'ar' ? 'en' : 'ar'}>
            {t.shortLanguage}
          </span>
        </Button>
      </form>
    </Inline>
  );
}
