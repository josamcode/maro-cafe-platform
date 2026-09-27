import type { ReactNode } from 'react';
import { Heading, Price, Text } from './primitives.js';

export function SummaryRow({
  name,
  description,
  action,
}: {
  name: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="maro-summary-row">
      <div className="maro-summary-copy">
        <Heading as="h3" size="title">
          {name}
        </Heading>
        <Text tone="muted">{description}</Text>
      </div>
      <div className="maro-summary-action">{action}</div>
    </div>
  );
}
export function StartingPrice({
  label,
  amount,
  locale,
}: {
  label: string;
  amount: number;
  locale: 'ar' | 'en';
}) {
  return (
    <div className="maro-starting-price">
      <span>{label}</span>
      <Price amount={amount} locale={locale} />
    </div>
  );
}
export function CollectionCard({
  image,
  name,
  description,
  action,
  price,
}: {
  image: ReactNode;
  name: string;
  description: string;
  action: ReactNode;
  price: ReactNode;
}) {
  return (
    <article className="maro-collection">
      <div className="maro-collection-media">
        {image}
        <div className="maro-collection-price">{price}</div>
      </div>
      <SummaryRow name={name} description={description} action={action} />
    </article>
  );
}
