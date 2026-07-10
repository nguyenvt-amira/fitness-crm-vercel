export const TERMS_STATUS_MOCK_AS_OF_DATE = '2025-11-15';

export type DerivedTermsStatus = 'published' | 'expired' | 'draft';
export type DerivedTermsVersionStatus = 'active' | 'expired' | 'draft';

interface TermsStatusInput {
  readonly effectiveDate: string;
  readonly expiryDate?: string | null;
  readonly isDeleted?: boolean;
  readonly asOfDate?: string;
}

function toUtcDateKey(date: Date): string {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTermsStatusAsOfDate(date?: Date): string {
  if (!date) return TERMS_STATUS_MOCK_AS_OF_DATE;
  return toUtcDateKey(date);
}

export function getTermsStatusFromDates({
  effectiveDate,
  expiryDate = null,
  isDeleted = false,
  asOfDate = getTermsStatusAsOfDate(),
}: TermsStatusInput): DerivedTermsStatus {
  if (effectiveDate > asOfDate) return 'draft';
  if (isDeleted) return 'expired';
  if (expiryDate && expiryDate < asOfDate) return 'expired';
  return 'published';
}

export function getTermsVersionStatusFromDates({
  effectiveDate,
  expiryDate = null,
  isDeleted = false,
  asOfDate = getTermsStatusAsOfDate(),
}: TermsStatusInput): DerivedTermsVersionStatus {
  if (effectiveDate > asOfDate) return 'draft';
  if (isDeleted) return 'expired';
  if (expiryDate && expiryDate < asOfDate) return 'expired';
  return 'active';
}
