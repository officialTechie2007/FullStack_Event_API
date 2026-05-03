import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { modalVariants } from '../../utils/motion';

const MotionModal = ({ isOpen, onClose, title, children, size = 'md', layoutId }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            aria-label="Close modal"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            layoutId={layoutId}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative flex max-h-[86vh] w-full ${sizes[size]} flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface-raised)] shadow-2xl`}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
              <motion.button
                whileHover={{ scale: 1.08, rotate: 4 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClose}
                className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            <div className="overflow-y-auto p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MotionModal;
