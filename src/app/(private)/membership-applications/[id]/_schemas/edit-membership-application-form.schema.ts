import { z } from 'zod';

export const EditMembershipApplicationFormSchema = z.object({
  // Basic
  applicant_name: z.string().min(1, { message: '氏名は必須です' }).max(255).optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
  blood_type: z.enum(['A', 'B', 'O', 'AB', 'unknown']).optional(),
  birthday: z.string().optional(), // UI provides YYYY-MM-DD (set undefined when empty)

  // Contact
  applicant_address: z.string().max(255).optional(),
  applicant_phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{9,11}$/.test(v), {
      message: '電話番号は9〜11桁の数字で入力してください',
    }),
  applicant_email: z.string().email({ message: 'メール形式が正しくありません' }).optional(),
  emergency_contact_name: z.string().max(255).optional(),
  emergency_contact_relationship: z.string().max(255).optional(),
  emergency_contact_phone: z.string().max(50).optional(),

  // Contract
  start_date: z.string().optional(), // UI provides YYYY-MM-DD (set undefined when empty)
  plan_id: z.string().max(100).optional(),
  plan_name: z.string().max(255).optional(),
  option_ids: z.array(z.string()).optional(),
});

export type EditMembershipApplicationFormSchema = z.infer<
  typeof EditMembershipApplicationFormSchema
>;
