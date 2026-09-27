import Link from 'next/link';
import { Button, Heading, Stack, Text } from '@maro/ui';
import { getLocale } from '../../../../lib/locale';
import { getStaffOffers } from '../../../../features/offers/server';
import { offerMessages } from '../../../../features/offers/messages';
export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [offers, locale, params] = await Promise.all([getStaffOffers(), getLocale(), searchParams]);
  const t = offerMessages[locale];
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return (
    <>
      <div className="admin-title">
        <Stack gap="sm">
          <Heading as="h1" size="section">
            {t.title}
          </Heading>
          <Text tone="muted">{t.intro}</Text>
        </Stack>
        <Button asChild>
          <Link href="/admin/offers/new">{t.new}</Link>
        </Button>
      </div>
      {params.saved && (
        <Text role="status" className="admin-feedback">
          {t.saved}
        </Text>
      )}
      {!offers.length && <Text>{t.empty}</Text>}
      {offers.map((offer) => (
        <Link className="admin-offer-row" key={offer.id} href={`/admin/offers/${offer.id}`}>
          <div>
            <Heading as="h2" size="title">
              {offer.title[locale]}
            </Heading>
            <Text tone="muted">
              {!offer.published
                ? t.draft
                : offer.endsOn < today
                  ? t.expired
                  : offer.startsOn > today
                    ? t.scheduled
                    : t.active}{' '}
              · {t[offer.context]}
            </Text>
          </div>
          <Text>
            <bdi>
              {offer.startsOn} — {offer.endsOn}
            </bdi>
          </Text>
        </Link>
      ))}
    </>
  );
}
