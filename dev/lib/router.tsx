'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { redirectedPath } from './redirects';

/**
 * ~40-line History-API router. nginx and `vite preview` both fall back to
 * index.html, so clean paths deep-link and reload without a dependency.
 */
const RouteContext = createContext<{ path: string; navigate: (to: string) => void }>({
  path: '/',
  navigate: () => undefined,
});

/** The address-bar path; an old route is replaced in place by the page that holds it now. */
const currentPath = (): string => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname || '/';
  const moved = redirectedPath(path);
  if (moved !== path) window.history.replaceState(null, '', moved);
  return moved.split('#')[0] ?? moved;
};

/** Scroll to the `#section` of the address once the page has rendered. */
const scrollToHash = (): void => {
  const id = window.location.hash.slice(1);
  if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
};

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [path, setPath] = useState(currentPath);

  useEffect(scrollToHash, []);

  useEffect(() => {
    const onPop = (): void => {
      setPath(currentPath());
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const navigate = useCallback((target: string) => {
    const to = redirectedPath(target);
    const [pathname = to] = to.split('#');
    if (to === currentPath() + window.location.hash) return;
    window.history.pushState(null, '', to);
    setPath(pathname);
    window.scrollTo(0, 0);
    scrollToHash();
  }, []);

  // Library link components take a plain href, so intercept them here
  // rather than teaching every one of them about the router.
  useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      const href = anchor?.getAttribute('href');
      if (!anchor || !href?.startsWith('/') || anchor.target === '_blank') return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [navigate]);

  return <RouteContext.Provider value={{ path, navigate }}>{children}</RouteContext.Provider>;
};

export const useRoute = () => useContext(RouteContext);

/** Anchor that keeps the SPA in-process but stays a real, copyable link. */
export const Link = ({
  to,
  children,
  className,
  ...props
}: { to: string; children: ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { navigate } = useRoute();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {children}
    </a>
  );
};
