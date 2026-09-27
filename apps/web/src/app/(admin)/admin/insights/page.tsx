import { redirect } from 'next/navigation';
import { ApiError } from '@maro/api-client';
import { insightSchema, insightQuerySchema, intentKindSchema } from '@maro/contracts';
import { Heading, Text } from '@maro/ui';
import { staffRequest, getAdminCatalog } from '../../../../features/admin/server';
import { getLocale } from '../../../../lib/locale';
import { insightMessages } from '../../../../features/insights/messages';
import { InsightFilters } from '../../../../features/insights/filters';
export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const query = insightQuerySchema.safeParse(await searchParams);
  const filters = query.success ? query.data : insightQuerySchema.parse({});
  const params = new URLSearchParams(filters);
  const insights = await staffRequest(`/v1/staff/insights?${params}`)
    .then(async (res) => insightSchema.parse(await res.json()))
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) redirect('/admin');
      throw error;
    });
  const [locale, data] = await Promise.all([getLocale(), getAdminCatalog()]);
  const t = insightMessages[locale];
  const number = new Intl.NumberFormat(locale);
  return (
    <>
      <div className="admin-title">
        <div>
          <Heading as="h1" size="section">
            {t.title}
          </Heading>
          <Text tone="muted">{t.intro}</Text>
        </div>
      </div>
      <InsightFilters
        locale={locale}
        branches={data.branches}
        days={filters.days}
        context={filters.context}
        branch={filters.branch ?? 'all'}
      />
      {!insights.counts.length && <Text className="admin-feedback">{t.empty}</Text>}
      <dl className="admin-metrics">
        {intentKindSchema.options.map((kind) => (
          <div key={kind}>
            <dt>{t[kind]}</dt>
            <dd>{number.format(insights.counts.find((c) => c.kind === kind)?.count ?? 0)}</dd>
          </div>
        ))}
        <div>
          <dt>{t.withResults}</dt>
          <dd>
            {number.format(
              insights.counts.find((c) => c.kind === 'search_results')?.withResults ?? 0,
            )}
          </dd>
        </div>
      </dl>
      <Text tone="muted">{t.notice}</Text>
    </>
  );
}
