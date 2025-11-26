export default function Button({
  children,
  variant = 'primary',
  className = '',
  as: Component = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-50 disabled:pointer-events-none';

  const styles = {
    primary:
      'bg-blue-400 text-ink-900 shadow-card hover:shadow-card-hover hover:bg-blue-300 focus-visible:ring-blue-200',
    secondary:
      'bg-ink-800 text-slate-100 border border-ink-600 hover:border-blue-300 hover:text-blue-200 focus-visible:ring-blue-300',
    ghost:
      'text-slate-200 hover:text-blue-200 hover:bg-ink-800/70 focus-visible:ring-ink-600',
  };

  return (
    <Component className={`${base} ${styles[variant] ?? styles.primary} ${className}`} {...props}>
      {children}
    </Component>
  );
}