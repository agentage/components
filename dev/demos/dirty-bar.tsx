'use client';
import { useState } from 'react';
import { Button, DirtyBar, Input, Label, useAnnounce } from '../../src';
import { Block } from '../components/demo';

const SAVED = 'Daily digest';

export const Example = () => {
  const [saved, setSaved] = useState(SAVED);
  const [name, setName] = useState(SAVED);
  const [pending, setPending] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const announce = useAnnounce();
  const dirty = name !== saved;

  const save = (): void => {
    setPending(true);
    setTimeout(() => {
      setSaved(name);
      setPending(false);
      setLeaving(false);
      announce(`Saved ${name}`);
    }, 600);
  };
  const discard = (): void => {
    setName(saved);
    setLeaving(false);
    announce('Changes discarded');
  };

  return (
    <Block caption="Edit the name and the bar slides in with no layout shift; Save shows a pending state.">
      <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-background p-4">
        <div className="max-w-xs space-y-2">
          <Label htmlFor="dirty-demo-name">Digest name</Label>
          <Input id="dirty-demo-name" value={name} onChange={(e) => setName(e.target.value)} />
          <p className="m-0 text-xs text-muted-foreground">Saved value: {saved}</p>
          <Button variant="outline" size="sm" disabled={!dirty} onClick={() => setLeaving(true)}>
            Try to leave
          </Button>
        </div>
        <DirtyBar
          dirty={dirty}
          pending={pending}
          leaving={leaving && dirty}
          onSave={save}
          onDiscard={discard}
          onStay={() => setLeaving(false)}
          onLeave={discard}
        />
      </div>
    </Block>
  );
};
