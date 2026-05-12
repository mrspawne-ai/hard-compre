
// ─── GlassCard ────────────────────────────────────────────────────────────────
// Reusable Liquid Glass card component with Apple-style styling.

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  radius?: 'xl' | '2xl' | '3xl';
  strength?: 'light' | 'default' | 'strong';
  onClick?: () => void;
  as?: 'div' | 'article' | 'section' | 'li';
  glow?: boolean;
  style?: React.CSSProperties;
}

const paddingMap = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
  xl:   'p-10',
};

const radiusMap = {
  xl:   'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

const strengthMap = {
  light:   'liquid-glass-light',
  default: 'liquid-glass',
  strong:  'liquid-glass-heavy',
};

export default function GlassCard({
  children,
  className = '',
  hover = false,
  padding = 'lg',
  radius = '2xl',
  strength = 'default',
  onClick,
  as: Tag = 'div',
  glow = false,
  style,
}: GlassCardProps) {
  const classes = [
    strengthMap[strength],
    radiusMap[radius],
    paddingMap[padding],
    hover ? 'card-hover cursor-pointer' : '',
    glow ? 'glow-blue' : '',
    'transition-all duration-350',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={classes}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      {children}
    </Tag>
  );
}
