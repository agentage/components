'use client';
import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogFooter,
  FormField,
  Input,
  Textarea,
} from '../../src';
import { Block, Row } from '../components/demo';

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="A centred dialog with a title, a form and a footer. Escape, a backdrop click or the close button dismisses it.">
      <Button onClick={() => setOpen(true)}>New report</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="New report"
        description="Name the report and describe what it covers."
      >
        <div className="space-y-3">
          <FormField label="Name" required>
            <Input placeholder="Weekly usage" />
          </FormField>
          <FormField label="Summary">
            <Textarea placeholder="What does the report cover?" rows={3} />
          </FormField>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create</Button>
        </DialogFooter>
      </Dialog>
    </Block>
  );
};

export const Variants = () => {
  const [kind, setKind] = useState<'default' | 'destructive' | null>(null);
  return (
    <Block caption="With onConfirm it is a confirm dialog: Cancel and Confirm, focus on the safe action. The tone colours the confirm button.">
      <Row>
        <Button variant="outline" onClick={() => setKind('default')}>
          Publish report
        </Button>
        <Button variant="destructive" onClick={() => setKind('destructive')}>
          Remove report
        </Button>
      </Row>
      <Dialog
        open={kind !== null}
        onOpenChange={() => setKind(null)}
        title={kind === 'destructive' ? 'Remove the report?' : 'Publish the report?'}
        description={
          kind === 'destructive' ? 'The report is deleted for everyone.' : 'Everyone can read it.'
        }
        confirmLabel={kind === 'destructive' ? 'Remove' : 'Publish'}
        tone={kind ?? 'default'}
        onConfirm={() => {}}
      />
    </Block>
  );
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const States = () => {
  const [kind, setKind] = useState<'typed' | 'async' | null>(null);
  return (
    <Block caption="confirmText keeps Confirm disabled until the phrase is retyped exactly. A promise from onConfirm keeps the dialog open with a pending confirm until it settles.">
      <Row>
        <Button variant="destructive" onClick={() => setKind('typed')}>
          Delete folder
        </Button>
        <Button variant="outline" onClick={() => setKind('async')}>
          Archive folder
        </Button>
      </Row>
      <Dialog
        open={kind === 'typed'}
        onOpenChange={() => setKind(null)}
        title="Delete work-notes?"
        description="Every file in this folder is deleted. This cannot be undone."
        tone="destructive"
        confirmText="work-notes"
        confirmLabel="Delete folder"
        onConfirm={() => {}}
      />
      <Dialog
        open={kind === 'async'}
        onOpenChange={() => setKind(null)}
        title="Archive work-notes?"
        description="The folder becomes read-only. It takes a moment."
        confirmLabel="Archive"
        onConfirm={() => wait(1500)}
      />
    </Block>
  );
};

export const Composition = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="Danger zone: a card at the end of a settings page whose action opens a destructive dialog. Every overlay portals to document.body, so a clipping or scrolling parent never cuts it off.">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Actions here cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="m-0 text-ui font-medium">Delete this project</p>
              <p className="m-0 text-xs text-muted-foreground">
                Removes every run, secret and log of my-project.
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete my-project?"
        description="The project and all its data are removed. This cannot be undone."
        tone="destructive"
        confirmText="my-project"
        confirmLabel="Delete project"
        onConfirm={() => {}}
      />
    </Block>
  );
};
