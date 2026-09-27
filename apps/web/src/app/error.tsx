'use client';
import { useSyncExternalStore } from 'react';
import { Button, Container, Heading, Stack, Text } from '@maro/ui';

const subscribe = () => () => {};
const messages = {
  ar: {
    title: 'الصفحة مش متاحة دلوقتي',
    description: 'حاول تاني بعد لحظات. اختياراتك المحفوظة لسه موجودة.',
    retry: 'حاول تاني',
  },
  en: {
    title: 'This page is temporarily unavailable',
    description: 'Please try again in a moment. Your saved picks are still on this device.',
    retry: 'Try again',
  },
};
export default function PageError({ reset }: { reset: () => void }) {
  const locale = useSyncExternalStore<'ar' | 'en'>(
    subscribe,
    () => (document.documentElement.lang === 'ar' ? 'ar' : 'en'),
    () => 'ar',
  );
  const t = messages[locale];
  return (
    <Container>
      <Stack style={{ paddingBlock: '3rem' }}>
        <Heading as="h1" size="section">
          {t.title}
        </Heading>
        <Text role="alert">{t.description}</Text>
        <div>
          <Button onClick={reset}>{t.retry}</Button>
        </div>
      </Stack>
    </Container>
  );
}
