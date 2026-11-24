import type { ReactNode } from 'react';

/** Short line under a demo block saying what state it shows. */
export const Caption = ({ children }: { children: ReactNode }) => (
  <p className="text-xs text-muted-foreground">{children}</p>
);
