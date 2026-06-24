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
    <footer className="border-t border-black/10 dark:border-white/8" role="contentinfo">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-[0.6rem] font-black uppercase tracking-widest text-apple-dark/40 dark:text-apple-light/30 mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5" role="list">
                {col.links.map(({ label, route }) => (
                  <li key={label}>
                    <button
                      onClick={() => navigate(route)}
                      className="text-xs text-apple-gray dark:text-apple-mid-gray hover:text-apple-blue dark:hover:text-apple-blue transition-colors duration-150 uppercase tracking-wide font-medium"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-5 border border-apple-blue flex items-center justify-center text-[9px] font-black tracking-widest text-apple-blue" aria-hidden="true">HC</span>
            <p className="text-[0.7rem] text-apple-gray dark:text-apple-mid-gray uppercase tracking-wide">
              &copy; {currentYear} HardCompare
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
                className="text-[0.65rem] uppercase tracking-wider text-apple-gray dark:text-apple-mid-gray hover:text-apple-dark dark:hover:text-apple-light transition-colors duration-150"
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
