export function FeeCurrentBadge({ status = 'active' }: { status?: 'active' | 'inactive' }) {
  const isInactive = status === 'inactive';

  return (
    <span
      className={`inline-flex h-5 items-center gap-1 rounded-full border px-2 py-0 text-[10px] font-semibold ${
        isInactive
          ? 'border-amber-200 bg-amber-100 text-amber-700'
          : 'border-green-200 bg-green-100 text-green-700'
      }`}
    >
      <span className={`size-1.5 rounded-full ${isInactive ? 'bg-amber-600' : 'bg-green-600'}`} />
      {isInactive ? '無効' : '現行'}
    </span>
  );
}
