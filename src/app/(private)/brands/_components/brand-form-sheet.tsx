'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useScrollToFirstError } from '@/hooks/use-scroll-to-first-error';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { type BrandFormValues, brandFormSchema } from '../_schemas/brand-form.schema';

interface BrandFormSheetProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues: BrandFormValues;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: BrandFormValues) => Promise<string | null> | string | null;
}

export function BrandFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting,
  onOpenChange,
  onSave,
}: BrandFormSheetProps) {
  const scrollToFirstError = useScrollToFirstError();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema) as never,
    mode: 'onChange',
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues, mode, open]);

  const title = mode === 'create' ? 'ブランド新規登録' : 'ブランド編集';
  const handleSubmit = async (values: BrandFormValues) => {
    const errorMessage = await onSave(values);
    if (!errorMessage) return;

    form.setError('brandId', {
      type: 'manual',
      message: errorMessage,
    });
    scrollToFirstError();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-[384px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[384px]">
        <div className="shrink-0 border-b px-6 py-4">
          <SheetHeader className="gap-0 p-0">
            <SheetTitle className="text-sm font-semibold">{title}</SheetTitle>
            <SheetDescription className="sr-only">{title}フォーム</SheetDescription>
          </SheetHeader>
        </div>

        <Form {...form}>
          <form
            className="flex min-h-0 flex-1 flex-col"
            onSubmit={form.handleSubmit(handleSubmit, scrollToFirstError)}
          >
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        ブランド名
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="例: JOYFIT" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        ブランドID
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="例: joyfit"
                          onChange={(event) => {
                            if (form.formState.errors.brandId?.type === 'manual') {
                              form.clearErrors('brandId');
                            }
                            field.onChange(event.target.value);
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        英数字のみ。システム内部で使用されます。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-5">
                  <p className="text-sm font-semibold">費用（入会金・手数料）</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-5">
                    費用の設定はブランド詳細画面の「費用」タブで管理します。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 border-t p-4">
              <Button
                type="button"
                variant="outline"
                className="h-8 w-full rounded-xl text-sm"
                onClick={() => onOpenChange(false)}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                className="h-8 w-full rounded-xl text-sm"
                disabled={!form.formState.isValid || isSubmitting}
              >
                保存する
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
