import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl">Page not found</h1>
      <Link className="mt-6 inline-block underline" href="/">
        Return to MARO
      </Link>
    </main>
  );
}
