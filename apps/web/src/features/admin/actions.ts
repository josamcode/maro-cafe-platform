'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ApiError } from '@maro/api-client';
import { loginSchema, productWriteSchema, sessionSchema } from '@maro/contracts';
import { staffCookie, staffRequest } from './server';

function failure(error: unknown) {
  return { error: error instanceof ApiError ? error.status : 503 };
}
export async function signIn(input: unknown) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: 400 };
  try {
    const response = await fetch(new URL('/v1/staff/login', process.env.API_BASE_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { error: response.status };
    const session = sessionSchema.parse(await response.json());
    (await cookies()).set(staffCookie, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/admin',
      expires: new Date(session.expiresAt),
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath('/admin');
  return { error: null };
}
export async function signOut() {
  try {
    await staffRequest('/v1/staff/logout', { method: 'POST' });
  } catch {
    /* Expired sessions still clear locally. */
  }
  (await cookies()).delete({ name: staffCookie, path: '/admin' });
  redirect('/admin');
}
export async function saveProduct(id: string | null, input: unknown) {
  const parsed = productWriteSchema.safeParse(input);
  if (!parsed.success || (id && !/^[a-f0-9-]{36}$/.test(id))) return { error: 400 };
  try {
    await staffRequest(id ? `/v1/staff/products/${id}` : '/v1/staff/products', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(parsed.data),
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath('/', 'layout');
  return { error: null };
}
export async function uploadImage(form: FormData) {
  const file = form.get('image');
  if (
    !(file instanceof File) ||
    file.size > 5 * 1024 * 1024 ||
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  )
    return { error: 400, src: null };
  try {
    const response = await staffRequest('/v1/staff/images', {
      method: 'POST',
      body: JSON.stringify({ data: Buffer.from(await file.arrayBuffer()).toString('base64') }),
    });
    const data = (await response.json()) as { src: string };
    return { error: null, src: data.src };
  } catch (error) {
    return { ...failure(error), src: null };
  }
}
