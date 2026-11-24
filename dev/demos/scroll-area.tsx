'use client';
import { RelativeTime, ScrollArea } from '../../src';
import { Block } from '../components/demo';

export const Example = () => (
  <Block caption="A scroll container whose viewport is focusable, so the keyboard can scroll it.">
    <ScrollArea className="h-40 max-w-md rounded-lg border border-border p-3">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-border py-2 last:border-0"
        >
          <span className="text-ui">Event {i + 1}</span>
          <RelativeTime value={Date.now() - i * 60_000} className="text-xs text-muted-foreground" />
        </div>
      ))}
    </ScrollArea>
  </Block>
);
