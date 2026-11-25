'use client';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  Badge,
  Button,
  FormField,
  Input,
  Sheet,
  Textarea,
} from '../../src';
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
    <div role="none" className="h-px w-full bg-border" />
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
    <Block caption="A modal panel docked to the right edge, with extra title-bar actions next to the close button.">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open sheet
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Profile"
        description="View and edit the profile."
        actions={<Badge variant="secondary">Admin</Badge>}
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

export const Composition = () => {
  // Opens after mount on wide screens only: below 760 px the panel is a full-screen sheet.
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 760) setOpen(false);
  }, []);
  return (
    <Block caption="Docked mode: an in-page right panel for the selected item. Drag or arrow-key its left edge to resize it; below 760 px it covers the screen as a dialog.">
      <div className="flex h-[420px] overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2 p-4">
          <Button variant="outline" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Close the panel' : 'Open the panel'}
          </Button>
          <p className="m-0 text-ui text-muted-foreground">
            The page content keeps its width while the panel moves.
          </p>
        </div>
        <Sheet
          mode="docked"
          open={open}
          onOpenChange={setOpen}
          title="Billing service"
          storageKey="ds-docs-inspector"
        >
          <p className="m-0 mb-3 text-muted-foreground">
            Handles invoices, receipts and payment reminders.
          </p>
          <Accordion type="multiple" variant="section" level={3} defaultValue={['routes']}>
            <AccordionItem value="routes">
              <AccordionTrigger summary="3 routes">Routes</AccordionTrigger>
              <AccordionContent>
                <p className="m-0 text-muted-foreground">Invoices, receipts and reminders.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="store">
              <AccordionTrigger summary="2 tables">Storage</AccordionTrigger>
              <AccordionContent>
                <p className="m-0 text-muted-foreground">Invoice and payment tables.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Sheet>
      </div>
    </Block>
  );
};
