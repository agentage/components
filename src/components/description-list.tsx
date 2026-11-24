'use client';

import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { CopyButton } from './copy-button';

import { descriptionListVariants } from './description-list.variants';

export { descriptionListVariants } from './description-list.variants';

export interface DescriptionListProps
  extends React.HTMLAttributes<HTMLDListElement>, VariantProps<typeof descriptionListVariants> {}

/** Key-value facts as a `dl`: alternate `DescriptionTerm` and `DescriptionDetail` children. */
export const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ variant, labelWidth, columns, size, className, ...props }, ref) => {
    const dl = (
      <dl
        ref={ref}
        className={cn(descriptionListVariants({ variant, labelWidth, columns, size }), className)}
        data-slot="description-list"
        data-variant={variant === 'editable' ? 'editable' : undefined}
        {...props}
      />
    );
    // A container query needs a parent box to measure; the dl itself cannot query its own width.
    return columns === 'responsive' ? <div className="@container min-w-0">{dl}</div> : dl;
  }
);
DescriptionList.displayName = 'DescriptionList';

export interface DescriptionGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  /** Heading level; the look stays the same. */
  level?: 2 | 3 | 4;
}

/** A titled block of facts: small uppercase heading over its DescriptionList. */
export const DescriptionGroup = React.forwardRef<HTMLElement, DescriptionGroupProps>(
  ({ title, level = 3, className, children, ...props }, ref) => {
    const id = React.useId();
    const Heading = `h${String(level)}` as 'h3';
    return (
      <section
        ref={ref}
        aria-labelledby={id}
        className={cn('min-w-0', className)}
        data-slot="description-group"
        {...props}
      >
        <Heading
          id={id}
          className="mb-2 mt-0 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
        >
          {title}
        </Heading>
        {children}
      </section>
    );
  }
);
DescriptionGroup.displayName = 'DescriptionGroup';

export interface DescriptionTermProps extends React.HTMLAttributes<HTMLElement> {
  /** Leading 14 px icon. */
  icon?: React.ReactNode;
}

export const DescriptionTerm = React.forwardRef<HTMLElement, DescriptionTermProps>(
  ({ icon, className, children, ...props }, ref) => (
    <dt
      ref={ref}
      className={cn(
        'min-w-0 text-muted-foreground',
        icon && 'flex items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0',
        className
      )}
      data-slot="description-term"
      {...props}
    >
      {icon}
      {children}
    </dt>
  )
);
DescriptionTerm.displayName = 'DescriptionTerm';

export interface DescriptionDetailProps extends React.HTMLAttributes<HTMLElement> {
  /** Monospace for ids, paths and branches. */
  mono?: boolean;
  /** Shows a copy button on hover or focus. `true` copies the text child; a string copies itself. */
  copy?: boolean | string;
  /** Renders the value as a link. */
  href?: string;
  /** One line with an ellipsis; a string value goes into `title` so it stays readable. */
  truncate?: boolean;
  copyLabel?: string;
}

const textOf = (children: React.ReactNode): string | undefined =>
  typeof children === 'string' || typeof children === 'number' ? String(children) : undefined;

export const DescriptionDetail = React.forwardRef<HTMLElement, DescriptionDetailProps>(
  ({ mono, copy, href, truncate, copyLabel = 'Copy', className, children, ...props }, ref) => {
    const text = textOf(children);
    const copyText = typeof copy === 'string' ? copy : copy ? text : undefined;
    const rich = Boolean(copyText || href || truncate);
    const value = href ? (
      <a
        href={href}
        className="text-foreground underline decoration-muted-foreground/60 underline-offset-2 hover:text-primary-emphasis hover:decoration-current"
      >
        {children}
      </a>
    ) : (
      children
    );
    return (
      <dd
        ref={ref}
        className={cn(
          'm-0 min-w-0 text-foreground wrap-anywhere',
          mono && 'font-mono text-xs',
          rich && 'group/dd flex items-center gap-1',
          className
        )}
        data-slot="description-detail"
        {...props}
      >
        {rich ? (
          <span
            className={cn('min-w-0', truncate && 'truncate')}
            title={truncate ? text : undefined}
          >
            {value}
          </span>
        ) : (
          value
        )}
        {copyText && (
          <CopyButton
            text={copyText}
            iconOnly
            variant="ghost"
            label={copyLabel}
            className="-my-0.5 shrink-0 opacity-0 transition-opacity group-hover/dd:opacity-100 focus-visible:opacity-100 data-[copied]:opacity-100"
          />
        )}
      </dd>
    );
  }
);
DescriptionDetail.displayName = 'DescriptionDetail';
