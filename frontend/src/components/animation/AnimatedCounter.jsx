import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';

const AnimatedCounter = memo(({ value = 0, suffix = '', decimals = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    `${Number(latest).toFixed(decimals)}${suffix}`
  );

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(motionValue, Number(value) || 0, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, motionValue, value]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
});

AnimatedCounter.displayName = 'AnimatedCounter';

export default AnimatedCounter;
