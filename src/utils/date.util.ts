/**
 * Format elapsed time from a past datetime to now in human-readable Japanese.
 * e.g. "3分前", "2時間前", "5日前"
 * Returns empty string when input is falsy/invalid.
 */
export function formatElapsedTime(value?: string | number | Date | null): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}秒前`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}時間前`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}日前`;
}

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
