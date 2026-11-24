'use client';
import {
  Button,
  EntityCard,
  Heading,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../src';
import { HOST_LABEL, StateBadge, Tile, type DemoPackage } from './packages-data';

/** Docs-only: the detail of one package in the InspectorPanel. */
export const PackageDetail = ({ e }: { e: DemoPackage }) => (
  <div className="flex flex-col gap-3">
    <div className="flex gap-3">
      <Tile e={e} size="md" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{e.id}</span>
          <StateBadge e={e} />
        </div>
        <p className="m-0 mt-1 text-ui text-muted-foreground">{e.description}</p>
      </div>
    </div>
    <Accordion
      type="multiple"
      variant="section"
      level={3}
      storageKey="ds-docs-package-open"
      defaultValue={['actions']}
    >
      <AccordionItem value="api">
        <AccordionTrigger summary={<span className="font-mono">{e.api}</span>}>
          API
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">3 routes under {e.api}.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="actions">
        <AccordionTrigger summary={HOST_LABEL[e.host]}>Actions</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-1.5">
            <Button size="sm" variant="outline">
              Open
            </Button>
            <Button size="sm" variant="outline">
              Reload
            </Button>
            <Button size="sm" variant="outline">
              Disable
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="store">
        <AccordionTrigger summary={<span className="font-mono">{e.store}</span>}>
          Store
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">One schema, owned by {e.name}.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="versions">
        <AccordionTrigger
          summary={
            <>
              newest <span className="font-mono">{e.newest ?? e.version}</span>
            </>
          }
        >
          Versions
        </AccordionTrigger>
        <AccordionContent>
          <p className="m-0 font-mono text-xs text-muted-foreground">{e.version}</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="details">
        <AccordionTrigger>Details</AccordionTrigger>
        <AccordionContent>
          <p className="m-0 text-muted-foreground">Hosted on {HOST_LABEL[e.host]}.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const SimpleView = ({
  list,
  onOpen,
}: {
  list: DemoPackage[];
  onOpen: (e: DemoPackage) => void;
}) => (
  <div className="mx-auto flex max-w-[820px] flex-col gap-3 p-5">
    <Heading as="h4">Your packages</Heading>
    {list.map((e) => (
      <EntityCard
        key={e.key}
        title={e.name}
        indicator={<Tile e={e} />}
        description={e.description}
        facts={[
          { label: 'Where', value: HOST_LABEL[e.host] },
          { label: 'Version', value: <span className="font-mono">{e.version}</span> },
          { label: 'State', value: <StateBadge e={e} /> },
        ]}
        onOpen={() => onOpen(e)}
      />
    ))}
  </div>
);
