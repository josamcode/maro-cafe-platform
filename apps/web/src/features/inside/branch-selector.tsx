'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Field, Select } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { useCatalog } from '../catalog/catalog-provider';
import { insideMessages } from './messages';

export function BranchSelector({ branchSlug, locale }: { branchSlug: string; locale: Locale }) {
  const { data } = useCatalog();
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
            options={data.branches.map((branch) => ({
              value: branch.slug,
              label: branch.name[locale],
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
