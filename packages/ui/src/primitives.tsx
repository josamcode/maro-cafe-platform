import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn.js';
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('maro-container', className)} {...props} />;
}
export function Stack({
  className,
  gap = 'md',
  ...props
}: ComponentProps<'div'> & { gap?: 'sm' | 'md' | 'lg' }) {
  return <div className={cn('maro-stack', className)} data-gap={gap} {...props} />;
}
export function Inline({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('maro-inline', className)} {...props} />;
}
export function Grid({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('maro-grid', className)} {...props} />;
}
export function Surface({
  className,
  tone = 'paper',
  ...props
}: ComponentProps<'div'> & { tone?: 'paper' | 'soft' | 'dark' }) {
  return <div className={cn('maro-surface', className)} data-tone={tone} {...props} />;
}
export function Section({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('maro-section', className)} {...props} />;
}
export function Heading({
  as: Tag = 'h2',
  size = 'section',
  className,
  ...props
}: ComponentProps<'h2'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'display' | 'section' | 'title';
}) {
  return <Tag className={cn('maro-heading', className)} data-size={size} {...props} />;
}
export function Text({
  className,
  tone = 'default',
  ...props
}: ComponentProps<'p'> & { tone?: 'default' | 'muted' | 'eyebrow' }) {
  return <p className={cn('maro-text', className)} data-tone={tone} {...props} />;
}
export function Badge({
  className,
  tone = 'neutral',
  ...props
}: ComponentProps<'span'> & { tone?: 'neutral' | 'success' | 'danger' }) {
  return <span className={cn('maro-badge', className)} data-tone={tone} {...props} />;
}
export function Divider() {
  return <hr className="maro-divider" />;
}
export function Skeleton({
  className,
  label,
  ...props
}: ComponentProps<'div'> & { label: string }) {
  return (
    <div role="status" className={cn('maro-skeleton', className)} aria-label={label} {...props} />
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Surface tone="soft">
      <Stack>
        <Heading as="h3" size="title">
          {title}
        </Heading>
        <Text tone="muted">{description}</Text>
        {action}
      </Stack>
    </Surface>
  );
}
export function Price({ amount, locale = 'ar' }: { amount: number; locale?: 'ar' | 'en' }) {
  return (
    <bdi className="maro-price">
      {new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount)}
    </bdi>
  );
}
export function ProductCard({
  image,
  name,
  description,
  price,
  locale,
  action,
  details,
  pricePrefix,
  compact = false,
}: {
  image?: ReactNode;
  name: string;
  description?: string;
  price: number;
  locale: 'ar' | 'en';
  action: ReactNode;
  details?: ReactNode;
  pricePrefix?: string;
  compact?: boolean;
}) {
  return (
    <article
      className="maro-product"
      data-compact={compact}
      data-has-image={Boolean(image)}
      data-has-details={Boolean(details)}
    >
      {details}
      {image && <div className="maro-product-image">{image}</div>}
      <Stack gap="sm">
        <Inline>
          <Heading as="h3" size="title">
            {name}
          </Heading>
          <span className="maro-product-price">
            {pricePrefix && <small>{pricePrefix}</small>}
            <Price amount={price} locale={locale} />
          </span>
        </Inline>
        {description && <Text tone="muted">{description}</Text>}
        {details ? <div className="maro-product-actions">{action}</div> : action}
      </Stack>
    </article>
  );
}
