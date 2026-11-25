'use client';
import { useState } from 'react';
import { Alert, Button, CopyButton, FormField, SecretInput } from '../../src';
import { Block } from '../components/demo';

export const Example = () => {
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState<string | undefined>();
  return (
    <Block caption="Paste a key: it stays masked unless you show it. Save stores it; from then on the page only knows that it is set and its last characters. Replace starts an empty field.">
      <div className="flex w-full max-w-md items-end gap-2">
        <FormField label="Signing key" className="flex-1">
          <SecretInput
            value={draft}
            onValueChange={setDraft}
            isSet={hint !== undefined}
            setHint={hint}
            placeholder="Paste the key"
          />
        </FormField>
        <Button
          disabled={!draft}
          onClick={() => {
            setHint(draft.slice(-4));
            setDraft('');
          }}
        >
          Save
        </Button>
      </div>
    </Block>
  );
};

export const States = () => (
  <div className="space-y-5">
    <Block caption="Set without a hint, and disabled.">
      <div className="grid w-full max-w-md gap-2">
        <SecretInput aria-label="Webhook secret" isSet />
        <SecretInput aria-label="Disabled key" isSet setHint="9f2c" disabled />
      </div>
    </Block>
    <Block caption="Show once: right after a token is created, its value appears one time with a copy button.">
      <Alert variant="warning" title="Copy this token now" className="max-w-md">
        <span className="flex items-center gap-2">
          <code className="min-w-0 truncate font-mono text-xs">tok_live_3f9a8c2e71b04d6a</code>
          <CopyButton
            text="tok_live_3f9a8c2e71b04d6a"
            label="Copy token"
            iconOnly
            variant="ghost"
          />
        </span>
        <span className="block text-xs">This value is shown once.</span>
      </Alert>
    </Block>
  </div>
);
