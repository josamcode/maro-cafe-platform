'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Heading, Input, Stack, Text } from '@maro/ui';
import type { Locale } from '../../lib/locale';
import { signIn } from './actions';
import { adminMessages } from './messages';

export function StaffLogin({ locale }: { locale: Locale }) {
  const t = adminMessages[locale];
  const [error, setError] = useState<number | null>(null);
  const [busy, start] = useTransition();
  const router = useRouter();
  return (
    <form
      className="admin-login"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        start(async () => {
          const result = await signIn({
            username: form.get('username'),
            password: form.get('password'),
          });
          setError(result.error);
          if (!result.error) router.refresh();
        });
      }}
    >
      <Stack>
        <Heading as="h1" size="section">
          {t.login}
        </Heading>
        <Text tone="muted">{t.loginIntro}</Text>
        <Field label={t.username}>
          {(props) => (
            <Input
              {...props}
              name="username"
              autoComplete="username"
              required
              maxLength={80}
              dir="ltr"
            />
          )}
        </Field>
        <Field label={t.password}>
          {(props) => (
            <Input
              {...props}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
              dir="ltr"
            />
          )}
        </Field>
        {error && (
          <Text role="alert">
            {error === 401 || error === 400
              ? t.invalidLogin
              : error === 429
                ? t.slow
                : t.unavailable}
          </Text>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? t.saving : t.enter}
        </Button>
      </Stack>
    </form>
  );
}
