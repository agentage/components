'use client';
import { useState } from 'react';
import { Avatar, Badge, Button, FormField, Input, Separator, Sheet, Textarea } from '../../src';
import { Block, Row } from '../components/demo';

type Side = 'left' | 'right';

const Body = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <Avatar name="Ada Lovelace" size="lg" />
      <div>
        <p className="m-0 text-ui font-semibold">Ada Lovelace</p>
        <p className="m-0 text-xs text-muted-foreground">Team lead, joined 2024</p>
      </div>
    </div>
    <Separator />
    <FormField label="Name">
      <Input defaultValue="Ada Lovelace" />
    </FormField>
    <FormField label="Bio">
      <Textarea defaultValue="Writes the weekly report." rows={3} />
    </FormField>
  </div>
);

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="A dialog docked to the right edge, with extra title-bar content next to the close button.">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Profile"
        description="View and edit the profile."
        header={<Badge variant="secondary">Admin</Badge>}
      >
        <Body />
      </Sheet>
    </Block>
  );
};

export const Variants = () => {
  const [side, setSide] = useState<Side | null>(null);
  return (
    <Block caption="The side prop docks the sheet to the left or the right edge. Right is the default.">
      <Row>
        {(['left', 'right'] as const).map((s) => (
          <Button key={s} variant="outline" onClick={() => setSide(s)}>
            Side {s}
          </Button>
        ))}
      </Row>
      <Sheet
        open={side !== null}
        onOpenChange={() => setSide(null)}
        side={side ?? 'right'}
        title={`Docked ${side ?? 'right'}`}
      >
        <p className="m-0 text-ui text-muted-foreground">The sheet is 320 px wide.</p>
      </Sheet>
    </Block>
  );
};
