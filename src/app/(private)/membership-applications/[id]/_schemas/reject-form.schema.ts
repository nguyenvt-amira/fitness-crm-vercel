import { z } from 'zod';

export const RejectFormSchema = z.object({
  rejection_reason: z
    .string()
    .min(1, { message: '却下理由は必須です' })
    .max(255, { message: '却下理由は255文字以内で入力してください' }),
});

export type RejectFormSchema = z.infer<typeof RejectFormSchema>;
