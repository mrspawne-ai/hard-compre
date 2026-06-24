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
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
  xl:   'p-6',
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
  strength = 'default',
  onClick,
  as: Tag = 'div',
  glow = false,
  style,
}: GlassCardProps) {
  const classes = [
    strengthMap[strength],
    paddingMap[padding],
    hover ? 'card-hover cursor-pointer' : '',
    glow ? 'glow-blue' : '',
    'transition-all duration-150',
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
