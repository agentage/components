'use client';
import { useState } from 'react';
import { AlertDialog, Button } from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="A confirm dialog. Focus starts on the safe action, so Enter never confirms a deletion by accident.">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete folder
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this folder?"
        description="The folder and every file in it are removed. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {}}
      />
    </Block>
  );
};

export const Variants = () => {
  const [kind, setKind] = useState<'default' | 'destructive' | null>(null);
  return (
    <Block caption="The default variant confirms a normal action, the destructive variant a removal.">
      <Row>
        <Button variant="outline" onClick={() => setKind('default')}>
          Publish report
        </Button>
        <Button variant="destructive" onClick={() => setKind('destructive')}>
          Remove report
        </Button>
      </Row>
      <AlertDialog
        open={kind !== null}
        onOpenChange={() => setKind(null)}
        title={kind === 'destructive' ? 'Remove the report?' : 'Publish the report?'}
        description={
          kind === 'destructive' ? 'The report is deleted for everyone.' : 'Everyone can read it.'
        }
        confirmLabel={kind === 'destructive' ? 'Remove' : 'Publish'}
        variant={kind ?? 'default'}
        onConfirm={() => {}}
      />
    </Block>
  );
};
