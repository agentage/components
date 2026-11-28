'use client';
import type { ReactNode } from 'react';
import {
  Chip,
  ContextMeter,
  IconButton,
  PromptInput,
  type PromptInputProps,
  meterTone,
  cn,
} from '../../../src';
import { KindIcon } from '../../lib/kind-icons';
import { PRESET, SERVERS } from '../../lib/chat-data';

const PATHS = {
  clip: 'M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8',
  copy: 'M8 8h12v12H8zM16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3',
  retry: 'M20 12a8 8 0 1 1-2.4-5.7M20 4v4.5h-4.5',
  expand: 'M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7',
  plus: 'M12 5v14M5 12h14',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  msg: 'M4 5h16v11H9l-5 4z',
  db: 'M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3',
  cpu: 'M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4',
  spark: 'M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8z',
} as const;

export const ChatIcon = ({ name, className }: { name: keyof typeof PATHS; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn('size-3.5 shrink-0', className)}
  >
    <path d={PATHS[name]} />
  </svg>
);

const PRESET_ICON = ['bot', 'file', 'clock'] as const;

/** What opened the chat: the MCP servers and the preset context, one 20 px chip each. */
export const PresetHeader = ({ removable = false }: { removable?: boolean }) => (
  <div className="grid flex-none grid-cols-[56px_minmax(0,1fr)] items-start gap-x-2 gap-y-1.5 border-b border-border px-3.5 py-2">
    <span className="flex h-5 items-center text-xs text-muted-foreground">MCP</span>
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {SERVERS.map((s) => (
        <Chip key={s} size="sm" className="font-mono text-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-success" aria-hidden="true" />
            {s}
          </span>
        </Chip>
      ))}
    </div>
    <span className="flex h-5 items-center text-xs text-muted-foreground">Context</span>
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {PRESET.map((p, i) => (
        <Chip
          key={p}
          size="sm"
          className="text-foreground [&_svg]:size-3"
          onRemove={removable ? () => undefined : undefined}
          removeLabel={`Remove ${p}`}
        >
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <KindIcon name={PRESET_ICON[i] ?? 'file'} />
            <span className="text-foreground">{p}</span>
          </span>
        </Chip>
      ))}
    </div>
  </div>
);

/** The status strip over the composer: context meter, tools, model and the run clock. */
export const Strip = ({
  percent,
  clock,
  meter,
}: {
  percent: number;
  clock?: string;
  meter?: ReactNode;
}) => (
  <div className="-mx-1 mb-0.5 flex h-7 min-w-0 items-center gap-0.5 text-xs text-muted-foreground">
    {meter ?? (
      <span className="flex h-6 items-center gap-1.5 px-1.5">
        <ContextMeter value={percent} />
        <span className={cn('min-w-[26px] tabular-nums', meterTone(percent))}>{percent}%</span>
      </span>
    )}
    <span className="flex h-6 items-center gap-1.5 px-1.5">
      <KindIcon name="plug" />
      11 tools
    </span>
    <span className="flex h-6 items-center gap-1.5 px-1.5">
      <ChatIcon name="cpu" />
      Large
    </span>
    <span className="flex-1" />
    {clock && <span className="px-1.5 font-mono tabular-nums">{clock}</span>}
  </div>
);

/** The composer: strip, prompt and an attach button. */
export const Composer = ({
  percent,
  clock,
  meter,
  ...props
}: PromptInputProps & { percent: number; clock?: string; meter?: ReactNode }) => (
  <div className="flex-none px-3 pb-3">
    <Strip percent={percent} clock={clock} meter={meter} />
    <PromptInput
      attach={
        <IconButton
          icon={<ChatIcon name="clip" />}
          aria-label="Add context"
          onClick={() => undefined}
        />
      }
      {...props}
    />
  </div>
);

/** A framed chat panel: header, preset chips, conversation and composer. */
export const ChatPanel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <section
    aria-label="Chat"
    className={cn(
      'flex h-[640px] min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-ui',
      className
    )}
  >
    <div className="flex h-12 flex-none items-center gap-1.5 border-b border-border pl-3.5 pr-2.5">
      <ChatIcon name="spark" className="size-4 text-primary-emphasis" />
      <span className="flex min-w-0 flex-1 items-baseline gap-1.5 whitespace-nowrap">
        <b className="text-sm font-semibold">Ask</b>
        <span className="truncate text-muted-foreground">on Release notes writer</span>
      </span>
      <IconButton
        icon={<ChatIcon name="expand" />}
        aria-label="Expand with details"
        onClick={() => undefined}
      />
      <IconButton icon={<ChatIcon name="plus" />} aria-label="New chat" onClick={() => undefined} />
    </div>
    {children}
  </section>
);

/** Copy and Retry under an answer. */
export const AnswerActions = () => (
  <>
    <IconButton
      size="sm"
      icon={<ChatIcon name="copy" />}
      aria-label="Copy answer"
      onClick={() => undefined}
    />
    <IconButton
      size="sm"
      icon={<ChatIcon name="retry" />}
      aria-label="Retry"
      onClick={() => undefined}
    />
  </>
);
