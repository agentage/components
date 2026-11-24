'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

export const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-lg border px-3.5 py-3 shadow-[var(--shadow-popover)] transition-all',
  {
    variants: {
      variant: {
        default: 'border-border bg-card text-card-foreground',
        // Status hue on border and an opaque tint (page text must not show through); text stays foreground.
        success:
          'border-success/50 bg-[color-mix(in_oklab,var(--color-success)_10%,var(--color-card))] text-card-foreground',
        destructive:
          'border-destructive/50 bg-[color-mix(in_oklab,var(--color-destructive)_10%,var(--color-card))] text-card-foreground',
        warning:
          'border-warning/50 bg-[color-mix(in_oklab,var(--color-warning)_10%,var(--color-card))] text-card-foreground',
        info: 'border-info/50 bg-[color-mix(in_oklab,var(--color-info)_10%,var(--color-card))] text-card-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: VariantProps<typeof toastVariants>['variant'];
  duration?: number;
}

interface ToastContextValue {
  toast: (data: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export const useToast = (): ToastContextValue => useContext(ToastContext);

let toastCounter = 0;

const DEFAULT_DURATION_MS = 4000;
// A toast released with no time left still stays this long, so it never vanishes under the pointer.
const MIN_RESUME_MS = 1000;

interface Timer {
  handle: ReturnType<typeof setTimeout> | null;
  remaining: number;
  startedAt: number;
  holds: number;
}

export const ToastProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const mounted = useMounted();

  const timers = useRef(new Map<string, Timer>());

  const removeToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const arm = useCallback(
    (id: string, timer: Timer) => {
      timer.startedAt = Date.now();
      timer.handle = setTimeout(() => removeToast(id), timer.remaining);
    },
    [removeToast]
  );

  // Hover and focus each hold the timer; it resumes with the time left once both let go.
  const hold = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (!timer) return;
    timer.holds += 1;
    if (timer.handle) {
      clearTimeout(timer.handle);
      timer.handle = null;
      timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.startedAt));
    }
  }, []);

  const release = useCallback(
    (id: string) => {
      const timer = timers.current.get(id);
      if (!timer) return;
      timer.holds = Math.max(0, timer.holds - 1);
      if (timer.holds > 0 || timer.handle) return;
      timer.remaining = Math.max(timer.remaining, MIN_RESUME_MS);
      arm(id, timer);
    },
    [arm]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => {
        if (t.handle) clearTimeout(t.handle);
      });
      map.clear();
    };
  }, []);

  const toast = useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = `toast-${String(++toastCounter)}`;
      setToasts((prev) => [...prev, { ...data, id }]);
      const duration = data.duration ?? DEFAULT_DURATION_MS;
      // A non-finite or non-positive duration keeps the toast until it is dismissed.
      if (Number.isFinite(duration) && duration > 0) {
        const timer: Timer = { handle: null, remaining: duration, startedAt: 0, holds: 0 };
        timers.current.set(id, timer);
        arm(id, timer);
      }
    },
    [arm]
  );

  const item = (t: ToastData): React.JSX.Element => (
    <div
      key={t.id}
      role={t.variant === 'destructive' ? 'alert' : undefined}
      className={cn(toastVariants({ variant: t.variant }))}
      data-slot="toast"
      onPointerEnter={() => hold(t.id)}
      onPointerLeave={() => release(t.id)}
      onFocus={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) hold(t.id);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) release(t.id);
      }}
    >
      <div className="flex-1">
        <p className="text-ui font-medium">{t.title}</p>
        {t.description && <p className="mt-0.5 text-xs">{t.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => removeToast(t.id)}
        className={cn(
          'grid size-6 shrink-0 place-items-center rounded-md opacity-60 hover:opacity-100 transition-opacity',
          'focus-ring focus-visible:opacity-100'
        )}
        aria-label={`Dismiss ${t.title}`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="fixed bottom-4 right-4 z-[var(--z-toast,100)] flex flex-col gap-2 pointer-events-none"
            data-slot="toast-container"
          >
            {/* Errors sit beside the polite region, not in it, so they are read once. */}
            <div className="flex flex-col gap-2" data-slot="toast-alerts">
              {toasts.filter((t) => t.variant === 'destructive').map(item)}
            </div>
            <div
              role="status"
              aria-live="polite"
              aria-relevant="additions"
              className="flex flex-col gap-2"
              data-slot="toast-status"
            >
              {toasts.filter((t) => t.variant !== 'destructive').map(item)}
            </div>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};
