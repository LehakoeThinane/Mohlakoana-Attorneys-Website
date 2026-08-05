/**
 * Purely decorative ambient background. Pure CSS animation (see
 * globals.css .glow-orb) — no client JS needed, and it's disabled
 * entirely under prefers-reduced-motion. `variant="light"` uses a
 * stronger, warmer tint so it stays visible on cream/white sections
 * (the default tuning is calibrated for the dark hero) — this is what
 * gives .glass cards in light sections something to actually blur.
 */
export function GlowOrbs({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const orbClass = variant === "light" ? "glow-orb-light" : "glow-orb-gold";
  const orbClass2 = variant === "light" ? "glow-orb-light" : "glow-orb-amber";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`glow-orb ${orbClass} -left-24 -top-24 h-96 w-96`} />
      <div className={`glow-orb ${orbClass2} right-[-8rem] top-1/3 h-[28rem] w-[28rem]`} />
    </div>
  );
}
