'use client';
import { useState } from 'react';
import { NavRow, NavTree, StatusGlyph } from '../../src';
import { Block } from '../components/demo';
import { KindIcon } from '../lib/kind-icons';

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-72 rounded-lg border border-border bg-background">{children}</div>
);

export const Example = () => {
  const [selected, setSelected] = useState('all');
  const row = (id: string) => ({
    selected: selected === id,
    onClick: () => {
      setSelected(id);
    },
  });
  return (
    <Block caption="A 28 px row with an icon and a label. Click a row, or Tab in and use Up, Down, Home and End.">
      <Frame>
        <NavTree aria-label="Views">
          <NavRow icon={<KindIcon name="file" />} {...row('all')}>
            All items
          </NavRow>
          <NavRow icon={<KindIcon name="clock" />} {...row('recent')}>
            Recent
          </NavRow>
          <NavRow icon={<KindIcon name="flag" />} {...row('flagged')}>
            Flagged
          </NavRow>
        </NavTree>
      </Frame>
    </Block>
  );
};

export const Variants = () => (
  <Block caption="Counts are quiet, the pill is loud, and the dot marks unsaved changes.">
    <Frame>
      <NavTree aria-label="Row parts">
        <NavRow icon={<KindIcon name="file" />} count={12}>
          With a count
        </NavRow>
        <NavRow icon={<KindIcon name="flag" />} pill={3}>
          With a pill
        </NavRow>
        <NavRow icon={<KindIcon name="folder" />} dirty>
          With unsaved changes
        </NavRow>
        <NavRow
          icon={<StatusGlyph shape="disc" tone="success" />}
          count={<KindIcon name="clock" />}
        >
          With a status glyph
        </NavRow>
      </NavTree>
    </Frame>
  </Block>
);

export const States = () => (
  <Block caption="The selected row gets an accent background and an accent icon.">
    <Frame>
      <NavTree aria-label="Row states">
        <NavRow icon={<KindIcon name="file" />}>Default</NavRow>
        <NavRow icon={<KindIcon name="file" />} selected>
          Selected
        </NavRow>
        <NavRow icon={<StatusGlyph shape="disc" tone="primary" pulse />}>In progress</NavRow>
      </NavTree>
    </Frame>
  </Block>
);

export const Composition = () => {
  const [selected, setSelected] = useState('digest');
  const [open, setOpen] = useState({ views: true, services: true });
  const toggle = (k: keyof typeof open) => () => {
    setOpen((o) => ({ ...o, [k]: !o[k] }));
  };
  const row = (id: string) => ({
    selected: selected === id,
    onClick: () => {
      setSelected(id);
    },
  });
  return (
    <Block caption="Depth indents the children. Left goes to the parent or collapses, Right expands or enters the first child.">
      <Frame>
        <NavTree aria-label="Services pane">
          <NavRow expanded={open.views} onToggle={toggle('views')} {...row('views')}>
            Views
          </NavRow>
          {open.views && (
            <>
              <NavRow depth={1} icon={<KindIcon name="file" />} count={3} {...row('all')}>
                All services
              </NavRow>
              <NavRow depth={1} icon={<KindIcon name="flag" />} pill={1} {...row('failed')}>
                Failed
              </NavRow>
            </>
          )}
          <NavRow expanded={open.services} onToggle={toggle('services')} {...row('services')}>
            Services
          </NavRow>
          {open.services && (
            <>
              <NavRow
                depth={1}
                icon={<StatusGlyph shape="disc" tone="success" />}
                dirty
                {...row('digest')}
              >
                Daily digest
              </NavRow>
              <NavRow
                depth={1}
                icon={<StatusGlyph shape="disc" tone="primary" pulse />}
                {...row('triage')}
              >
                Issue triage
              </NavRow>
              <NavRow depth={1} icon={<StatusGlyph shape="ring" tone="muted" />} {...row('notes')}>
                Release notes
              </NavRow>
            </>
          )}
        </NavTree>
      </Frame>
    </Block>
  );
};
