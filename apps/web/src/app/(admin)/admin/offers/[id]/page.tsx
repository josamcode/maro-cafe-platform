import { notFound } from 'next/navigation';
import { getStaffOffers } from '../../../../../features/offers/server';
import { getAdminCatalog } from '../../../../../features/admin/server';
import { OfferForm } from '../../../../../features/offers/offer-form';
import { getLocale } from '../../../../../lib/locale';
export default async function EditOffer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offers = await getStaffOffers();
  const [data, locale] = await Promise.all([getAdminCatalog(), getLocale()]);
  const offer = offers.find((value) => value.id === id);
  if (id !== 'new' && !offer) notFound();
  return <OfferForm offer={offer} branches={data.branches} locale={locale} />;
}
