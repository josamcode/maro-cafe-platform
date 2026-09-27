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
export async function changeTheme(theme: string) {
  if (theme !== 'light' && theme !== 'dark') return;
  (await cookies()).set('maro-theme', theme, {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });
}
