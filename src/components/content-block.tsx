'use client';

import * as React from 'react';
import { useControlled } from '../lib/use-controlled';
import { cn } from '../lib/utils';
import { CopyButton } from './copy-button';
import { Disclosure } from './disclosure';
import { GroupHeader } from './group-header';

export interface ContentBlockSource {
  href: string;
  label: string;
}

export interface ContentBlockProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  /** Quiet header text: "6 of 6 passed", "+12 -3". */
  summary?: React.ReactNode;
  /** Header link to where the block came from, opened as a 24 px icon button. */
  source?: ContentBlockSource;
  /** Text the header copy button puts on the clipboard. */
  copyText?: string;
  /** The header toggles the body; default true. */
  collapsible?: boolean;
  /** Controlled open state of a collapsible block. */
  open?: boolean;
  /** Uncontrolled start state; default true. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Mono title, for file paths. */
  mono?: boolean;
}

const LinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-3.5 fill-none stroke-current stroke-2"
    aria-hidden="true"
  >
    <path
      d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ICON_BUTTON =
  'grid size-6 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors duration-fast hover:bg-accent hover:text-foreground focus-ring';

/** Card frame of one content block: a 32 px header (toggle, icon, title, summary, link, copy). */
export const ContentBlock = React.forwardRef<HTMLElement, ContentBlockProps>(
  (
    {
      title,
      icon,
      summary,
      source,
      copyText,
      collapsible = true,
      open: openProp,
      defaultOpen = true,
      onOpenChange,
      mono = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useControlled(openProp, defaultOpen, onOpenChange);
    const uid = React.useId();
    const shown = !collapsible || open;
    const actions = (source || copyText !== undefined) && (
      <>
        {source && (
          <a
            href={source.href}
            aria-label={`Open ${source.label}`}
            title={source.label}
            className={ICON_BUTTON}
          >
            <LinkIcon />
          </a>
        )}
        {copyText !== undefined && (
          <CopyButton text={copyText} iconOnly variant="ghost" size="sm" label="Copy block" />
        )}
      </>
    );
    return (
      <section
        ref={ref}
        aria-labelledby={`${uid}-title`}
        className={cn('min-w-0 overflow-hidden rounded-lg border border-border bg-card', className)}
        data-slot="content-block"
        data-state={shown ? 'open' : 'closed'}
        {...props}
      >
        <GroupHeader
          triggerId={`${uid}-title`}
          label={<span className={cn(mono && 'font-mono text-xs font-normal')}>{title}</span>}
          icon={icon}
          summary={summary}
          open={shown}
          onOpenChange={collapsible ? setOpen : undefined}
          controls={`${uid}-body`}
          actions={actions}
          className={cn('pr-1', !shown && 'border-b-0')}
          data-slot="content-block-head"
        />
        <Disclosure id={`${uid}-body`} open={shown}>
          {children}
        </Disclosure>
      </section>
    );
  }
);
ContentBlock.displayName = 'ContentBlock';

/** Prose with `inline code` spans from backticks. */
export const InlineText = ({ text }: { text: string }): React.JSX.Element => (
  <>
    {text.split(/(`[^`]+`)/g).map((part, i) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
        <code key={i} className="rounded border border-border bg-card px-1 py-px font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      )
    )}
  </>
);
