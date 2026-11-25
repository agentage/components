'use client';
import { useEffect, useState } from 'react';
import { ToggleGroup } from '../../src';

const CLASS = 'theme-app';
const STORAGE_KEY = 'ds-docs-app-theme';

const stored = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

/** Docs-only: swaps in the app (kit) theme for review, until unmount. */
export const AppThemeSwitch = () => {
  const [on, setOn] = useState(stored);

  useEffect(() => {
    document.documentElement.classList.toggle(CLASS, on);
    try {
      sessionStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    } catch {
      /* storage blocked: the switch still works for this page */
    }
    return () => {
      document.documentElement.classList.remove(CLASS);
    };
  }, [on]);

  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs text-muted-foreground" id="app-theme-label">
        Review colours
      </span>
      <ToggleGroup
        aria-labelledby="app-theme-label"
        value={on ? 'app' : 'ds'}
        onValueChange={(v) => {
          setOn(v === 'app');
        }}
        options={[
          { value: 'ds', label: 'Default theme' },
          { value: 'app', label: 'App theme' },
        ]}
        columns={2}
      />
    </div>
  );
};
