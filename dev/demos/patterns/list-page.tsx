'use client';
import { useState } from 'react';
import { Button, DataView, PageHeader } from '../../../src';
import { Block } from '../../components/demo';
import { UiIcon } from '../../lib/ui-icons';
import { SERVICES } from '../../lib/services-data';
import { serviceColumns, serviceMenu, ServiceCard } from '../../lib/services-list-parts';

const useServices = () => {
  const [rows, setRows] = useState(SERVICES);
  const [picked, setPicked] = useState<string[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const setEnabled = (id: string, on: boolean) =>
    setRows((list) => list.map((s) => (s.id === id ? { ...s, enabled: on } : s)));
  const pick = (id: string, on: boolean) =>
    setPicked((l) => (on ? [...l, id] : l.filter((x) => x !== id)));
  return { rows, picked, pick, opened, setOpened, setEnabled };
};

export const Example = () => {
  const s = useServices();
  return (
    <Block caption="Search, filter with counts, sort and group from Display, then switch to cards. Click a row to open it; the switches and menus work on the sample data.">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <PageHeader title="Services" className="border-b border-border px-4">
          <Button variant="outline-primary">
            <UiIcon name="plus" />
            New service
          </Button>
        </PageHeader>
        <DataView
          aria-label="Services"
          className="h-[505px]"
          rows={s.rows}
          columns={serviceColumns(true, s.setEnabled)}
          getRowId={(row) => row.id}
          views={['table', 'cards']}
          defaultState={{ sort: { key: 'name', dir: 'asc' } }}
          actions={{ open: (row) => s.setOpened(row.id), menu: serviceMenu }}
          renderCard={(row) => (
            <ServiceCard
              service={row}
              selected={s.picked.includes(row.id)}
              onSelectedChange={(on) => s.pick(row.id, on)}
              onEnabledChange={(on) => s.setEnabled(row.id, on)}
              onOpen={() => s.setOpened(row.id)}
            />
          )}
          empty={<p className="m-0 p-6 text-ui text-muted-foreground">No services match.</p>}
        />
      </div>
    </Block>
  );
};
