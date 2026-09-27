import { cookies } from 'next/headers';
import { ApiError } from '@maro/api-client';
import { staffSchema, catalogResponseSchema } from '@maro/contracts';

export const staffCookie = 'maro-staff';
export async function staffRequest(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get(staffCookie)?.value;
  if (!token) throw new ApiError(401);
  const response = await fetch(new URL(path, process.env.API_BASE_URL), {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new ApiError(response.status);
  return response;
}
export async function getStaff() {
  return staffSchema.parse(await (await staffRequest('/v1/staff/me')).json());
}
export async function getAdminCatalog() {
  return catalogResponseSchema.parse(await (await staffRequest('/v1/staff/catalog')).json());
}
