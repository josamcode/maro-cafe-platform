import Link from 'next/link';
import { DirectionArrow, Heading, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { branches, type Branch } from './data';
import { branchMessages } from './messages';
import { BranchActions } from './branch-actions';
import './branches.css';

export function BranchList({
  locale,
  items = branches,
  compact = false,
}: {
  locale: Locale;
  items?: readonly Branch[];
  compact?: boolean;
}) {
  const t = branchMessages[locale];
  return (
    <div className="branch-list" data-compact={compact}>
      {items.map((branch) => (
        <article className="branch-list-row" key={branch.slug}>
          <Link
            className="branch-summary"
            href={`/branches/${branch.slug}`}
            aria-label={`${t.details} — ${branch.name[locale]}`}
          >
            <div>
              <Heading as="h3" size="title">
                {branch.name[locale]}
              </Heading>
              <Text tone="muted">{branch.area[locale]}</Text>
            </div>
            <DirectionArrow />
          </Link>
          <BranchActions branch={branch} locale={locale} />
        </article>
      ))}
    </div>
  );
}
