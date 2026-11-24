'use client';
import { useState } from 'react';
import { Button, Combobox, FormField, Modal, ModalFooter, Textarea } from '../../src';
import { Block, Row } from '../components/demo';

type ModalSize = 'sm' | 'md' | 'lg';

const TEAMS = [
  { value: 'design', label: 'Design team' },
  { value: 'support', label: 'Support team' },
];

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="A centred dialog with a title, a form and a footer. Escape or the close button dismisses it.">
      <Button onClick={() => setOpen(true)}>New report</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="New report"
        description="Pick a team and describe what the report covers."
      >
        <div className="space-y-3">
          <FormField label="Team" required>
            <Combobox
              value=""
              onValueChange={() => {}}
              placeholder="Select a team..."
              options={TEAMS}
            />
          </FormField>
          <FormField label="Summary">
            <Textarea placeholder="What does the report cover?" rows={3} />
          </FormField>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Create</Button>
        </ModalFooter>
      </Modal>
    </Block>
  );
};

export const Sizes = () => {
  const [size, setSize] = useState<ModalSize | null>(null);
  return (
    <Block caption="Three widths: sm is 384 px, md (default) is 448 px, lg is 512 px.">
      <Row>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button key={s} variant="outline" onClick={() => setSize(s)}>
            Size {s}
          </Button>
        ))}
      </Row>
      <Modal
        isOpen={size !== null}
        onClose={() => setSize(null)}
        size={size ?? 'md'}
        title={`Size ${size ?? 'md'}`}
        description="The dialog keeps its width and grows in height."
      >
        <ModalFooter>
          <Button onClick={() => setSize(null)}>Done</Button>
        </ModalFooter>
      </Modal>
    </Block>
  );
};

export const States = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block caption="Locked dialog: no close button, and neither a backdrop click nor Escape dismisses it. Use it when the user must choose.">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open locked dialog
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Choose a plan"
        description="Pick one option to continue."
        showCloseButton={false}
        closeOnOverlayClick={false}
        closeOnEscape={false}
      >
        <ModalFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Free
          </Button>
          <Button onClick={() => setOpen(false)}>Team</Button>
        </ModalFooter>
      </Modal>
    </Block>
  );
};
