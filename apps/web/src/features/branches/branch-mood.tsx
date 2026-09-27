import Image from 'next/image';
import type { Locale } from '../../lib/locale';
import { branchMessages } from './messages';

export function BranchMood({ locale }: { locale: Locale }) {
  const t = branchMessages[locale];
  return (
    <figure className="branch-mood">
      <Image
        src="/design-system/maro-mood.jpg"
        alt={t.photoAlt}
        width={4096}
        height={2731}
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="eager"
      />
      <figcaption>
        <span>{t.mood}</span>
        {t.photo}
      </figcaption>
    </figure>
  );
}
