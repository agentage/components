'use client';
import { useState } from 'react';
import {
  Button,
  DataView,
  InspectorPanel,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  useAnnounce,
} from '../../../src';
import { Block } from '../../components/demo';
import { packageColumns, packageMenu } from '../../lib/package-columns';
import { INSTALLED, type DemoPackage } from '../../lib/packages-data';
import { PackageDetail, SimpleView } from '../../lib/package-parts';

type Mode = 'simple' | 'advanced' | 'admin';

const MODES: { value: Mode; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'admin', label: 'Admin' },
];

const PANEL =
  'mt-0 flex min-h-0 flex-1 flex-col focus-visible:ring-inset focus-visible:ring-offset-0';

export const Example = () => {
  const [mode, setMode] = useState<Mode>('advanced');
  const [tab, setTab] = useState('installed');
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<DemoPackage>(INSTALLED[0]);
  const [current, setCurrent] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const announce = useAnnounce();
  const act = (e: DemoPackage, what: string) => announce(`${what}: ${e.name}`);
  const columns = packageColumns(act);
  const show = (e: DemoPackage) => {
    setItem(e);
    setOpen(true);
    setCurrent([e.key]);
  };
  const admin = mode === 'admin';
  return (
    <Block caption="Switch between Simple, Advanced and Admin views; Advanced opens an inspector.">
      <div className="flex h-[640px] overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader title="Packages" className="flex-none border-b border-border px-4">
            <ToggleGroup
              aria-label="View"
              variant="segmented"
              value={mode}
              onValueChange={setMode}
              options={MODES}
            />
          </PageHeader>
          {mode === 'simple' ? (
            <div className="min-h-0 flex-1 overflow-auto">
              <SimpleView list={INSTALLED.filter((e) => e.host === 'local')} onOpen={show} />
            </div>
          ) : (
            <Tabs value={tab} onValueChange={setTab} variant="pill" className="min-h-0 flex-1">
              <div className="flex-none border-b border-border px-4 py-3">
                <TabsList aria-label="Sections of the page">
                  <TabsTrigger value="installed" count={INSTALLED.length}>
                    Installed
                  </TabsTrigger>
                  <TabsTrigger value="catalog" count={8}>
                    Catalog
                  </TabsTrigger>
                  <TabsTrigger value="sources" count={2}>
                    Sources
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="installed" className={PANEL}>
                <DataView
                  key={mode}
                  aria-label="Installed packages"
                  className="min-h-0 flex-1"
                  rows={INSTALLED}
                  columns={columns}
                  getRowId={(e) => e.key}
                  rowLabel={(e) => `${e.name} on ${e.host === 'local' ? 'this machine' : 'cloud'}`}
                  searchKeys={['name']}
                  searchPlaceholder="Search packages"
                  defaultGroupBy="host"
                  rowLines={2}
                  selection={admin ? 'multi' : 'single'}
                  selectedIds={admin ? picked : current}
                  onSelectionChange={admin ? setPicked : setCurrent}
                  bulkActions={(rows) => (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        announce(`Turned off ${String(rows.length)} packages`);
                        setPicked([]);
                      }}
                    >
                      Turn off
                    </Button>
                  )}
                  onRowOpen={show}
                  rowMenu={packageMenu}
                  rowMenuLabel={(e) => `Actions for ${e.name}`}
                />
              </TabsContent>
              <TabsContent value="catalog" className="mt-0 p-4 text-ui text-muted-foreground">
                The catalog lists 8 packages. The Installed tab shows the selection patterns.
              </TabsContent>
              <TabsContent value="sources" className="mt-0 p-4 text-ui text-muted-foreground">
                2 sources: the public catalog and a local folder.
              </TabsContent>
            </Tabs>
          )}
        </div>
        <InspectorPanel
          open={open}
          onOpenChange={setOpen}
          title={item.name}
          defaultWidth={420}
          storageKey="ds-docs-catalog-inspector"
        >
          <PackageDetail e={item} />
        </InspectorPanel>
      </div>
    </Block>
  );
};
