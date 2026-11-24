'use client';
import { useState } from 'react';
import { Alert, Button, ConfirmByTyping } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [done, setDone] = useState(false);
  return (
    <Block caption="A destructive dialog that keeps Delete disabled until the user retypes the exact phrase.">
      <div className="max-w-lg space-y-2">
        <ConfirmByTyping
          phrase="work-notes"
          title="Delete work-notes?"
          description="Every file in this folder is deleted. This cannot be undone."
          actionLabel="Delete folder"
          onConfirm={() => setDone(true)}
          trigger={
            <Button variant="destructive" size="sm">
              Delete folder
            </Button>
          }
        />
        {done && (
          <Alert variant="success" onClose={() => setDone(false)}>
            onConfirm fired because the phrase matched exactly.
          </Alert>
        )}
      </div>
    </Block>
  );
};
