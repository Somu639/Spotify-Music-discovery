/** Stable number formatting for SSR + client (avoids hydration mismatches). */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}
