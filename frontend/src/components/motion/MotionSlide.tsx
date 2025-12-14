"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface MotionSlideProps {
  children: ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 600 : -600,
    opacity: 0,
  }),
};

export function MotionSlide({ children }: MotionSlideProps) {
  return (
    <motion.div
      initial="enter"
      animate="center"
      exit="exit"
      variants={slideVariants}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}
