import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { memo } from 'react';
import { spring } from '../../utils/motion';

const GlassCard = memo(({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  onClick,
  layoutId,
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), spring);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), spring);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${useTransform(mouseX, [-0.5, 0.5], [0, 100])}% ${useTransform(mouseY, [-0.5, 0.5], [0, 100])}%, rgba(255,255,255,.20), transparent 44%)`;

  const handleMove = (event) => {
    if (!hover) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={hover ? { y: -6, scale: 1.015 } : undefined}
      transition={spring}
      style={hover ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={`group relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-glass)] shadow-[var(--shadow-card)] backdrop-blur-2xl ${hover ? 'cursor-pointer will-change-transform' : ''} ${padding} ${className}`}
      {...props}
    >
      {hover && <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
