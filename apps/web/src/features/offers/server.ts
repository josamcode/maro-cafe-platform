import { redirect } from 'next/navigation';
import { ApiError } from '@maro/api-client';
import { offersSchema } from '@maro/contracts';
import { staffRequest } from '../admin/server';
export async function getStaffOffers() {
  try {
    return offersSchema.parse(await (await staffRequest('/v1/staff/offers')).json());
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/admin');
    throw error;
  }
}
