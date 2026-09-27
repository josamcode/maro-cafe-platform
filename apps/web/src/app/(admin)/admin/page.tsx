import { Button, Text } from '@maro/ui';
import { ApiError } from '@maro/api-client';
import { getLocale } from '../../../lib/locale';
import { getStaff, getAdminCatalog } from '../../../features/admin/server';
import { signOut } from '../../../features/admin/actions';
import { StaffLogin } from '../../../features/admin/login';
import { ProductList } from '../../../features/admin/product-list';
import { adminMessages } from '../../../features/admin/messages';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const locale = await getLocale();
  const t = adminMessages[locale];
  const loaded = await Promise.all([getStaff(), getAdminCatalog()])
    .then(([staff, data]) => ({ staff, data, error: null }))
    .catch((error: unknown) => ({ staff: null, data: null, error }));
  if (!loaded.staff || !loaded.data)
    return loaded.error instanceof ApiError && loaded.error.status === 401 ? (
      <StaffLogin locale={locale} />
    ) : (
      <Text role="alert">{t.unavailable}</Text>
    );
  const { staff, data } = loaded;
  const params = await searchParams;
  return (
    <>
      <div className="admin-account">
        <Text>{staff.username}</Text>
        <form action={signOut}>
          <Button type="submit" variant="quiet">
            {t.logout}
          </Button>
        </form>
      </div>
      {params.saved === '1' && (
        <Text role="status" className="admin-feedback">
          {t.saved}
        </Text>
      )}
      <ProductList data={data} locale={locale} />
    </>
  );
}
