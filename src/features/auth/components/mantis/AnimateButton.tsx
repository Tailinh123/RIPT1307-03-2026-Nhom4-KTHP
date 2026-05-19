import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimateButtonProps {
  children: ReactNode;
}

export function AnimateButton({ children }: AnimateButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.954 }}>
      {children}
    </motion.div>
  );
}
