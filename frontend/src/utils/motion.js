export const spring = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
  mass: 0.8,
};

export const pageTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.42,
};

export const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: pageTransition },
  exit: { opacity: 0, y: -12, filter: 'blur(8px)', transition: { duration: 0.22 } },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring, stiffness: 360 },
  },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.94, y: 24, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...spring, stiffness: 330 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 18,
    filter: 'blur(10px)',
    transition: { duration: 0.18 },
  },
};

export const tableRowVariants = {
  initial: { opacity: 0, x: -12 },
  animate: (index = 0) => ({
    opacity: 1,
    x: 0,
    transition: { ...spring, delay: index * 0.035 },
  }),
};
