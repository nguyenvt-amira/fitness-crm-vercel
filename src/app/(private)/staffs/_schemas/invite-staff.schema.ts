import { z } from 'zod';

import { StaffBrand } from '../_constants/constants';

export const inviteStaffSchema = z.object({
  emails: z.string().refine(
    (value) => {
      if (!value.trim()) return true;
      const emails = value
        .split('\n')
        .map((e) => e.trim())
        .filter((e) => e.length > 0);
      if (emails.length === 0) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emails.every((email) => emailRegex.test(email));
    },
    {
      message: '有効なメールアドレスを入力してください',
    },
  ),
  brand: z.nativeEnum(StaffBrand).optional(),
});

export type InviteStaffFormValues = z.infer<typeof inviteStaffSchema>;
