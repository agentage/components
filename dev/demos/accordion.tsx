'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  InlineCode,
} from '../../src';
import { Block } from '../components/demo';
import { KindIcon } from '../lib/kind-icons';

const FRAME = 'max-w-md rounded-lg border border-border px-4';

export const Example = () => (
  <Block
    caption="Single mode: one item open at a time. Every header is a Tab stop; Up, Down, Home and End also move between headers."
    className={FRAME}
  >
    <Accordion defaultValue={['q1']}>
      <AccordionItem value="q1">
        <AccordionTrigger>What is a workspace?</AccordionTrigger>
        <AccordionContent>
          A shared place where a team keeps its documents and settings.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Install the tool with <InlineCode>npm install</InlineCode>, then start it with{' '}
          <InlineCode>npm start</InlineCode>.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q3">
        <AccordionTrigger>Can I invite people?</AccordionTrigger>
        <AccordionContent>Yes. Open Team settings and add their email addresses.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </Block>
);

export const Variants = () => (
  <Block caption="Type multiple lets any number of items stay open." className={FRAME}>
    <Accordion type="multiple" defaultValue={['a', 'b']}>
      <AccordionItem value="a">
        <AccordionTrigger>Overview</AccordionTrigger>
        <AccordionContent>A short summary of the record.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>History</AccordionTrigger>
        <AccordionContent>Created on 22 Nov, edited twice.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Access</AccordionTrigger>
        <AccordionContent>Three people can edit.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </Block>
);

export const States = () => (
  <Block
    caption="Count adds a quiet number to a trigger, and a disabled item cannot open."
    className={FRAME}
  >
    <Accordion>
      <AccordionItem value="files">
        <AccordionTrigger count={3}>Files</AccordionTrigger>
        <AccordionContent>Report, budget and handbook.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="locked" disabled>
        <AccordionTrigger>Locked section</AccordionTrigger>
        <AccordionContent>Not available.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </Block>
);

const SECTION_FRAME = 'max-w-[384px] rounded-lg border border-border bg-card px-[18px] py-4';

export const Composition = () => (
  <Block
    caption="Section headers hold a chevron, icon, title and summary; storageKey keeps the open ones."
    className={SECTION_FRAME}
  >
    <Accordion
      type="multiple"
      variant="section"
      level={3}
      storageKey="ds-docs-accordion-sections"
      defaultValue={['pages']}
    >
      <AccordionItem value="api">
        <AccordionTrigger summary={<span className="font-mono">/api/root</span>}>
          Routes
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">
            3 routes: GET /, GET /health, POST /subscribe.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="pages">
        <AccordionTrigger icon={<KindIcon name="folder" />} summary="3 pages">
          Pages
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">The site, the people page and the settings.</p>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline">
              Open
            </Button>
            <Button size="sm" variant="outline">
              Reload
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="files">
        <AccordionTrigger icon={<KindIcon name="file" />} summary="14 files">
          Files
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">Sorted by date.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="details">
        <AccordionTrigger>Details</AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">Public, MIT, maintained by the platform team.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Block>
);
