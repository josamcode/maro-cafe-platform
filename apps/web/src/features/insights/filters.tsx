'use client';
import { useRouter } from 'next/navigation';
import { Field, Select } from '@maro/ui';
import type { CatalogBranch } from '@maro/contracts';
import type { Locale } from '../../lib/locale';
import { insightMessages } from './messages';
export function InsightFilters({
  locale,
  branches,
  days,
  context,
  branch,
}: {
  locale: Locale;
  branches: CatalogBranch[];
  days: string;
  context: string;
  branch: string;
}) {
  const router = useRouter();
  const t = insightMessages[locale];
  const fields = [
    {
      key: 'days',
      label: t.days,
      value: days,
      options: [
        { value: '7', label: t.week },
        { value: '30', label: t.month },
      ],
    },
    {
      key: 'context',
      label: t.context,
      value: context,
      options: ['all', 'outside', 'inside'].map((value) => ({
        value,
        label: t[value as 'all' | 'outside' | 'inside'],
      })),
    },
    {
      key: 'branch',
      label: t.branch,
      value: branch,
      options: [
        { value: 'all', label: t.all },
        ...branches.map((b) => ({ value: b.slug, label: b.name[locale] })),
      ],
    },
  ];
  return (
    <div className="admin-insight-filters">
      {fields.map((field) => (
        <Field key={field.key} label={field.label}>
          {(props) => (
            <Select
              {...props}
              placeholder={field.label}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              value={field.value}
              options={field.options}
              onValueChange={(value) => {
                const params = new URLSearchParams({ days, context, branch, [field.key]: value });
                if (params.get('branch') === 'all') params.delete('branch');
                router.push(`/admin/insights?${params}`);
              }}
            />
          )}
        </Field>
      ))}
    </div>
  );
}
