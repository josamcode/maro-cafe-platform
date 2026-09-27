import type { Intent } from '@maro/contracts';
export function trackIntent(event: Omit<Intent, 'id' | 'context'>) {
  if (
    typeof window === 'undefined' ||
    typeof globalThis.crypto?.randomUUID !== 'function' ||
    navigator.doNotTrack === '1' ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl
  )
    return;
  const path = window.location.pathname;
  if (!(
    path === '/' ||
    path === '/menu' ||
    path.startsWith('/branches/') ||
    path === '/branches' ||
    path.startsWith('/in/')
  ))
    return;
  const inside = path.startsWith('/in/');
  const branch = inside
    ? path.split('/')[2]
    : (new URLSearchParams(window.location.search).get('branch') ?? undefined);
  void fetch('/api/intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...event,
      id: crypto.randomUUID(),
      context: inside ? 'inside' : 'outside',
      branchSlug: event.branchSlug ?? branch,
    }),
    keepalive: true,
  }).catch(() => {});
}
