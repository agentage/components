'use client';
import { useState } from 'react';
import { describeCron, FormField, Input, RelativeTime } from '../../src';

/** A five-field schedule with its meaning and next runs under it (docs-only). */
export const SchedulePreview = ({ layout = 'stack' }: { layout?: 'stack' | 'row' }) => {
  const [expr, setExpr] = useState('0 9 * * 1-5');
  const [zone] = useState('UTC');
  const d = describeCron(expr, { timeZone: zone });
  return (
    <FormField
      label="Schedule"
      layout={layout}
      hint="Five fields: minute, hour, day of month, month, day of week."
      error={d.error}
      className="max-w-md"
      preview={
        d.error ? undefined : (
          <>
            <span className="block text-foreground">{d.text}</span>
            <span className="flex flex-wrap gap-x-3">
              Next:
              {d.next.map((t) => (
                <RelativeTime key={t.getTime()} value={t} />
              ))}
            </span>
          </>
        )
      }
    >
      <Input mono value={expr} onChange={(e) => setExpr(e.target.value)} />
    </FormField>
  );
};
