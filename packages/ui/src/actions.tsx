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
  ...props
}: Omit<ComponentProps<typeof Button>, 'asChild'> & { label: string }) {
  return <Button className={cn('maro-icon-button', className)} aria-label={label} {...props} />;
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
