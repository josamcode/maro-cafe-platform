import { cookies, headers } from 'next/headers';
export type Locale = 'ar' | 'en';
export type Theme = 'system' | 'light' | 'dark';
export async function getLocale(): Promise<Locale> {
  const preference = (await cookies()).get('maro-locale')?.value;
  if (preference === 'ar' || preference === 'en') return preference;
  const languages = ((await headers()).get('accept-language') ?? '')
    .split(',')
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().toLowerCase().split(';');
      const quality = parameters.find((p) => p.trim().startsWith('q='));
      return {
        language: tag?.split('-')[0],
        quality: quality ? Number(quality.trim().slice(2)) : 1,
      };
    })
    .filter((entry) => entry.quality > 0 && entry.quality <= 1)
    .sort((a, b) => b.quality - a.quality);
  return (
    (languages.find((entry) => entry.language === 'ar' || entry.language === 'en')
      ?.language as Locale) ?? 'ar'
  );
}
export async function getTheme(): Promise<Theme> {
  const preference = (await cookies()).get('maro-theme')?.value;
  return preference === 'light' || preference === 'dark' ? preference : 'system';
}
