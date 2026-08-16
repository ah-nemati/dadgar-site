'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export default function PageTransition({ children, pageKey }: { children: ReactNode; pageKey: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={pageKey}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
