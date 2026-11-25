'use client';
import type { ReactNode } from 'react';
import {
  Avatar,
  Badge,
  ContentBlocks,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  DropdownMenuItem,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type ActionBarAction,
  type ListItem,
  RelativeTime,
} from '../../src';
import { ago, at, KIND_LABEL, waits, type RequestItem, type RequestKind } from './requests-data';
import { UiIcon, type UiIconName } from './ui-icons';

/** Docs-only: the kind icon, tone and actions of a request. */
const KIND_ICON: Record<RequestKind, UiIconName> = {
  approval: 'shield',
  question: 'help',
  review: 'eye',
  failure: 'alert',
  outcome: 'checkCircle',
  fyi: 'info',
};
const KIND_TONE = {
  approval: 'primary',
  question: 'primary',
  review: 'muted',
  failure: 'destructive',
  outcome: 'success',
  fyi: 'muted',
} as const;
const BADGE = {
  approval: 'outline-primary',
  question: 'outline-primary',
  review: 'outline-muted',
  failure: 'outline-destructive',
  outcome: 'outline-success',
  fyi: 'outline-muted',
} as const;

export const toListItem = (it: RequestItem): ListItem & { item: RequestItem } => ({
  id: it.id,
  item: it,
  title: it.title,
  description: it.summary,
  kind: KIND_LABEL[it.kind],
  icon: <UiIcon name={KIND_ICON[it.kind]} />,
  iconTone: KIND_TONE[it.kind],
  emphasized: it.unread,
  meta: <RelativeTime value={at(it.min)} />,
  alert: waits(it) ? `waiting ${ago(it.min)}` : undefined,
});

export const kindIcon = (k: RequestKind): ReactNode => <UiIcon name={KIND_ICON[k]} size={14} />;

export const actionsOf = (it: RequestItem, act: (label: string) => void): ActionBarAction[] => {
  const a = (id: string, label: string, kbd: string, variant?: ActionBarAction['variant']) => ({
    id,
    label,
    kbd,
    variant,
    onSelect: () => act(label),
  });
  if (it.kind === 'approval')
    return [a('allow', 'Allow', 'A', 'primary'), a('deny', 'Deny', 'D', 'destructive')];
  if (it.kind === 'question')
    return (it.options ?? []).map((o, i) =>
      a(`o${String(i)}`, o, String(i + 1), i ? 'default' : 'primary')
    );
  if (it.kind === 'review')
    return [a('approve', 'Approve', 'A', 'primary'), a('changes', 'Request changes', 'D')];
  if (it.kind === 'failure') return [a('retry', 'Retry', 'A', 'primary'), a('done', 'Done', 'E')];
  return [a('done', 'Done', 'E', 'primary')];
};

export const tailOf = (it: RequestItem, act: (label: string) => void): ActionBarAction[] => [
  { id: 'snooze', label: 'Snooze', kbd: 'H', onSelect: () => act('Snooze') },
  {
    id: 'read',
    label: it.unread ? 'Mark read' : 'Mark unread',
    kbd: 'U',
    onSelect: () => act(it.unread ? 'Mark read' : 'Mark unread'),
  },
  {
    id: 'details',
    label: 'Details',
    kbd: 'I',
    icon: <UiIcon name="details" />,
    onSelect: () => act('Details'),
  },
];

export const assignMenu = (act: (label: string) => void) => ({
  label: 'Assign',
  kbd: 'G',
  icon: <UiIcon name="forward" />,
  children: ['Ada Lovelace', 'Grace Hopper', 'Alan Turing'].map((n) => (
    <DropdownMenuItem
      key={n}
      icon={<Avatar size="2xs" name={n} aria-hidden="true" />}
      onClick={() => act(`Assigned to ${n}`)}
    >
      {n}
    </DropdownMenuItem>
  )),
});

/** Reading pane header and body; the pane keeps its nodes, only text swaps. */
export const ReadingPane = ({ it }: { it: RequestItem }) => (
  <article
    aria-labelledby="request-title"
    tabIndex={-1}
    className="flex min-w-0 flex-col px-6 pb-7 pt-5 focus-visible:outline-none"
  >
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground">
      <Badge variant={BADGE[it.kind]} className="font-semibold [&_svg]:size-3">
        {kindIcon(it.kind)}
        {KIND_LABEL[it.kind]}
      </Badge>
      {waits(it) && (
        <span className="inline-flex items-center gap-1 text-primary-emphasis">
          <UiIcon name="clock" size={12} />
          waiting {ago(it.min)}
        </span>
      )}
      <span>
        {it.sender}, {it.place}, {it.ref}, <RelativeTime value={at(it.min)} />
      </span>
    </div>
    <h3
      id="request-title"
      className="mb-1.5 mt-2 text-base font-semibold leading-tight text-foreground wrap-anywhere"
    >
      {it.title}
    </h3>
    <p className="m-0 text-ui text-muted-foreground">{it.summary}</p>
    <ContentBlocks blocks={it.body} className="mt-4" key={it.id} />
  </article>
);

export const RequestDetails = ({ it }: { it: RequestItem }) => (
  <Accordion
    type="multiple"
    variant="section"
    level={3}
    storageKey="ds-docs-request-open"
    defaultValue={['source']}
  >
    <AccordionItem value="source">
      <AccordionTrigger summary={it.sender}>Source</AccordionTrigger>
      <AccordionContent>
        <DescriptionList>
          <DescriptionTerm>Sender</DescriptionTerm>
          <DescriptionDetail>{it.sender}</DescriptionDetail>
          <DescriptionTerm>Place</DescriptionTerm>
          <DescriptionDetail>{it.place}</DescriptionDetail>
          <DescriptionTerm>Reference</DescriptionTerm>
          <DescriptionDetail mono copy>
            {it.ref}
          </DescriptionDetail>
        </DescriptionList>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="timing">
      <AccordionTrigger summary={<RelativeTime value={at(it.min)} />}>Timing</AccordionTrigger>
      <AccordionContent>
        <p className="m-0 text-muted-foreground">
          Arrived <RelativeTime value={at(it.min)} />. No reminder is set.
        </p>
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="history">
      <AccordionTrigger summary="2 events">History</AccordionTrigger>
      <AccordionContent>
        <p className="m-0 text-muted-foreground">Created by {it.sender}. Read by nobody yet.</p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
