import { TEXTAREA_MAX_LENGTH, TEXT_MAX_LENGTH } from '@/constants/app.constants';
import { z } from 'zod';

const BRAND_ID_REGEX = /^[A-Za-z0-9_]+$/;
const feeSchema = z.number().int().min(0).nullable();

export const brandFormSchema = z.object({
  displayName: z.string().trim().min(1, 'ブランド名は必須です').max(TEXT_MAX_LENGTH),
  brandId: z
    .string()
    .trim()
    .min(1, 'ブランドIDは必須です')
    .max(TEXT_MAX_LENGTH)
    .regex(BRAND_ID_REGEX, '英数字とアンダースコアのみ入力できます'),
  enrollmentFee: feeSchema,
  registrationAdminFee: feeSchema,
  cardIssuanceFee: feeSchema,
  otherFeeDescription: z
    .string()
    .max(TEXTAREA_MAX_LENGTH, `その他費用は${TEXTAREA_MAX_LENGTH}文字以内で入力してください`),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;
