'use client';
import { useId, type ComponentProps, type ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from './cn.js';
export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('maro-label', className)} {...props} />;
}
type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean;
  }) => ReactNode;
};
export function Field({ label, hint, error, id: provided, children }: FieldProps) {
  const generated = useId();
  const id = provided ?? generated;
  const description = error || hint;
  return (
    <div className="maro-field">
      <Label htmlFor={id}>{label}</Label>
      {children({
        id,
        'aria-describedby': description ? id + '-description' : undefined,
        'aria-invalid': Boolean(error),
      })}
      {description && (
        <p
          className="maro-field-note"
          id={id + '-description'}
          data-error={Boolean(error)}
          role={error ? 'alert' : undefined}
        >
          {description}
        </p>
      )}
    </div>
  );
}
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn('maro-input', className)} {...props} />;
}
export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn('maro-input', 'maro-textarea', className)} {...props} />;
}
export function Checkbox({
  label,
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & { label: string }) {
  return (
    <label className={cn('maro-choice', className)}>
      <input type="checkbox" className="maro-checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function Switch({
  label,
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'role'> & { label: string }) {
  return (
    <label className={cn('maro-choice', className)}>
      <input type="checkbox" role="switch" className="maro-switch" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  options: { value: string; label: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="maro-radio-group" disabled={disabled}>
      <legend className="maro-label">{label}</legend>
      <div className="maro-inline">
        {options.map((option) => (
          <label key={option.value} className="maro-choice">
            <input
              className="maro-radio"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
type SelectProps = ComponentProps<typeof SelectPrimitive.Root> & {
  id?: string;
  placeholder: string;
  options: { value: string; label: string; disabled?: boolean }[];
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};
export function Select({
  id,
  placeholder,
  options,
  dir = 'ltr',
  'aria-describedby': description,
  'aria-invalid': invalid,
  ...props
}: SelectProps) {
  return (
    <SelectPrimitive.Root dir={dir} {...props}>
      <SelectPrimitive.Trigger
        id={id}
        className="maro-input maro-select-trigger"
        aria-describedby={description}
        aria-invalid={invalid}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="maro-chevron">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          dir={dir}
          lang={dir === 'rtl' ? 'ar' : 'en'}
          className="maro-select-content"
          position="popper"
          sideOffset={6}
        >
          <SelectPrimitive.ScrollUpButton className="maro-select-scroll">
            ↑
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="maro-select-item"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator aria-hidden="true">✓</SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="maro-select-scroll">
            ↓
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
