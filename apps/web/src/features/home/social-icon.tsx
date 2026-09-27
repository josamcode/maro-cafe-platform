import { Phone } from 'lucide-react';
export function SocialIcon({ kind }: { kind: 'phone' | 'instagram' | 'facebook' }) {
  if (kind === 'phone') return <Phone size={19} strokeWidth={1.5} aria-hidden="true" />;
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {kind === 'instagram' ? (
        <g stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
        </g>
      ) : (
        <path
          fill="currentColor"
          d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5c-.7-.1-1.8-.2-3-.2-3 0-5 1.8-5 5.2V9H7v4h3v9z"
        />
      )}
    </svg>
  );
}
