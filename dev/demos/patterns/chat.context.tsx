'use client';
import { Button, ContextMeter, Progress, type ProgressSegment, cn, meterTone } from '../../../src';
import { ChatIcon } from './chat.parts';
import { KindIcon } from '../../lib/kind-icons';
import { CONTEXT, CONTEXT_ITEMS, WINDOW, tokensK } from '../../lib/chat-data';

const COLOR: Record<string, Pick<ProgressSegment, 'tone' | 'color'>> = {
  sys: { tone: 'subtle' },
  tools: { tone: 'info' },
  preset: { color: 'var(--color-tag-schedules)' },
  conv: { tone: 'success' },
  res: { color: 'oklch(0.7 0.15 350)' },
};

const used = CONTEXT.reduce((n, c) => n + c.tokens, 0);
export const CONTEXT_PERCENT = Math.round((used / WINDOW) * 100);

const segments: ProgressSegment[] = [
  ...CONTEXT.map((c) => ({ key: c.key, label: c.label, count: c.tokens, ...COLOR[c.key] })),
  { key: 'free', label: 'Free', count: WINDOW - used, color: 'var(--color-accent)' },
];

const Swatch = ({ k }: { k: string }) => {
  const c = COLOR[k];
  return (
    <span
      className={cn(
        'size-2 flex-none rounded-[2px]',
        c?.tone === 'subtle' && 'bg-muted-foreground',
        c?.tone === 'info' && 'bg-info',
        c?.tone === 'success' && 'bg-success'
      )}
      style={{ backgroundColor: c?.color }}
      aria-hidden="true"
    />
  );
};

/** Where the context window goes: the ring, a stacked bar and one row per category. */
export const ContextBreakdown = ({ popover = false }: { popover?: boolean }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <ContextMeter value={CONTEXT_PERCENT} size="md" />
      <div>
        <div className={cn('text-xl font-bold tabular-nums', meterTone(CONTEXT_PERCENT))}>
          {CONTEXT_PERCENT}%
        </div>
        <div className="text-xs text-muted-foreground">
          {tokensK(used)} of {tokensK(WINDOW)} tokens
        </div>
      </div>
    </div>
    <Progress segments={segments} aria-label="Context window by category" />
    <ul className="m-0 flex list-none flex-col p-0">
      {CONTEXT.map((c) => (
        <li key={c.key} className="flex h-7 items-center gap-2 text-xs">
          <Swatch k={c.key} />
          <span className="min-w-0 flex-1 truncate">{c.label}</span>
          <span className="w-12 text-right tabular-nums text-muted-foreground">
            {tokensK(c.tokens)}
          </span>
          <span className="w-9 text-right tabular-nums text-muted-foreground">
            {Math.round((c.tokens / used) * 100)}%
          </span>
        </li>
      ))}
    </ul>
    <p className="m-0 text-xs leading-normal text-warning">
      Quality can drop as the window fills. Compact the conversation to free space.
    </p>
    <div className="flex flex-wrap gap-1.5">
      <Button variant="outline">Compact conversation</Button>
      {popover && (
        <Button variant="outline">
          <ChatIcon name="expand" />
          All details
        </Button>
      )}
    </div>
  </div>
);

/** What is in the window, one 28 px row per item. */
export const ContextItems = () => (
  <div className="flex flex-col gap-1">
    <div className="flex h-5 items-center justify-between text-2xs uppercase tracking-[0.08em] text-muted-foreground">
      <span>Items</span>
      <span>{CONTEXT_ITEMS.length}</span>
    </div>
    <ul className="m-0 flex list-none flex-col divide-y divide-border rounded-lg border border-border p-0">
      {CONTEXT_ITEMS.map((it) => (
        <li key={it.name} className="flex h-7 min-w-0 items-center gap-2 px-2.5 text-xs">
          <span className="text-muted-foreground [&_svg]:size-3.5">
            <KindIcon name={it.by === 'tool' ? 'plug' : 'file'} />
          </span>
          <span className="min-w-0 flex-1 truncate">{it.name}</span>
          <span className="text-muted-foreground">{it.by}</span>
          <span className="w-9 text-right tabular-nums text-muted-foreground">{it.tokens}</span>
        </li>
      ))}
    </ul>
  </div>
);
