export function formatDateOnly(dateStr: string | undefined) {
  if (!dateStr) return '—';
  // Handles YYYY-MM-DD safely without timezone shifts.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (m) return `${m[1]}/${m[2]}/${m[3]}`;
  try {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string | undefined) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export function formatGender(gender: string | undefined) {
  if (!gender) return '—';
  if (gender === 'male') return '男性';
  if (gender === 'female') return '女性';
  if (gender === 'other') return 'その他';
  return gender;
}

export function formatScopeTarget(target: string, storeName?: string) {
  if (target === 'all_stores') return '全店舗';
  if (target === 'specific_store') return storeName || '特定店舗';
  return target;
}
