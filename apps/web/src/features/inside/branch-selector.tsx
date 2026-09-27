'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Field, Select } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { menuBranches } from '../menu/catalog';
import { insideMessages } from './messages';

export function BranchSelector({ branchSlug, locale }: { branchSlug: string; locale: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const t = insideMessages[locale];
  return (
    <div className="inside-branch">
      <Field label={t.branch} hint={t.branchHint}>
        {(props) => (
          <Select
            {...props}
            placeholder={t.branch}
            value={branchSlug}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            options={Object.entries(menuBranches).map(([value, name]) => ({
              value,
              label: name[locale],
            }))}
            onValueChange={(value) => {
              const next = new URLSearchParams(params);
              next.delete('branch');
              router.push(`/in/${value}${next.size ? `?${next}` : ''}`, { scroll: false });
            }}
          />
        )}
      </Field>
    </div>
  );
}
