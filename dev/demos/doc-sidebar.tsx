'use client';
import { useState } from 'react';
import { DocSidebar, DocSidebarGroup, DocSidebarItem, Heading, Prose } from '../../src';
import { Block } from '../components/demo';

const GROUPS = [
  { title: 'Getting started', items: ['Introduction', 'Install the CLI', 'Sign in'] },
  { title: 'Reference', items: ['Overview', 'Schemas', 'Errors', 'Rate limits'] },
];

export const Example = () => {
  const [active, setActive] = useState('Introduction');
  return (
    <Block caption="A documentation layout: grouped links on the left, with the current page marked active, and the content on the right.">
      <div className="flex min-h-80 overflow-hidden rounded-lg border border-border">
        <DocSidebar className="border-r" width="w-56">
          {GROUPS.map((g) => (
            <DocSidebarGroup key={g.title} title={g.title}>
              {g.items.map((item) => (
                <DocSidebarItem
                  key={item}
                  href="#doc-sidebar"
                  active={item === active}
                  depth={item === 'Schemas' || item === 'Errors' ? 1 : 0}
                  onClick={() => {
                    setActive(item);
                  }}
                >
                  {item}
                </DocSidebarItem>
              ))}
            </DocSidebarGroup>
          ))}
        </DocSidebar>
        <div className="flex-1 p-6">
          <Heading as="h2">{active}</Heading>
          <Prose className="mt-3">
            <p>
              The sidebar supports grouped sections, an active state and nested items through the{' '}
              <code>depth</code> prop.
            </p>
          </Prose>
        </div>
      </div>
    </Block>
  );
};
