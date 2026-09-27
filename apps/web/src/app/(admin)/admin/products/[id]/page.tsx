import { redirect, notFound } from 'next/navigation';
import { ApiError } from '@maro/api-client';
import { getAdminCatalog } from '../../../../../features/admin/server';
import { ProductForm } from '../../../../../features/admin/product-form';
import { getLocale } from '../../../../../lib/locale';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getAdminCatalog().catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 401) redirect('/admin');
    throw error;
  });
  const product = data.products.find((p) => p.id === id);
  if (id !== 'new' && !product) notFound();
  return <ProductForm data={data} product={product} locale={await getLocale()} />;
}
