'use client';
import { Fragment, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  ListToolbar,
  ListToolbarEnd,
  NavTree,
  ResizableSplit,
  ToolbarSearch,
  ToolbarToggle,
} from '../../../src';
import { Block } from '../../components/demo';
import { FILE_TREE, firstFile, nodeAt } from '../../lib/files-data';
import {} from '../../lib/ui-icons';
import { Preview, Rows } from '../../lib/file-preview';

export const Example = () => {
  const [open, setOpen] = useState(() => new Set(['src']));
  const [selected, setSelected] = useState(firstFile);
  const [q, setQ] = useState('');
  const [source, setSource] = useState(false);
  const file = nodeAt(selected);
  const parts = selected.split('/');
  const toggle = (path: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (!next.delete(path)) next.add(path);
      return next;
    });
  return (
    <Block caption="Pick a file on the left; the preview changes with the file type.">
      <div className="h-[560px] overflow-hidden rounded-lg border border-border bg-background">
        <ResizableSplit
          storageKey="ds-docs-files-split"
          init={240}
          min={180}
          max={380}
          label="Resize the file list"
        >
          <NavTree aria-label="Files" className="h-full overflow-auto p-2">
            <Rows
              nodes={FILE_TREE}
              base=""
              depth={0}
              q={q.trim().toLowerCase()}
              open={open}
              toggle={toggle}
              selected={selected}
              select={setSelected}
            />
          </NavTree>
          <div className="flex h-full min-h-0 flex-col">
            <ListToolbar aria-label="File controls" className="px-2.5">
              <Breadcrumb variant="path" className="min-w-0 flex-1">
                <BreadcrumbList>
                  {parts.slice(0, -1).map((seg) => (
                    <Fragment key={seg}>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                          {seg}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </Fragment>
                  ))}
                  <BreadcrumbItem>
                    <BreadcrumbPage>{parts[parts.length - 1]}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <ListToolbarEnd>
                <ToolbarSearch value={q} onValueChange={setQ} placeholder="Filter files" />
                <ToolbarToggle pressed={source} onPressedChange={setSource}>
                  Source
                </ToolbarToggle>
              </ListToolbarEnd>
            </ListToolbar>
            <div className="min-h-0 flex-1 overflow-auto p-4">
              {file?.kind && <Preview file={file} source={source} />}
            </div>
          </div>
        </ResizableSplit>
      </div>
    </Block>
  );
};
