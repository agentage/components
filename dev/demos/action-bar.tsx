'use client';
import { useRef, useState } from 'react';
import { ActionBar, DropdownMenuItem, type ActionBarAction } from '../../src';
import { Block } from '../components/demo';
import { UiIcon } from '../lib/ui-icons';

const useLog = () => {
  const [last, setLast] = useState('Nothing yet');
  const a = (
    id: string,
    label: string,
    kbd?: string,
    variant?: ActionBarAction['variant']
  ): ActionBarAction => ({ id, label, kbd, variant, onSelect: () => setLast(label) });
  return { last, a };
};

const Frame = ({ children, width }: { children: React.ReactNode; width?: number }) => (
  <div className="overflow-hidden rounded-lg border border-border" style={{ width }}>
    {children}
  </div>
);

export const Example = () => {
  const { last, a } = useLog();
  const scope = useRef<HTMLDivElement>(null);
  const menu = {
    label: 'Assign',
    kbd: 'G',
    icon: <UiIcon name="forward" />,
    children: ['Ada Lovelace', 'Grace Hopper'].map((n) => (
      <DropdownMenuItem key={n}>{n}</DropdownMenuItem>
    )),
  };
  const tail = [a('snooze', 'Snooze', 'H'), a('unread', 'Mark unread', 'U')];
  return (
    <div className="space-y-5">
      <Block
        caption={
          <>
            A 51 px bar with 28 px buttons. With hotkeys on, each button shows its key; here the
            keys work while focus is in the bar. Last action:{' '}
            <span className="text-foreground">{last}</span>.
          </>
        }
      >
        <Frame>
          <div ref={scope}>
            <ActionBar
              actions={[a('allow', 'Allow', 'A', 'primary'), a('deny', 'Deny', 'D', 'destructive')]}
              menu={menu}
              tail={tail}
              hotkeys
              hotkeyScope={scope}
            />
          </div>
        </Frame>
      </Block>
      <Block caption="A question: one button per option, and the first is primary.">
        <Frame>
          <ActionBar
            actions={[
              a('weekly', 'Weekly', '1', 'primary'),
              a('monthly', 'Monthly', '2'),
              a('later', 'Decide later', '3'),
            ]}
            tail={tail}
          />
        </Frame>
      </Block>
    </div>
  );
};

export const Sizes = () => {
  const { a } = useLog();
  const tail = [a('snooze', 'Snooze', 'H'), a('unread', 'Mark unread', 'U')];
  return (
    <Block caption="Narrow panes: at 460 px the tail moves into More, and at 300 px the secondary actions follow. The row never wraps.">
      <div className="flex flex-wrap items-start gap-4">
        {[460, 300].map((w) => (
          <Frame key={w} width={w}>
            <ActionBar
              aria-label={`Actions, ${String(w)} px`}
              actions={[
                a('approve', 'Approve', 'A', 'primary'),
                a('changes', 'Request changes', 'D'),
              ]}
              tail={tail}
            />
          </Frame>
        ))}
      </div>
    </Block>
  );
};
