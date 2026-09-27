'use server';
import { cookies } from 'next/headers';
export async function changeLocale(formData: FormData) {
  const locale = formData.get('locale');
  if (locale !== 'ar' && locale !== 'en') return;
  (await cookies()).set('maro-locale', locale, {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });
}
