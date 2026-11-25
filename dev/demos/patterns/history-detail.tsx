'use client';
import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DataView,
  DescriptionDetail,
  DescriptionList,
  DescriptionTerm,
  LogView,
  PageHeader,
  RelativeTime,
  Step,
  StepList,
  StatusGlyph,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../src';
import { Block } from '../../components/demo';
import { logLines } from '../../lib/logs-data';
import { RESULT_GLYPH } from '../../lib/result-status';
import { BUILDS, Build, COLUMNS, NOW, duration, menu } from '../../lib/history-data';

const Detail = ({ build, onBack }: { build: Build; onBack: () => void }) => {
  const lines = useMemo(() => logLines(400), []);
  const glyph = RESULT_GLYPH[build.status];
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Breadcrumb className="px-4 pt-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
            >
              History
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{build.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader
        icon={<StatusGlyph {...glyph} size="md" />}
        title={build.title}
        description={`${build.id} on ${build.branch} by ${build.author}`}
        className="px-4"
      />
      <Tabs defaultValue="logs" className="flex min-h-0 flex-1 flex-col px-4 pb-3">
        <TabsList>
          <TabsTrigger value="logs" count={lines.length}>
            Logs
          </TabsTrigger>
          <TabsTrigger value="steps" count={4}>
            Steps
          </TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="min-h-0 flex-1 pt-3">
          <div className="h-full rounded-lg border border-border bg-card">
            <LogView lines={lines} className="h-full" aria-label={`Log of ${build.id}`} />
          </div>
        </TabsContent>
        <TabsContent value="steps" className="pt-3">
          <StepList glyphs footer={`Total ${duration(build.seconds)}`}>
            <Step label="Install" offset="+0:00" duration="12s" status="ok" />
            <Step label="Type check" offset="+0:12" duration="18s" status="ok" />
            <Step
              label="Test"
              offset="+0:30"
              duration="41s"
              status={build.status === 'failed' ? 'error' : 'ok'}
              errorLabel="2 tests failed"
            />
            <Step
              label="Publish"
              offset="+1:11"
              status={build.status === 'active' ? 'running' : 'pending'}
            />
          </StepList>
        </TabsContent>
        <TabsContent value="summary" className="pt-3">
          <DescriptionList labelWidth="md">
            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetail>
              <span className="flex items-center gap-2">
                <StatusGlyph {...glyph} />
                {glyph.label}
              </span>
            </DescriptionDetail>
            <DescriptionTerm>Started</DescriptionTerm>
            <DescriptionDetail>
              <RelativeTime value={NOW - build.min * 60_000} />
            </DescriptionDetail>
            <DescriptionTerm>Duration</DescriptionTerm>
            <DescriptionDetail>{duration(build.seconds)}</DescriptionDetail>
            <DescriptionTerm>Branch</DescriptionTerm>
            <DescriptionDetail mono>{build.branch}</DescriptionDetail>
          </DescriptionList>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const Example = () => {
  const [open, setOpen] = useState<Build | null>(null);
  return (
    <Block caption="Filter the history table by status, branch or author, then open a row for its detail.">
      <div className="h-[600px] overflow-hidden rounded-lg border border-border bg-background">
        {open ? (
          <Detail build={open} onBack={() => setOpen(null)} />
        ) : (
          <DataView
            aria-label="History"
            className="h-full"
            rows={BUILDS}
            columns={COLUMNS}
            getRowId={(b) => b.id}
            actions={{ open: setOpen, menu }}
          />
        )}
      </div>
    </Block>
  );
};
