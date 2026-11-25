'use client';
import { useRef, useState, type MouseEvent } from 'react';
import {
  Button,
  DirtyBar,
  Input,
  Section,
  SectionIndex,
  Switch,
  TreeSelect,
  useAnnounce,
  useScrollSpy,
} from '../../../src';
import { Block } from '../../components/demo';
import { PathList } from '../../lib/path-list';
import {
  ACCESS,
  Choice,
  entryOf,
  Field,
  folderPath,
  FOLDER_TREE,
  LANGUAGES,
  SETTINGS_SAVED,
  SETTINGS_SECTIONS,
  VISIBILITY,
  type SettingsValues,
} from '../../lib/folders-data';
import { SchedulePreview } from '../../lib/schedule-preview';
import { UiIcon } from '../../lib/ui-icons';

const IDS = SETTINGS_SECTIONS.map((s) => s.id);

export const Example = () => {
  const [saved, setSaved] = useState<SettingsValues>(SETTINGS_SAVED);
  const [v, setV] = useState<SettingsValues>(SETTINGS_SAVED);
  const root = useRef<HTMLDivElement>(null);
  const active = useScrollSpy(IDS, { root, offset: 24 });
  const announce = useAnnounce();
  const set =
    <K extends keyof SettingsValues>(k: K) =>
    (value: SettingsValues[K]) =>
      setV((s) => ({ ...s, [k]: value }));
  const changed = (k: keyof SettingsValues) => JSON.stringify(v[k]) !== JSON.stringify(saved[k]);
  const dirty = (Object.keys(v) as (keyof SettingsValues)[]).some(changed);
  const jump = (id: string, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    const box = root.current;
    if (el && box) box.scrollTo({ top: el.offsetTop - box.offsetTop - 8, behavior: 'smooth' });
  };
  return (
    <Block caption="Change any field: the index shows an unsaved dot and the dirty bar slides in.">
      <div className="relative grid h-[560px] grid-cols-[172px_minmax(0,1fr)] gap-6 overflow-hidden rounded-lg border border-border bg-background p-4">
        <SectionIndex
          aria-label="Settings sections"
          className="self-start"
          activeId={active}
          onSelect={jump}
          sections={SETTINGS_SECTIONS.map((s) => ({
            id: s.id,
            label: s.label,
            dirty: s.keys.some((k) => changed(k)),
          }))}
        />
        <div
          ref={root}
          className="overflow-y-auto pb-16 pr-2"
          role="region"
          aria-label="Settings"
          tabIndex={0}
        >
          <Section
            id="set-general"
            title="General"
            description="The name and the owner of this site."
          >
            <Field label="Name">
              <Input value={v.name} onChange={(e) => set('name')(e.target.value)} />
            </Field>
            <Field label="Owner" hint="Gets the billing mail.">
              <Input value={v.owner} type="email" onChange={(e) => set('owner')(e.target.value)} />
            </Field>
            <Field label="Language">
              <Choice value={v.language} onChange={set('language')} items={LANGUAGES} />
            </Field>
          </Section>
          <Section
            id="set-access"
            title="Access"
            description="Who can open the site and what they can do."
          >
            <Field label="Visibility">
              <Choice value={v.visibility} onChange={set('visibility')} items={VISIBILITY} />
            </Field>
            <Field label="Allow sharing" hint="Members can share single documents.">
              <Switch checked={v.sharing} onCheckedChange={set('sharing')} />
            </Field>
            <Field label="Require sign-in">
              <Switch checked={v.signIn} onCheckedChange={set('signIn')} />
            </Field>
          </Section>
          <Section id="set-folders" title="Folders" description="The folders this site can see.">
            <PathList
              label="Mounted folders"
              entries={v.folders}
              accessOptions={ACCESS}
              onAccessChange={(id, access) =>
                set('folders')(v.folders.map((e) => (e.id === id ? { ...e, access } : e)))
              }
              onRemove={(id) => {
                set('folders')(v.folders.filter((e) => e.id !== id));
                announce(`Removed ${id.replace('|', ' ')}`);
              }}
              empty="No folders yet."
              add={
                <TreeSelect
                  nodes={FOLDER_TREE}
                  title="Add a folder"
                  labels={{ search: 'Search folders' }}
                  disabledIds={v.folders.map((e) => e.id)}
                  formatPath={folderPath}
                  onValueChange={(ids) => {
                    set('folders')([...v.folders, ...ids.map((id) => entryOf(id))]);
                    announce(`Added ${String(ids.length)} folders, read only`);
                  }}
                  trigger={
                    <Button variant="outline">
                      <UiIcon name="plus" />
                      Add folder
                    </Button>
                  }
                />
              }
            />
          </Section>
          <Section
            id="set-notifications"
            title="Notifications"
            description="What we send and where."
          >
            <Field label="Mail on changes">
              <Switch checked={v.email} onCheckedChange={set('email')} />
            </Field>
            <Field label="Weekly summary" hint="Sent on the schedule below.">
              <Switch checked={v.weekly} onCheckedChange={set('weekly')} />
            </Field>
            <SchedulePreview layout="row" />
          </Section>
        </div>
        <DirtyBar
          dirty={dirty}
          onSave={() => {
            setSaved(v);
            announce('Settings saved');
          }}
          onDiscard={() => {
            setV(saved);
            announce('Changes discarded');
          }}
        />
      </div>
    </Block>
  );
};
