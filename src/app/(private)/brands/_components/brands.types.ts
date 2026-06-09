export interface BrandListItem {
  code: string;
  brandId: string;
  displayName: string;
  enrollmentFee: number | null;
  registrationAdminFee: number | null;
  cardIssuanceFee: number | null;
  otherFeeDescription: string | null;
}

export interface BrandFormValues {
  brandId: string;
  displayName: string;
  enrollmentFee: number | null;
  registrationAdminFee: number | null;
  cardIssuanceFee: number | null;
  otherFeeDescription: string | null;
}
