import type { ReactNode } from 'react';
export function HeroMedia({
  main,
  detail,
  caption,
}: {
  main: ReactNode;
  detail: ReactNode;
  caption: ReactNode;
}) {
  return (
    <figure className="maro-hero-media">
      <div className="maro-hero-media-main">{main}</div>
      <div className="maro-hero-media-detail">{detail}</div>
      <figcaption className="maro-hero-media-caption">{caption}</figcaption>
    </figure>
  );
}
