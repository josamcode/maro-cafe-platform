import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@maro/ui';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-6 text-sm uppercase tracking-[0.2em] text-stone-600">
        A new MARO experience
      </p>
      <h1 className="max-w-3xl text-5xl leading-tight font-medium sm:text-7xl">
        Your next coffee.
        <br />
        Your favourite place.
      </h1>
      <p className="mt-8 max-w-lg text-lg leading-relaxed text-stone-600">
        We are building a simpler way to discover MARO, explore the menu, and find your place.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/branches">
            Explore branches <ArrowUpRight className="ml-2 size-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/in/demo">Preview the in-store menu</Link>
        </Button>
      </div>
      <p className="mt-16 text-sm text-stone-500">
        Foundation preview. Sample content is not an approved menu or final design.
      </p>
    </main>
  );
}
