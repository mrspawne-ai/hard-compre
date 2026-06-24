import { useState, useEffect } from 'react';
import { useScrollEffect } from '../hooks/useScrollEffect';
import { getSelectedIds } from '../lib/compareStore';
import type { NavigateFn, RouteKey } from '../types';

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

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="HardCompare Home"
      className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-150 focus-visible:outline focus-visible:outline-apple-blue"
    >
      <span
        className="w-7 h-5 border border-current flex items-center justify-center text-[9px] font-black tracking-widest text-apple-blue"
        aria-hidden="true"
      >
        HC
      </span>
      <span className="font-black text-[13px] tracking-tight text-apple-dark dark:text-apple-light hidden sm:inline uppercase">
        Hard<span className="text-apple-blue">Compare</span>
      </span>
    </button>
  );
}

function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-8 h-8 flex items-center justify-center transition-all duration-150 hover:text-apple-blue border border-transparent hover:border-current focus-visible:outline focus-visible:outline-apple-blue"
    >
      {isDark ? (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="square" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="square" strokeLinejoin="miter" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

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

  useEffect(() => {
    const handler = () => setCompareCount(getSelectedIds().length);
    window.addEventListener('comparechange', handler);
    return () => window.removeEventListener('comparechange', handler);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? 'liquid-glass-nav' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="section-container flex items-center justify-between h-12"
        >
          <Logo onClick={() => handleNav('home')} />

          {/* Center links */}
          <ul className="hidden lg:flex items-center" role="list">
            {NAV_LINKS.map(({ label, route, highlight }) => (
              <li key={route}>
                {highlight ? (
                  <button
                    onClick={() => handleNav(route)}
                    className={`relative flex items-center gap-1.5 px-3 py-1 text-[0.6rem] font-bold tracking-widest uppercase border transition-all duration-150 ${
                      currentRoute === route
                        ? 'bg-apple-blue text-white border-apple-blue'
                        : 'text-apple-blue border-apple-blue hover:bg-apple-blue hover:text-white'
                    }`}
                    aria-current={currentRoute === route ? 'page' : undefined}
                  >
                    {label}
                    {compareCount > 0 && (
                      <span className="w-4 h-4 border border-current text-[9px] font-bold flex items-center justify-center leading-none">
                        {compareCount}
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav(route)}
                    className={`nav-link ${currentRoute === route ? '!text-apple-dark dark:!text-apple-light font-bold' : ''}`}
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

            <button
              onClick={() => handleNav('upgrade')}
              aria-label="View upgrade plans"
              className="hidden sm:flex items-center gap-1 px-2 py-1 text-[0.58rem] font-bold tracking-widest uppercase text-apple-orange hover:text-apple-dark dark:hover:text-apple-light transition-colors duration-150 ml-1"
            >
              + Pro
            </button>

            {isLoggedIn ? (
              <button
                onClick={() => handleNav('dashboard')}
                aria-label="Open dashboard"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[0.6rem] font-bold tracking-widest uppercase border border-current text-apple-dark dark:text-apple-light hover:border-apple-blue hover:text-apple-blue transition-colors duration-150 ml-1"
              >
                Account
              </button>
            ) : (
              <button
                id="navbar-signin-btn"
                onClick={() => handleNav('signin')}
                aria-label="Sign in"
                className="hidden sm:flex btn-primary !text-[0.6rem] !px-3 !py-1 ml-1"
              >
                Sign In
              </button>
            )}

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1 hover:text-apple-blue transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span className="w-5 h-px bg-current" />
              <span className="w-5 h-px bg-current" />
              <span className="w-3 h-px bg-current" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 liquid-glass-heavy" onClick={() => setMobileOpen(false)} />

        <div
          className={`absolute inset-x-3 top-3 bottom-3 liquid-glass-heavy p-6 flex flex-col transition-transform duration-200 ${
            mobileOpen ? 'translate-y-0' : '-translate-y-3'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-8 h-5 border border-apple-blue flex items-center justify-center text-[9px] font-black tracking-widest text-apple-blue" aria-hidden="true">HC</span>
              <span className="font-black text-[13px] tracking-tight uppercase text-apple-dark dark:text-apple-light">
                Hard<span className="text-apple-blue">Compare</span>
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="w-8 h-8 border border-current flex items-center justify-center hover:text-apple-blue hover:border-apple-blue transition-colors duration-150 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Links */}
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col divide-y divide-black/8 dark:divide-white/8" role="list">
              {NAV_LINKS.map(({ label, route, highlight }) => (
                <li key={route}>
                  <button
                    onClick={() => handleNav(route)}
                    className={`w-full text-left px-2 py-3.5 text-sm font-bold tracking-wider uppercase flex items-center justify-between transition-colors duration-150 ${
                      currentRoute === route
                        ? 'text-apple-blue'
                        : highlight
                        ? 'text-apple-blue'
                        : 'text-apple-dark dark:text-apple-light hover:text-apple-blue'
                    }`}
                    aria-current={currentRoute === route ? 'page' : undefined}
                  >
                    {label}
                    <div className="flex items-center gap-2">
                      {highlight && compareCount > 0 && (
                        <span className="w-5 h-5 border border-apple-blue text-apple-blue text-[10px] font-bold flex items-center justify-center">
                          {compareCount}
                        </span>
                      )}
                      <span className="text-apple-gray dark:text-apple-mid-gray text-xs">→</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex items-center justify-between pt-5 border-t border-black/10 dark:border-white/10">
            {isLoggedIn ? (
              <button onClick={() => handleNav('dashboard')} className="btn-primary !text-[0.65rem] !px-4 !py-2">
                Account
              </button>
            ) : (
              <button id="mobile-signin-btn" onClick={() => handleNav('signin')} className="btn-primary !text-[0.65rem] !px-4 !py-2">
                Sign In
              </button>
            )}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </div>
      </div>
    </>
  );
}
