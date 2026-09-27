'use client';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from './cn.js';
const buttonVariants = cva('maro-button', {
  variants: {
    variant: {
      default: 'maro-button-primary',
      outline: 'maro-button-outline',
      quiet: 'maro-button-quiet',
    },
    size: { sm: 'maro-button-sm', md: 'maro-button-md' },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});
export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = 'button',
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : 'button';
  return (
    <Component
      {...(!asChild ? { type } : {})}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
export function IconButton({
  label,
  className,
  round = false,
  ...props
}: Omit<ComponentProps<typeof Button>, 'asChild'> & { label: string; round?: boolean }) {
  return (
    <Button
      className={cn('maro-icon-button', round && 'maro-icon-button-round', className)}
      aria-label={label}
      {...props}
    />
  );
}
export function DirectionArrow() {
  return (
    <svg
      className="maro-direction-arrow"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
export function FilterChip({
  selected = false,
  className,
  ...props
}: ComponentProps<'button'> & { selected?: boolean }) {
  return (
    <button
      type="button"
      className={cn('maro-chip', className)}
      aria-pressed={selected}
      {...props}
    />
  );
}
