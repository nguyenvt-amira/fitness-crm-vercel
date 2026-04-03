'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  getCrmStaffsQueryKey,
  postCrmStaffsInviteMutation,
} from '@/lib/api/@tanstack/react-query.gen';

import {
  STAFF_BRAND_LABELS,
  STAFF_ROLE_LABELS,
  StaffBrand,
  StaffRole,
} from '../_constants/constants';
import { type InviteStaffFormValues, inviteStaffSchema } from '../_schemas/invite-staff.schema';

// ─── Component ───────────────────────────────────────────────────────────────

interface InviteStaffModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteStaffModal({ open, onOpenChange }: InviteStaffModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<InviteStaffFormValues>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: {
      emails: '',
      role: StaffRole.STORE_STAFF,
      brand: StaffBrand.ALL,
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        emails: '',
        role: StaffRole.STORE_STAFF,
        brand: StaffBrand.ALL,
      });
    }
  }, [open, form]);

  const inviteMutation = useMutation({
    ...postCrmStaffsInviteMutation(),
    onSuccess: (data) => {
      toast.success(data.message || '招待メールを送信しました');
      queryClient.invalidateQueries({ queryKey: getCrmStaffsQueryKey() });
      onOpenChange(false);
    },
    onError: () => {
      toast.error('招待の送信に失敗しました');
    },
  });

  const onSubmit = (data: InviteStaffFormValues) => {
    const emails = data.emails
      .split('\n')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    inviteMutation.mutate({
      body: {
        emails,
        role: data.role,
        brand: data.brand,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-[14px] p-0 sm:max-w-[520px]">
        <div className="space-y-4 p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">スタッフを招待</DialogTitle>
            <DialogDescription>
              招待メールを送信します。受信者がメール内のリンクからアカウントを作成します。
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="invite-staff-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* メールアドレス */}
              <FormField
                control={form.control}
                name="emails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      メールアドレス <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          'example@joyfit.co.jp\n複数人を招待する場合は改行で区切ってください'
                        }
                        rows={4}
                        className="max-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 権限 */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      権限 <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="権限を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(STAFF_ROLE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ブランド */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ブランド</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="ブランドを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(STAFF_BRAND_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="border-t border-neutral-200 bg-neutral-100/50 px-4 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="font-medium"
            onClick={() => onOpenChange(false)}
            disabled={inviteMutation.isPending}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            form="invite-staff-form"
            size="sm"
            className="gap-1.5 font-medium"
            disabled={inviteMutation.isPending}
          >
            {inviteMutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            {inviteMutation.isPending ? '送信中...' : '招待メールを送信'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
