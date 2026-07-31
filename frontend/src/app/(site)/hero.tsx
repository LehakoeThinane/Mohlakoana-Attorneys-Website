"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FIRM } from "@/lib/firm";
import { GlowOrbs } from "./glow-orbs";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-amber-500/20 bg-stone-900 text-amber-50">
      <GlowOrbs />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-20"
      >
        <motion.h1 variants={item} className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Conservative, risk-conscious legal counsel in Pretoria.
        </motion.h1>
        <motion.p variants={item} className="max-w-xl text-lg text-amber-100">
          {FIRM.name} advises individuals, directors, SMEs, corporate clients, and government departments,
          with legal risk identified early, managed prudently, and resolved efficiently.
        </motion.p>
        <motion.div variants={item} className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="glow-gold-static rounded-md bg-amber-50 px-5 py-3 font-medium text-stone-900 transition-transform duration-300 hover:scale-105 hover:bg-amber-100"
          >
            Get in touch
          </Link>
          <Link
            href="/practice-areas"
            className="glass-dark rounded-md border border-amber-200/30 px-5 py-3 font-medium text-amber-50 transition-colors hover:border-amber-300/60 hover:text-amber-200"
          >
            View practice areas
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
