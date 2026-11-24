/* Docs-only line icons for the round 3 demos (lucide-style paths, 24 px grid). */
const PATHS = {
  clock: 'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17M12 7.5V12l3 2',
  shield: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z',
  help: 'M12 21a9 9 0 1 0 0-18a9 9 0 1 0 0 18M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4M12 17h.01',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6a3 3 0 1 0 0 6',
  alert:
    'M10.3 4.2 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  checkCircle: 'M12 21a9 9 0 1 0 0-18a9 9 0 1 0 0 18M8.5 12.5l2.5 2.5 4.5-5',
  info: 'M12 21a9 9 0 1 0 0-18a9 9 0 1 0 0 18M12 11v5M12 8h.01',
  forward: 'M15 5l6 6-6 6M21 11H9a6 6 0 0 0-6 6v2',
  plus: 'M12 5v14M5 12h14',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  cloud: 'M7 18a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19 11a3.5 3.5 0 0 1-.5 7z',
  globe: 'M12 21a9 9 0 1 0 0-18a9 9 0 1 0 0 18M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  download: 'M12 3v12M7 10l5 5 5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5',
  details: 'M4 4h16v16H4zM15 4v16',
  folder:
    'M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z',
  brain:
    'M12 5a3 3 0 1 0-5.9 1A4 4 0 0 0 4 13a4 4 0 0 0 4 6h.5M12 5a3 3 0 1 1 5.9 1A4 4 0 0 1 20 13a4 4 0 0 1-4 6h-.5M12 5v14',
  flask: 'M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10',
  store: 'M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8',
  bot: 'M4.5 8h15v11h-15zM12 4.5V8M9.5 13.5h.01M14.5 13.5h.01',
  radar: 'M12 21a9 9 0 1 0 0-18a9 9 0 1 0 0 18M12 12l5-5M12 16a4 4 0 1 0 0-8',
} as const;

export type UiIconName = keyof typeof PATHS;

export const UiIcon = ({ name, size = 16 }: { name: UiIconName; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={PATHS[name]} />
  </svg>
);
