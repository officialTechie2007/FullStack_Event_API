import { motion } from 'framer-motion';
import { pageVariants } from '../../utils/motion';

const PageTransition = ({ children, className = '' }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

export default PageTransition;
