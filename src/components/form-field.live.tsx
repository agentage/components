'use client';

import * as React from 'react';

const PREVIEW_DELAY_MS = 500;

/** Polite live copy of the preview: empty until the value first changes, then only the settled value. */
export const SettledPreview = ({ value }: { value: React.ReactNode }) => {
  const [settled, setSettled] = React.useState<React.ReactNode>(null);
  const atMount = React.useRef(value);
  const changed = React.useRef(false);
  React.useEffect(() => {
    // Compare with the mount value, not a first-run flag: StrictMode runs effects twice on mount.
    if (!changed.current && value === atMount.current) return;
    changed.current = true;
    const t = setTimeout(() => setSettled(value), PREVIEW_DELAY_MS);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div className="sr-only" aria-live="polite" data-slot="form-field-preview-live">
      {settled}
    </div>
  );
};
