import Link from 'next/link';
import { Button, DirectionArrow } from '@maro/ui';
import { homeMessages } from '../home/messages';
import type { Locale } from '../../lib/locale';

export function MenuLink({
  locale,
  initialCategory = 'all',
  label,
  variant = 'default',
  compact = false,
}: {
  locale: Locale;
  initialCategory?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'quiet';
  compact?: boolean;
}) {
  const title = label ?? homeMessages[locale].explore;
  return (
    <Button
      asChild
      variant={variant}
      className={compact ? 'maro-icon-button maro-icon-button-round' : undefined}
    >
      <Link
        href={
          initialCategory === 'all'
            ? '/menu'
            : `/menu?category=${encodeURIComponent(initialCategory)}`
        }
        aria-label={compact ? title : undefined}
      >
        {compact ? <DirectionArrow /> : title}
      </Link>
    </Button>
  );
}
