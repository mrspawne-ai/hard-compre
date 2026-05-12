import { useState, useEffect, useCallback } from 'react';
import type { RouteKey, NavigateFn } from '../types';

const VALID_ROUTES: Set<string> = new Set([
  'home', 'laptops', 'desktops', 'pc-vs-mac',
  'components', 'compare', 'guides',
  'about', 'contact', 'support',
  'dashboard', 'admin', 'signin', 'upgrade', '404', '500',
]);

function parseHash(hash: string): RouteKey {
  // Strip query-style suffix (e.g. "#compare?ids=...") before matching
  const raw = hash.replace(/^#\/?/, '').toLowerCase().split('?')[0].trim();
  if (!raw) return 'home';
  if (VALID_ROUTES.has(raw)) return raw as RouteKey;
  return '404';
}

export function useHashRouter(): { route: RouteKey; navigate: NavigateFn } {
  const [route, setRoute] = useState<RouteKey>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash(window.location.hash);
      setRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback<NavigateFn>((target: RouteKey) => {
    window.location.hash = target;
  }, []);

  return { route, navigate };
}
