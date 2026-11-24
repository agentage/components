'use client';
import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  toolbarIconButtonVariants,
} from '../../src';
import { Block, Row } from '../components/demo';
import { UiIcon } from '../lib/ui-icons';

const MoreIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M5 12h.01M12 12h.01M19 12h.01" />
  </svg>
);

export const Example = () => (
  <Block caption="Items with leading icons, a label, a separator and a destructive item. The menu opens 6 px below the trigger and focuses the first item.">
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm">
          Actions
        </Button>
      }
    >
      <DropdownMenuLabel>Report actions</DropdownMenuLabel>
      <DropdownMenuItem icon={<UiIcon name="eye" />}>View details</DropdownMenuItem>
      <DropdownMenuItem icon={<UiIcon name="download" />}>Download</DropdownMenuItem>
      <DropdownMenuItem icon={<UiIcon name="refresh" />}>Refresh</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Delete report</DropdownMenuItem>
    </DropdownMenu>
  </Block>
);

export const States = () => (
  <Block caption="A disabled item is skipped by the keyboard and ignores clicks. An item without an icon keeps its text aligned with the others.">
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm">
          With a disabled item
        </Button>
      }
    >
      <DropdownMenuItem icon={<UiIcon name="details" />}>Open</DropdownMenuItem>
      <DropdownMenuItem>Rename</DropdownMenuItem>
      <DropdownMenuItem disabled>Share (not allowed)</DropdownMenuItem>
    </DropdownMenu>
  </Block>
);

export const Composition = () => {
  const [status, setStatus] = useState<string[]>(['paused']);
  const [sort, setSort] = useState('name');
  const toggle = (v: string) =>
    setStatus((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  return (
    <div className="space-y-5">
      <Block caption="Checkbox and radio items keep the menu open, so several choices fit in one visit.">
        <DropdownMenu
          align="start"
          trigger={
            <Button variant="outline" size="sm">
              Filter and sort
            </Button>
          }
        >
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {['active', 'paused', 'failed'].map((v) => (
            <DropdownMenuCheckboxItem
              key={v}
              checked={status.includes(v)}
              onCheckedChange={() => toggle(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuRadioGroup aria-label="Sort by" value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenu>
      </Block>
      <Block caption="A page menu behind an icon button at the right edge. It aligns to the trigger and stays inside the viewport.">
        <Row className="h-12 justify-end rounded-lg border border-border px-3">
          <DropdownMenu
            aria-label="More"
            trigger={
              <button
                type="button"
                aria-label="More actions"
                className={toolbarIconButtonVariants()}
              >
                <MoreIcon />
              </button>
            }
          >
            <DropdownMenuItem icon={<UiIcon name="globe" />}>Copy link</DropdownMenuItem>
            <DropdownMenuItem icon={<UiIcon name="help" />}>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Reset sample data</DropdownMenuItem>
          </DropdownMenu>
        </Row>
      </Block>
    </div>
  );
};
