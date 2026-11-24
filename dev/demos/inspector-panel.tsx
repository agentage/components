'use client';
import { useEffect, useState } from 'react';
import {
  Button,
  InspectorPanel,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  // Opens after mount on wide screens only: below 760 px the panel is a full-screen sheet.
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (window.innerWidth < 760) setOpen(false);
  }, []);
  return (
    <Block caption="A docked right panel; drag or arrow-key its left edge to resize it.">
      <div className="flex h-[420px] overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2 p-4">
          <Button variant="outline" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Close the panel' : 'Open the panel'}
          </Button>
          <p className="m-0 text-ui text-muted-foreground">
            The page content keeps its width while the panel moves.
          </p>
        </div>
        <InspectorPanel
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
        </InspectorPanel>
      </div>
    </Block>
  );
};
