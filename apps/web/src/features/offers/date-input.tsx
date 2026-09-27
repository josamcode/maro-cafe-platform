'use client';
import { useState, type ComponentProps } from 'react';
import { Input } from '@maro/ui';
export function OfferDateInput({
  value,
  onDateChange,
  ...props
}: Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> & {
  value: string;
  onDateChange: (value: string) => void;
}) {
  const [text, setText] = useState(() =>
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.split('-').reverse().join('/') : value,
  );
  return (
    <Input
      {...props}
      dir="ltr"
      inputMode="numeric"
      placeholder="01/10/2026"
      maxLength={10}
      value={text}
      onChange={(event) => {
        const raw = event.target.value.replace(/[٠-٩]/g, (digit) =>
          String(digit.charCodeAt(0) - 1632),
        );
        const digits = raw.replace(/\D/g, '').slice(0, 8);
        const formatted = /^\d{4}-\d{2}-\d{2}$/.test(raw)
          ? raw.split('-').reverse().join('/')
          : [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
        setText(formatted);
        onDateChange(
          /^\d{2}\/\d{2}\/\d{4}$/.test(formatted)
            ? formatted.split('/').reverse().join('-')
            : formatted,
        );
      }}
    />
  );
}
