"use client";

import { motion } from "motion/react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts content into place the first time it enters the
 * viewport. Wrapped pages set MotionConfig({ reducedMotion: "user" }) in
 * (site)/layout.tsx, so this becomes an instant, motionless appearance
 * for anyone with prefers-reduced-motion set — no per-usage opt-out needed.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
