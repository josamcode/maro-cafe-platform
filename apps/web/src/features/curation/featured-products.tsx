'use client';
import { Heading, Section, Stack, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { MenuProduct } from '../menu/product-details';
import { MenuLink } from '../menu/menu-link';
import { menuMessages } from '../menu/messages';
import { PicksPanel } from '../picks/picks-panel';
import { picksMessages } from '../picks/messages';
import { usePickActions } from '../picks/use-pick-actions';
import { getFeaturedProducts } from './catalog';
import { curationMessages } from './messages';
import './curation.css';

export function FeaturedProducts({ locale }: { locale: Locale }) {
  const { picks, add, announcement } = usePickActions(locale);
  const items = getFeaturedProducts();
  const t = curationMessages[locale];
  if (!items.length) return null;
  return (
    <Section id="discover">
      <Stack gap="lg">
        <div className="home-section-heading">
          <Stack gap="sm">
            <Text tone="eyebrow">{t.eyebrow}</Text>
            <Heading>{t.title}</Heading>
            <Text tone="muted">{t.intro}</Text>
          </Stack>
          <MenuLink locale={locale} label={menuMessages[locale].fullMenu} variant="outline" />
        </div>
        <div className="featured-products">
          {items.map(({ item, category }) => (
            <MenuProduct
              key={item.id}
              item={item}
              category={category}
              locale={locale}
              picksReady={picks.ready}
              onAdd={add}
              showCategory
              dismissLabel={picksMessages[locale].back}
            />
          ))}
        </div>
        <div className="featured-products-footer">
          <Text tone="muted" className="home-note">
            {menuMessages[locale].photoPreview} {menuMessages[locale].menuDescription}
          </Text>
          <PicksPanel picks={picks} locale={locale} />
        </div>
        {announcement}
      </Stack>
    </Section>
  );
}
