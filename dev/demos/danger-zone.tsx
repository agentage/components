'use client';
import { useState } from 'react';
import { Alert, Button, ConfirmByTyping, DangerZone, DangerZoneAction } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [deleted, setDeleted] = useState(false);

  return (
    <Block caption="A bordered group of irreversible actions. Each row has a label, a description and one button, and a risky one can open a typed confirm.">
      <DangerZone
        description="These actions are permanent. Nothing here can be undone."
        className="max-w-2xl"
      >
        <DangerZoneAction
          label="Delete folder"
          description="Removes work-notes and every file it holds for the whole team."
          action={
            <ConfirmByTyping
              phrase="work-notes"
              title="Delete work-notes?"
              description="Every file in this folder is deleted. This cannot be undone."
              actionLabel="Delete folder"
              onConfirm={() => setDeleted(true)}
              trigger={
                <Button variant="destructive" size="sm">
                  Delete folder
                </Button>
              }
            />
          }
        />
        <DangerZoneAction
          label="Revoke all tokens"
          description="Signs out every device and invalidates every access token."
          action={
            <Button variant="outline" size="sm">
              Revoke all
            </Button>
          }
        />
      </DangerZone>
      {deleted && (
        <Alert variant="success" className="mt-2 max-w-2xl" onClose={() => setDeleted(false)}>
          onConfirm fired because the phrase matched exactly.
        </Alert>
      )}
    </Block>
  );
};
