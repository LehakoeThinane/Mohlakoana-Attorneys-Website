/**
 * Purely decorative ambient background for dark sections. Pure CSS
 * animation (see globals.css .glow-orb) — no client JS needed, and it's
 * disabled entirely under prefers-reduced-motion.
 */
export function GlowOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="glow-orb glow-orb-gold -left-24 -top-24 h-96 w-96" />
      <div className="glow-orb glow-orb-amber right-[-8rem] top-1/3 h-[28rem] w-[28rem]" />
    </div>
  );
}
