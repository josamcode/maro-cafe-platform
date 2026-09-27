import Link from 'next/link';
import { Button } from '@maro/ui';
import { getApiClient } from '@/lib/api';
export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
  let result;
  try {
    result = await getApiClient().listBranches();
  } catch {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl">Our branches</h1>
        <p role="status" className="mt-6 text-stone-600">
          Branch information is temporarily unavailable. Please try again shortly.
        </p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-8 text-4xl">Our branches</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {result.data.map((branch) => (
          <article key={branch.id} className="rounded-2xl border border-stone-200 p-6">
            <h2 className="text-xl font-medium">{branch.name}</h2>
            <p className="my-4 text-stone-600">{branch.address}</p>
            <Button variant="outline" asChild>
              <Link href={`/in/${branch.slug}`}>View menu</Link>
            </Button>
          </article>
        ))}
      </div>
      {result.data.length === 0 && <p>No branches are available yet.</p>}
    </main>
  );
}
