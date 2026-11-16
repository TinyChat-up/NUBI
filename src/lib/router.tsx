/**
 * Router mínimo basado en History API (evita una dependencia para 15 rutas).
 * Vercel reescribe todas las rutas a index.html (vercel.json).
 */
import { useEffect, useState, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

const getLocation = () => window.location.pathname + window.location.search;

export function useLocation(): { path: string; query: URLSearchParams } {
  const href = useSyncExternalStore(subscribe, getLocation, () => '/');
  const url = new URL(href, 'http://nubi.local');
  return { path: url.pathname.replace(/\/+$/, '') || '/', query: url.searchParams };
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  if (to === getLocation()) return;
  if (options.replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  notify();
}

export function goBack(fallback: string): void {
  if (window.history.length > 1) window.history.back();
  else navigate(fallback);
}

/** Compara una ruta con un patrón tipo "/historias/:id/cuento". */
export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = path.split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest} />;
}

/** Tras cada cambio de ruta: subir arriba y llevar el foco al título principal. */
export function useRouteFocus(path: string) {
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (first) {
      setFirst(false);
      return;
    }
    window.scrollTo({ top: 0 });
    const target = document.querySelector<HTMLElement>('[data-route-focus]') ?? document.querySelector<HTMLElement>('main h1');
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
}
