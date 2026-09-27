'use client';
import { IconButton } from './actions.js';

export function QuantityControl({
  value,
  onChange,
  label,
  increaseLabel,
  decreaseLabel,
  min = 1,
  max = 99,
  locale = 'en',
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  increaseLabel: string;
  decreaseLabel: string;
  min?: number;
  max?: number;
  locale?: 'ar' | 'en';
}) {
  return (
    <div className="maro-quantity" role="group" aria-label={label}>
      <IconButton
        label={decreaseLabel}
        variant="quiet"
        size="sm"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </IconButton>
      <output aria-live="polite">
        {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG').format(value)}
      </output>
      <IconButton
        label={increaseLabel}
        variant="quiet"
        size="sm"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </IconButton>
    </div>
  );
}
