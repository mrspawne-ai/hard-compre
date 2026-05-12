import { lazy, Suspense } from 'react';
import { useHashRouter } from './hooks/useHashRouter';
import { useTheme } from './hooks/useTheme';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import type { RouteKey, PageProps } from './types';

// ── Lazy-loaded pages ──────────────────────────────────────────────────────
const Home       = lazy(() => import('./pages/Home'));
const Laptops    = lazy(() => import('./pages/Laptops'));
const Desktops   = lazy(() => import('./pages/Desktops'));
const PCvsMac    = lazy(() => import('./pages/PCvsMac'));
const Components = lazy(() => import('./pages/Components'));
const Compare    = lazy(() => import('./pages/Compare'));
const Guides     = lazy(() => import('./pages/Guides'));
const About      = lazy(() => import('./pages/About'));
const Contact    = lazy(() => import('./pages/Contact'));
const Support    = lazy(() => import('./pages/Support'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Admin      = lazy(() => import('./pages/Admin'));
const SignIn     = lazy(() => import('./pages/SignIn'));
const UpgradePlan = lazy(() => import('./pages/UpgradePlan'));
const NotFound   = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));

// ── Route map ──────────────────────────────────────────────────────────────
type PageComponent = React.ComponentType<PageProps>;

const ROUTE_MAP: Partial<Record<RouteKey, PageComponent>> = {
  home:        Home,
  laptops:     Laptops,
  desktops:    Desktops,
  'pc-vs-mac': PCvsMac,
  components:  Components,
  compare:     Compare,
  guides:      Guides,
  about:       About,
  contact:     Contact,
  support:     Support,
  dashboard:   Dashboard,
  admin:       Admin,
  signin:      SignIn,
  upgrade:     UpgradePlan,
  '404':       NotFound,
  '500':       ServerError,
};

// No standard footer on these pages
const NO_FOOTER: Set<RouteKey> = new Set(['dashboard', 'admin', 'signin', '404', '500']);

// ── Loading skeleton ──────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-apple-blue border-t-transparent animate-spin" />
        <p className="text-sm text-apple-gray">Loading…</p>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const { route, navigate } = useHashRouter();
  const { isDark, toggleTheme } = useTheme();

  const PageComponent = ROUTE_MAP[route] ?? NotFound;
  const showFooter = !NO_FOOTER.has(route);

  return (
    <div className="app-bg font-sans text-apple-dark dark:text-apple-light">
      <NavBar
        isDark={isDark}
        toggleTheme={toggleTheme}
        navigate={navigate}
        currentRoute={route}
      />

      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<PageSkeleton />}>
          <div key={route} className="page-enter">
            <PageComponent navigate={navigate} />
          </div>
        </Suspense>
      </main>

      {showFooter && <Footer navigate={navigate} />}
    </div>
  );
}
