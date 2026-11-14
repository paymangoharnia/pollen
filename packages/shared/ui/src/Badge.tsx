import { clsx, type ClassValue } from "./clsx";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "pollen" | "bloom" | "success" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-zinc-800 text-zinc-300 border-zinc-700",
  pollen: "bg-pollen-400/10 text-pollen-300 border-pollen-400/30",
  bloom: "bg-bloom-500/10 text-bloom-400 border-bloom-500/30",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
      {...rest}
    />
  );
}
