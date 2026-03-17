/**
 * Format a date/time value as `YYYY/MM HH:mm:ss` (e.g. `2026/02 12:00:00`).
 * Returns empty string when input is falsy/invalid.
 */
export function formatDateYYYYMM_HHMMSS(value?: string | number | Date | null): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  const ss = pad2(d.getSeconds());

  return `${yyyy}/${mm} ${hh}:${mi}:${ss}`;
}
