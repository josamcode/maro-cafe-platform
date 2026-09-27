'use client';
import { useId, useState, type ReactNode } from 'react';
import { cn } from './cn.js';

export function Disclosure({
  title,
  media,
  meta,
  children,
  defaultExpanded = false,
  mobileOnly = false,
  className,
}: {
  title: string;
  media?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  mobileOnly?: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const id = useId();
  const label = (
    <>
      <span>{title}</span>
      {meta && <small>{meta}</small>}
    </>
  );
  return (
    <section
      className={cn('maro-disclosure', className)}
      data-expanded={expanded}
      data-mobile-only={mobileOnly}
      aria-labelledby={`${id}-heading`}
    >
      <div className="maro-disclosure-header">
        {media}
        <h2 id={`${id}-heading`} className="maro-heading" data-size="title">
          <button
            type="button"
            className="maro-disclosure-trigger"
            aria-expanded={expanded}
            aria-controls={`${id}-content`}
            onClick={() => setExpanded(!expanded)}
          >
            {label}
            <svg
              className="maro-disclosure-chevron"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {mobileOnly && <span className="maro-disclosure-static">{label}</span>}
        </h2>
      </div>
      <div id={`${id}-content`} className="maro-disclosure-content">
        {children}
      </div>
    </section>
  );
}
