'use client';
import { useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  HoverCard,
  Modal,
  Popover,
  Tooltip,
  RelativeTime,
} from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);

  return (
    <Block
      caption={
        <>
          The card is <code className="font-mono text-xs">overflow-hidden</code>, short and
          transformed, which clips any overlay that is not portalled. Each overlay renders into{' '}
          <code className="font-mono text-xs">document.body</code>, so it stays whole.
        </>
      }
    >
      <div className="h-28 max-w-md translate-x-0 overflow-hidden rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tooltip content="Not clipped by the card">
            <Button variant="outline" size="sm">
              Tooltip
            </Button>
          </Tooltip>
          <DropdownMenu
            align="start"
            trigger={
              <Button variant="outline" size="sm">
                Menu
              </Button>
            }
          >
            <DropdownMenuLabel>Escapes the card</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Refresh</DropdownMenuItem>
          </DropdownMenu>
          <Popover
            trigger={
              <Button variant="outline" size="sm" onClick={() => setPopoverOpen(!popoverOpen)}>
                Popover
              </Button>
            }
            content={
              <p className="m-0 text-xs text-muted-foreground">
                Anchored to the trigger, rendered on the body.
              </p>
            }
            isOpen={popoverOpen}
            onClose={() => setPopoverOpen(false)}
          />
          <HoverCard trigger={<Button variant="link">@ada</Button>}>
            <p className="m-0 text-xs text-muted-foreground">
              Team lead, last seen <RelativeTime value={Date.now() - 2 * 60_000} />.
            </p>
          </HoverCard>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Modal
          </Button>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Opened from inside the clipped card"
        description="Centred on the viewport, not on the card."
      >
        <div className="flex flex-col items-start gap-3">
          <p className="m-0 text-ui text-muted-foreground">
            Escape closes the top layer only: the menu, then the popover, then this dialog.
          </p>
          <Popover
            side="bottom"
            label="Filters"
            open={nestedOpen}
            onOpenChange={setNestedOpen}
            trigger={
              <Button variant="outline" size="sm" onClick={() => setNestedOpen(!nestedOpen)}>
                Filters
              </Button>
            }
            content={
              <div className="flex items-center gap-2">
                <span className="text-ui text-muted-foreground">Sort by</span>
                <DropdownMenu
                  align="start"
                  trigger={
                    <Button variant="outline" size="sm">
                      Name
                    </Button>
                  }
                >
                  <DropdownMenuItem>Name</DropdownMenuItem>
                  <DropdownMenuItem>Updated</DropdownMenuItem>
                </DropdownMenu>
              </div>
            }
          />
        </div>
      </Modal>
    </Block>
  );
};
