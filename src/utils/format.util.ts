export function formatDate(value: string | undefined | null, fallback: string = '—'): string {
  return value ? new Date(value).toLocaleDateString('ja-JP') : fallback;
}

export function formatYen(value: number | undefined | null, fallback: string = '—'): string {
  return value != null ? `¥${value.toLocaleString()}` : fallback;
}

export function formatDateTime(value: string | undefined | null, fallback: string = '—'): string {
  return value ? new Date(value).toLocaleString('ja-JP') : fallback;
}
