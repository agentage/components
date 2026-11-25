'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  CopyButton,
  Dialog,
  DirtyBar,
  FormField,
  IconButton,
  Input,
  RelativeTime,
  Select,
  SecretInput,
  useAnnounce,
} from '../../../src';
import { Block } from '../../components/demo';
import { UiIcon } from '../../lib/ui-icons';
import { ENVS, Env, Row, SEED, TrashIcon, commit, makeToken, same } from '../../lib/secrets-data';

export const Example = () => {
  const [saved, setSaved] = useState<Row[]>(SEED);
  const [rows, setRows] = useState<Row[]>(SEED);
  const [token, setToken] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const counter = useRef(0);
  const nameRefs = useRef(new Map<string, HTMLInputElement>());
  const announce = useAnnounce();
  const dirty = !same(rows, saved);

  useEffect(() => {
    if (!focusId) return;
    nameRefs.current.get(focusId)?.focus();
    setFocusId(null);
  }, [focusId]);

  const patch = (id: string, p: Partial<Row>) =>
    setRows((l) => l.map((r) => (r.id === id ? { ...r, ...p } : r)));
  const remove = (r: Row) => {
    setRows((l) => l.filter((x) => x.id !== r.id));
    announce(`Removed ${r.name}`);
  };
  const add = (secret: boolean) => {
    counter.current += 1;
    const id = `new${String(counter.current)}`;
    setRows((l) => [
      ...l,
      { id, name: '', secret, value: '', isSet: false, env: 'production', updated: Date.now() },
    ]);
    setFocusId(id);
  };

  return (
    <Block caption="Secret values are write only: after Save, only the last 4 characters stay visible.">
      <div className="relative flex h-[560px] flex-col overflow-hidden rounded-lg border border-border bg-background">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-ui font-semibold text-foreground">Variables and secrets</h3>
            <p className="text-xs text-muted-foreground">Values are passed to every new build.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              counter.current += 1;
              setToken(makeToken(counter.current));
            }}
          >
            Create token
          </Button>
          <Button variant="outline" onClick={() => add(true)}>
            Add secret
          </Button>
          <Button variant="outline" onClick={() => add(false)}>
            <UiIcon name="plus" />
            Add variable
          </Button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-16 pt-3">
          {token && (
            <Alert variant="info" title="Your new token" onClose={() => setToken(null)}>
              <div className="mt-1 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-sm bg-muted px-2 py-1 font-mono text-xs text-foreground">
                  {token}
                </code>
                <CopyButton text={token} size="sm" variant="outline" />
              </div>
              <p className="mt-2 text-xs">This value is shown once.</p>
            </Alert>
          )}
          {rows.length === 0 && <p className="text-ui text-muted-foreground">No variables yet.</p>}
          {rows.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_132px_28px] items-start gap-2"
            >
              <FormField label="Name">
                <Input
                  mono
                  value={r.name}
                  placeholder="NAME"
                  ref={(el) => {
                    if (el) nameRefs.current.set(r.id, el);
                    else nameRefs.current.delete(r.id);
                  }}
                  onChange={(e) => patch(r.id, { name: e.target.value.toUpperCase() })}
                />
              </FormField>
              <FormField
                label={r.secret ? 'Secret value' : 'Value'}
                preview={
                  <>
                    Updated <RelativeTime value={r.updated} />
                  </>
                }
              >
                {r.secret ? (
                  <SecretInput
                    value={r.value}
                    onValueChange={(value) => patch(r.id, { value })}
                    isSet={r.isSet}
                    setHint={r.hint}
                    placeholder="Paste the value"
                  />
                ) : (
                  <Input
                    value={r.value}
                    placeholder="Value"
                    onChange={(e) => patch(r.id, { value: e.target.value })}
                  />
                )}
              </FormField>
              <div className="space-y-1.5">
                <span
                  id={`env-${r.id}`}
                  className="block text-xs font-medium text-muted-foreground"
                >
                  Environment
                </span>
                <Select
                  aria-labelledby={`env-${r.id}`}
                  value={r.env}
                  onValueChange={(v) => patch(r.id, { env: v as Env })}
                  options={ENVS}
                />
              </div>
              <div className="pt-[22px]">
                <IconButton
                  aria-label={`Delete ${r.name || 'new variable'}`}
                  icon={<TrashIcon />}
                  onClick={() => (r.secret && r.isSet ? setDeleting(r) : remove(r))}
                />
              </div>
            </div>
          ))}
        </div>
        <Dialog
          open={deleting !== null}
          onOpenChange={(o) => !o && setDeleting(null)}
          title={`Delete ${deleting?.name ?? ''}`}
          description="The stored value is removed and cannot come back."
          tone="destructive"
          confirmText={deleting?.name ?? ''}
          confirmLabel="Delete"
          onConfirm={() => {
            if (deleting) remove(deleting);
          }}
        />
        <DirtyBar
          dirty={dirty}
          onSave={() => {
            const next = commit(rows, saved);
            setRows(next);
            setSaved(next);
            announce('Saved');
          }}
          onDiscard={() => setRows(saved)}
        />
      </div>
    </Block>
  );
};
