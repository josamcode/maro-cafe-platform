'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { Locale } from '../../lib/locale';
import type { MenuMedia } from './media';

export function MenuPhoto({
  media,
  locale,
  variant = 'card',
  eager = false,
}: {
  media: MenuMedia;
  locale: Locale;
  variant?: 'card' | 'category' | 'detail';
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="menu-photo" data-variant={variant}>
      <Image
        fill
        loading={eager || variant === 'detail' ? 'eager' : 'lazy'}
        src={failed ? '/design-system/maro-mood.jpg' : media.src}
        alt={failed ? (locale === 'ar' ? 'داخل MARO' : 'Inside MARO') : media.alt[locale]}
        sizes={
          variant === 'category'
            ? '72px'
            : variant === 'detail'
              ? '(max-width: 768px) 85vw, 440px'
              : '(max-width: 768px) 96px, (max-width: 1024px) 45vw, 400px'
        }
        style={{ objectPosition: failed ? 'center' : media.position }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
