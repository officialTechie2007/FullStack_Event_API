import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { memo, useState } from 'react';
import { spring } from '../../utils/motion';

const variants = {
  primary: 'bg-slate-950 text-white shadow-xl shadow-slate-950/15 hover:shadow-cyan-500/20 dark:bg-white dark:text-slate-950',
  secondary: 'border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-sm hover:bg-[var(--surface-hover)]',
  danger: 'bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600',
  success: 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600',
  ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
  outline: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white',
};

const sizes = {
  sm: 'min-h-9 px-3 text-sm gap-1.5',
  md: 'min-h-10 px-4 text-sm gap-2',
  lg: 'min-h-12 px-5 text-sm gap-2.5',
  xl: 'min-h-14 px-7 text-base gap-3',
};

const AnimatedButton = memo(({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  success = false,
  icon,
  className = '',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setRipples((items) => [...items, ripple]);
    window.setTimeout(() => {
      setRipples((items) => items.filter((item) => item.id !== ripple.id));
    }, 560);
    onClick?.(event);
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.975 }}
      transition={spring}
      className={`relative inline-flex select-none items-center justify-center overflow-hidden rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ opacity: 0.28, scale: 0 }}
            animate={{ opacity: 0, scale: 3.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.56, ease: 'easeOut' }}
            className="pointer-events-none absolute h-16 w-16 rounded-full bg-white"
            style={{ left: ripple.x - 32, top: ripple.y - 32 }}
          />
        ))}
      </AnimatePresence>

      <span className="relative z-10 inline-flex items-center justify-center gap-inherit">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span key="loading" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.span>
          ) : success ? (
            <motion.span key="success" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              <Check className="h-4 w-4" />
            </motion.span>
          ) : icon ? (
            <motion.span key="icon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              {icon}
            </motion.span>
          ) : null}
        </AnimatePresence>
        <motion.span layout>{success ? 'Confirmed' : children}</motion.span>
      </span>
    </motion.button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
