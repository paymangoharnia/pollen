import { clsx, type ClassValue } from "./clsx";

/** Tiny class combiner so shared components avoid a classnames dependency. */
export function clsx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
