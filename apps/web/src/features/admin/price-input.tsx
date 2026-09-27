'use client';
import { useState } from 'react';
import { Input } from '@maro/ui';

export function PriceInput({
  amount,
  onAmountChange,
  ...props
}: {
  amount: number;
  onAmountChange: (amount: number) => void;
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
}) {
  const [text, setText] = useState(amount ? String(amount) : '');
  return (
    <Input
      {...props}
      inputMode="decimal"
      dir="ltr"
      value={text}
      onChange={(event) => {
        const raw = event.target.value;
        setText(raw);
        const amount = Number(
          raw.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632)).replace('٫', '.'),
        );
        onAmountChange(Number.isFinite(amount) ? amount : 0);
      }}
    />
  );
}
