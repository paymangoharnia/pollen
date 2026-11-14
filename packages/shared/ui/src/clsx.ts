/** Tiny class combiner so shared components avoid a classnames dependency. */
export type ClassValue = string | number | boolean | null | undefined;

export function clsx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(" ");
}
