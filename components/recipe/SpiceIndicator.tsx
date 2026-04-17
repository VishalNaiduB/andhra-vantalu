import { SPICE_LEVELS } from "@/lib/constants";

export function SpiceIndicator({ level }: { level: string }) {
  const spice = SPICE_LEVELS[level];
  if (!spice) return null;

  return (
    <span className="text-sm" title={spice.label} aria-label={`Spice level: ${spice.label}`}>
      {spice.emoji}
    </span>
  );
}
