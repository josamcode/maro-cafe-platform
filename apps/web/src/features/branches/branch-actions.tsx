import Link from 'next/link';
import { MapPin, Phone } from 'lucide-react';
import { Button, Inline } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { type Branch, maroContact } from './data';
import { branchMessages } from './messages';

export function BranchActions({
  branch,
  locale,
  full = false,
}: {
  branch: Branch;
  locale: Locale;
  full?: boolean;
}) {
  const t = branchMessages[locale];
  return (
    <Inline className="branch-actions">
      <Button asChild variant={full ? 'default' : 'outline'}>
        <a
          href={branch.maps}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.directions} — ${branch.name[locale]}`}
        >
          <MapPin size={18} aria-hidden="true" />
          {t.directions}
        </a>
      </Button>
      {full && (
        <>
          <Button asChild variant="outline">
            <Link href={`/menu?branch=${branch.slug}`}>{t.menu}</Link>
          </Button>
          <Button asChild variant="quiet">
            <a href={`tel:${maroContact.phone}`}>
              <Phone size={18} aria-hidden="true" />
              {t.call}
            </a>
          </Button>
        </>
      )}
    </Inline>
  );
}
