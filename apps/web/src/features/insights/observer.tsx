'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackIntent } from './track';
export function IntentObserver() {
  const path = usePathname();
  const last = useRef('');
  useEffect(() => {
    if (last.current === path) return;
    last.current = path;
    if (path === '/menu' || path.startsWith('/in/')) trackIntent({ kind: 'menu_view' });
    if (path.startsWith('/branches/'))
      trackIntent({ kind: 'branch_view', branchSlug: path.split('/')[2] });
  }, [path]);
  return null;
}
