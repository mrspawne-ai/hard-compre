import { useState, useEffect } from 'react';
import { useScrollEffect } from '../hooks/useScrollEffect';
import { getSelectedIds } from '../lib/compareStore';
import type { NavigateFn, RouteKey } from '../types';

// ─── Nav links ────────────────────────────────────────────────────────────────
interface NavLinkDef {
  label: string;
  route: RouteKey;
  highlight?: boolean;
}

const NAV_LINKS: NavLinkDef[] = [
  { label: 'Home',         route: 'home' },
  { label: 'Laptops',      route: 'laptops' },
  { label: 'Desktops',     route: 'desktops' },
  { label: 'PC vs Mac',    route: 'pc-vs-mac' },
  { label: 'Components',   route: 'components' },
  { label: 'Compare Tool', route: 'compare', highlight: true },
  { label: 'Guides',       route: 'guides' },
];

// ─── HardCompare Logo ─────────────────────────────────────────────────────────
function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="HardCompare Home"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-apple-blue rounded-lg px-1"
    >
      <span
        className="w-7 h-7 rounded-lg bg-gradient-to-br from-apple-blue to-apple-indigo flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-apple-blue/30"
        aria-hidden="true"
      >
        ⌥
      </span>
      <span className="font-bold text-[15px] tracking-tight text-apple-dark dark:text-apple-light hidden sm:inline">
        Hard<span className="text-apple-blue">Compare</span>
      </span>
    </button>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-apple-blue"
    >
      {isDark ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

// ─── NavBar ───────────────────────────────────────────────────────────────────
interface NavBarProps {
  isDark: boolean;
  toggleTheme: () => void;
  navigate: NavigateFn;
  currentRoute: RouteKey;
}

export default function NavBar({ isDark, toggleTheme, navigate, currentRoute }: NavBarProps) {
  const { scrolled } = useScrollEffect(10);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(() => getSelectedIds().length);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('liquidOS-auth'));

  // Keep compare badge in sync with compareStore events
  useEffect(() => {
    const handler = () => setCompareCount(getSelectedIds().length);
    window.addEventListener('comparechange', handler);
    return () => window.removeEventListener('comparechange', handler);
  }, []);

  // Keep auth state in sync with localStorage changes
  useEffect(() => {
    const handler = () => setIsLoggedIn(!!localStorage.getItem('liquidOS-auth'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleNav = (route: RouteKey) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Desktop NavBar ── */}
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'liquid-glass-nav shadow-sm shadow-black/5 dark:shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <nav
          aria-label="Main navigation"
          className="section-container flex items-center justify-between h-14"
        >
          {/* Logo */}
          <Logo onClick={() => handleNav('home')} />

          {/* Center links — desktop */}
          <ul className="hidden lg:flex items-center gap-0.5" role="list">
            {NAV_LINKS.map(({ label, route, highlight }) => (
              <li key={route}>
                {highlight ? (
                  <button
                    onClick={() => handleNav(route)}
                    className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      currentRoute === route
                        ? 'bg-apple-blue text-white'
                        : 'bg-apple-blue/10 text-apple-blue hover:bg-apple-blue hover:text-white'
                    }`}
                    aria-current={currentRoute === route ? 'page' : undefined}
                  >
                    {label}
                    {compareCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-white/30 text-[10px] font-bold flex items-center justify-center leading-none">
                        {compareCount}
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav(route)}
                    className={`nav-link ${currentRoute === route ? 'font-medium !text-apple-dark dark:!text-apple-light' : ''}`}
                    aria-current={currentRoute === route ? 'page' : undefined}
                  >
                    {label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

            {/* Upgrade subtle link */}
            <button
              onClick={() => handleNav('upgrade')}
              aria-label="View upgrade plans"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-apple-indigo hover:bg-apple-indigo/8 transition-all duration-200 ml-0.5"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Upgrade
            </button>

            {/* Sign In / Account button */}
            {isLoggedIn ? (
              <button
                onClick={() => handleNav('dashboard')}
                aria-label="Open dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium liquid-glass hover:scale-[1.02] transition-all duration-200 text-apple-dark dark:text-apple-light ml-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
              </button>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={() => handleNav('signin')}
                aria-label="Sign in to your account"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold btn-primary !text-[12px] !py-1.5 !px-3.5 ml-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>
            )}

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="w-5 h-px bg-apple-dark dark:bg-apple-light" />
              <span className="w-5 h-px bg-apple-dark dark:bg-apple-light" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 liquid-glass-heavy"
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu panel */}
        <div
          className={`absolute inset-x-4 top-4 bottom-4 liquid-glass-heavy rounded-3xl p-8 flex flex-col transition-all duration-500 ${
            mobileOpen ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-4'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-apple-blue to-apple-indigo flex items-center justify-center text-white text-sm font-bold" aria-hidden="true">⌥</span>
              <span className="font-bold text-[15px] tracking-tight text-apple-dark dark:text-apple-light">
                Hard<span className="text-apple-blue">Compare</span>
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-8 h-8 rounded-full liquid-glass flex items-center justify-center hover:scale-110 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map(({ label, route, highlight }, i) => (
                <li key={route} style={{ animationDelay: `${i * 0.05}s` }}>
                  <button
                    onClick={() => handleNav(route)}
                    className={`w-full text-left px-4 py-4 rounded-2xl text-2xl font-semibold tracking-tight transition-all duration-200 flex items-center gap-3 ${
                      currentRoute === route
                        ? 'text-apple-blue bg-apple-blue/8'
                        : highlight
                        ? 'text-apple-blue hover:bg-apple-blue/10'
                        : 'text-apple-dark dark:text-apple-light hover:bg-apple-blue/10 hover:text-apple-blue'
                    }`}
                    aria-current={currentRoute === route ? 'page' : undefined}
                  >
                    {label}
                    {highlight && compareCount > 0 && (
                      <span className="w-6 h-6 rounded-full bg-apple-blue text-white text-sm font-bold flex items-center justify-center">
                        {compareCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom controls */}
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between">
              {isLoggedIn ? (
                <button
                  onClick={() => handleNav('dashboard')}
                  className="btn-primary !py-2.5 !px-6 !text-sm"
                >
                  Account
                </button>
              ) : (
                <button
                  id="mobile-signin-btn"
                  onClick={() => handleNav('signin')}
                  className="btn-primary !py-2.5 !px-6 !text-sm"
                >
                  Sign In
                </button>
              )}
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>
            <button
              onClick={() => handleNav('upgrade')}
              className="w-full py-2.5 rounded-2xl liquid-glass text-xs font-semibold text-apple-indigo flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              View Plans & Upgrade
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
