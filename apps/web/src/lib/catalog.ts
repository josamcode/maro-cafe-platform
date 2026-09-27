import { cache } from 'react';
import { getApiClient } from './api';

export const getPublicCatalog = cache(() => getApiClient().getCatalog());
export async function getPublicBranch(slug: string) {
  return (await getPublicCatalog()).branches.find((b) => b.slug === slug);
}
