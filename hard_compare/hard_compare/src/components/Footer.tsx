import type { NavigateFn, RouteKey } from '../types';

interface FooterProps {
  navigate: NavigateFn;
}

const FOOTER_COLS: Array<{ heading: string; links: Array<{ label: string; route: RouteKey }> }> = [
  {
    heading: 'Compare',
    links: [
      { label: 'Laptops',      route: 'laptops' },
      { label: 'Desktops',     route: 'desktops' },
      { label: 'PC vs Mac',    route: 'pc-vs-mac' },
      { label: 'Components',   route: 'components' },
      { label: 'Compare Tool', route: 'compare' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Buying Guides', route: 'guides' },
      { label: 'About Us',      route: 'about' },
      { label: 'Support',       route: 'support' },
      { label: 'Contact',       route: 'contact' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Dashboard', route: 'dashboard' },
      { label: 'Admin',     route: 'admin' },
    ],
  },
];

export default function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-black/8 dark:border-white/8" role="contentinfo">
      <div className="section-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-14">
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold text-apple-dark/50 dark:text-apple-light/40 uppercase tracking-widest mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-3" role="list">
                {col.links.map(({ label, route }) => (
                  <li key={label}>
                    <button
                      onClick={() => navigate(route)}
                      className="text-sm text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue dark:hover:text-apple-blue transition-colors duration-200 text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-md bg-gradient-to-br from-apple-blue to-apple-indigo flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">⌥</span>
            <p className="text-sm text-apple-gray dark:text-apple-mid-gray">
              Copyright &copy; {currentYear} HardCompare. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            {[
              { label: 'Home',    route: 'home'    as RouteKey },
              { label: 'Guides',  route: 'guides'  as RouteKey },
              { label: 'Support', route: 'support' as RouteKey },
              { label: 'Contact', route: 'contact' as RouteKey },
            ].map(({ label, route }) => (
              <button
                key={label}
                onClick={() => navigate(route)}
                className="text-xs text-apple-gray dark:text-apple-mid-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors duration-200"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
