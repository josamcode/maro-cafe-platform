'use client';
import { useOptimistic, useSyncExternalStore, useTransition } from 'react';
import { Moon, Sun } from 'lucide-react';
import { IconButton } from '@maro/ui';
import type { Locale, Theme } from '../../lib/locale';
import { changeTheme } from './actions';
import { homeMessages } from './messages';
const media = '(prefers-color-scheme: dark)';
function subscribe(callback: () => void) {
  const query = window.matchMedia(media);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
export function ThemeControl({ locale, theme }: { locale: Locale; theme: Theme }) {
  const deviceDark = useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(media).matches,
    () => null,
  );
  const [pending, startTransition] = useTransition();
  const [selectedTheme, setSelectedTheme] = useOptimistic(theme);
  const dark = selectedTheme === 'system' ? (deviceDark ?? false) : selectedTheme === 'dark';
  const Icon = dark ? Sun : Moon;
  return (
    <IconButton
      variant="quiet"
      label={homeMessages[locale].toggleTheme}
      aria-pressed={dark}
      disabled={pending || deviceDark === null}
      onClick={() => {
        const next = dark ? 'light' : 'dark';
        startTransition(async () => {
          setSelectedTheme(next);
          await changeTheme(next);
        });
      }}
    >
      <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
    </IconButton>
  );
}
