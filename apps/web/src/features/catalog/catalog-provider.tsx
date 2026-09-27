'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { catalogResponseSchema, type CatalogData } from '@maro/contracts';
import { toMenuCategories } from '../menu/catalog';

const empty: CatalogData = { categories: [], products: [], branches: [] };
const Context = createContext<{ data: CatalogData; available: boolean }>({
  data: empty,
  available: false,
});

export function CatalogProvider({
  initial,
  children,
}: {
  initial: CatalogData | null;
  children: React.ReactNode;
}) {
  const [live, setLive] = useState<{ data: CatalogData; available: boolean } | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      if (document.hidden) return;
      try {
        const response = await fetch('/api/catalog', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Unavailable');
        const data = catalogResponseSchema.parse(await response.json());
        setLive({ data, available: true });
      } catch {
        if (!controller.signal.aborted)
          setLive((previous) => ({ data: previous?.data ?? initial ?? empty, available: false }));
      }
    }
    void refresh();
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [initial, pathname]);
  return (
    <Context value={live ?? { data: initial ?? empty, available: Boolean(initial) }}>
      {children}
    </Context>
  );
}

export function useCatalog() {
  const { data, available } = useContext(Context);
  const pathname = usePathname();
  const params = useSearchParams();
  const requestedBranch = pathname.startsWith('/in/')
    ? pathname.split('/')[2]
    : params.get('branch');
  const branch = data.branches.find((b) => b.slug === requestedBranch);
  const catalog = useMemo(() => toMenuCategories(data, branch?.slug), [data, branch?.slug]);
  return { data, catalog, available, branch };
}
