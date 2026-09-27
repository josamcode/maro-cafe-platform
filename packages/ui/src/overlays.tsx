'use client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { IconButton } from './actions.js';
export function Dialog({
  trigger,
  title,
  description,
  closeLabel,
  children,
  dir = 'ltr',
  lang = 'en',
  wide = false,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  closeLabel: string;
  children: ReactNode;
  dir?: 'ltr' | 'rtl';
  lang?: 'en' | 'ar';
  wide?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="maro-dialog-overlay" />
        <DialogPrimitive.Content className="maro-dialog" data-wide={wide} dir={dir} lang={lang}>
          <DialogPrimitive.Title className="maro-heading" data-size="title">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="maro-text" data-tone="muted">
            {description}
          </DialogPrimitive.Description>
          <div className="maro-dialog-body">{children}</div>
          <DialogPrimitive.Close asChild>
            <IconButton variant="quiet" label={closeLabel} className="maro-dialog-close">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </IconButton>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
export function Tabs({
  label,
  items,
  dir = 'ltr',
}: {
  label: string;
  items: { value: string; label: string; content: ReactNode }[];
  dir?: 'ltr' | 'rtl';
}) {
  return (
    <TabsPrimitive.Root dir={dir} defaultValue={items[0]?.value}>
      <TabsPrimitive.List aria-label={label} className="maro-tabs-list">
        {items.map((item) => (
          <TabsPrimitive.Trigger className="maro-tab" key={item.value} value={item.value}>
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content className="maro-tab-panel" key={item.value} value={item.value}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
