'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button, Heading, Stack, Text } from '@maro/ui';
import { offersSchema, type Offer } from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { useCatalog } from '../catalog/catalog-provider';
import { trackIntent } from '../insights/track';
import { offerMessages } from './messages';
import './offers.css';
function OfferCard({ offer, locale, inside }: { offer: Offer; locale: Locale; inside: boolean }) {
  const t = offerMessages[locale];
  const { data } = useCatalog();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          trackIntent({ kind: 'offer_view', offerId: offer.id });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [offer.id]);
  const date = (value: string) =>
    new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
      dateStyle: 'medium',
      timeZone: 'Africa/Cairo',
    }).format(new Date(`${value}T12:00:00Z`));
  return (
    <article className="offer-row" ref={ref}>
      <Stack gap="sm">
        <Text tone="eyebrow">{t.current}</Text>
        <Heading as="h2" size="title">
          {offer.title[locale]}
        </Heading>
        <Text className="offer-terms">{offer.terms[locale]}</Text>
        <Text tone="muted">
          {t.valid} {date(offer.startsOn)} {t.until} {date(offer.endsOn)}
        </Text>
        <Text tone="muted">
          {t.at}{' '}
          {data.branches
            .filter((b) => offer.branchSlugs.includes(b.slug))
            .map((b) => b.name[locale])
            .join(locale === 'ar' ? '، ' : ', ')}
        </Text>
      </Stack>
      <div>
        <Button asChild variant="outline">
          <Link
            href={
              inside
                ? '#menu-browse'
                : offer.branchSlugs.length === 1
                  ? `/branches/${offer.branchSlugs[0]}`
                  : '/branches'
            }
            onClick={() => trackIntent({ kind: 'offer_click', offerId: offer.id })}
          >
            {inside ? t.menu : t.locations}
          </Link>
        </Button>
      </div>
    </article>
  );
}
export function OfferStrip({ locale }: { locale: Locale }) {
  const { branch } = useCatalog();
  const path = usePathname();
  const inside = path.startsWith('/in/');
  const [result, setResult] = useState<{ key: string; offers: Offer[] } | null>(null);
  const key = `${inside ? 'inside' : 'outside'}:${branch?.slug ?? ''}`;
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      if (document.hidden) return;
      const params = new URLSearchParams({ context: inside ? 'inside' : 'outside' });
      if (branch) params.set('branch', branch.slug);
      try {
        const response = await fetch(`/api/offers?${params}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Unavailable');
        setResult({ key, offers: offersSchema.parse(await response.json()) });
      } catch {
        if (!controller.signal.aborted) setResult({ key, offers: [] });
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
    };
  }, [key, inside, branch]);
  const offers = result?.key === key ? result.offers : [];
  if (!offers.length) return null;
  return (
    <section className="offers-section" aria-label={offerMessages[locale].title}>
      {offers.map((offer) => (
        <OfferCard key={`${key}:${offer.id}`} offer={offer} locale={locale} inside={inside} />
      ))}
      <Text tone="muted" className="offer-note">
        {offerMessages[locale].note}
      </Text>
    </section>
  );
}
