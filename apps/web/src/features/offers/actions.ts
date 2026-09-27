'use server';
import { revalidatePath } from 'next/cache';
import { ApiError } from '@maro/api-client';
import { offerWriteSchema } from '@maro/contracts';
import { staffRequest } from '../admin/server';
export async function saveOffer(id: string | null, input: unknown) {
  const parsed = offerWriteSchema.safeParse(input);
  if (!parsed.success || (id && !/^[a-f0-9-]{36}$/.test(id))) return { error: 400 };
  try {
    await staffRequest(id ? `/v1/staff/offers/${id}` : '/v1/staff/offers', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(parsed.data),
    });
    revalidatePath('/admin/offers');
    return { error: null };
  } catch (error) {
    return { error: error instanceof ApiError ? error.status : 503 };
  }
}
