import { notFound } from 'next/navigation';
import { ApiError } from '@maro/api-client';
import { getApiClient } from '@/lib/api';
export const dynamic = 'force-dynamic';

export default async function InsideMenuPage({
  params,
}: {
  params: Promise<{ branchSlug: string }>;
}) {
  const { branchSlug } = await params;
  let menu;
  try {
    menu = await getApiClient().getMenu(branchSlug);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl">Menu temporarily unavailable</h1>
        <p role="status" className="mt-6 text-stone-600">
          Please try again or ask a member of our team for a menu.
        </p>
      </main>
    );
  }
  const money = new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' });
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="mb-3 text-stone-600">{menu.branch.name}</p>
      <h1 className="mb-8 text-4xl">Explore the menu</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {menu.items.map((item) => (
          <article key={item.variantId} className="rounded-2xl border border-stone-200 p-6">
            <p className="text-xs uppercase tracking-widest text-stone-500">{item.category}</p>
            <h2 className="mt-2 text-xl font-medium">{item.name}</h2>
            <p className="mt-3 text-sm text-stone-600">{item.description}</p>
            <div className="mt-6 flex justify-between gap-4">
              <span>{item.variant}</span>
              <span className="font-medium">{money.format(item.priceMinor / 100)}</span>
            </div>
          </article>
        ))}
      </div>
      {menu.items.length === 0 && <p>No items are currently available at this branch.</p>}
    </main>
  );
}
