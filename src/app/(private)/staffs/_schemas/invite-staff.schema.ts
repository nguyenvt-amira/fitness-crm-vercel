import { z } from 'zod';

import { StaffBrand, StaffRole } from '../_constants/constants';

export const inviteStaffSchema = z.object({
  emails: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .refine(
      (value) => {
        const emails = value
          .split('\n')
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
        if (emails.length === 0) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emails.every((email) => emailRegex.test(email));
      },
      {
        message: '有効なメールアドレスを入力してください',
      },
    ),
  role: z.nativeEnum(StaffRole, {
    error: '権限を選択してください',
  }),
  brand: z.nativeEnum(StaffBrand).optional(),
});

export type InviteStaffFormValues = z.infer<typeof inviteStaffSchema>;
