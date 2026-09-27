import { createApiClient } from '@maro/api-client';

export function getApiClient() {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error('API_BASE_URL is required for server-side API requests.');
  return createApiClient(baseUrl);
}
