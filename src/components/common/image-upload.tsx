'use client';

import { useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';

import { postCrmUploadsPresignMutation } from '@/lib/api/@tanstack/react-query.gen';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  readonly value: string | null;
  readonly onChange: (url: string | null) => void;
  readonly onUploadingChange?: (uploading: boolean) => void;
  readonly label?: string;
  readonly hint?: string;
  readonly disabled?: boolean;
  readonly hasError?: boolean;
  readonly category?: 'avatar' | 'cv' | 'document' | 'other';
}

export function ImageUpload({
  value,
  onChange,
  onUploadingChange,
  label,
  hint,
  disabled,
  hasError,
  category = 'avatar',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);

  const { mutateAsync: getPresignUrl } = useMutation(postCrmUploadsPresignMutation());

  async function handleFileChange(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ファイルサイズは5MB以下にしてください');
      return;
    }

    const contentType = file.type as 'image/jpeg' | 'image/png';

    setIsPending(true);
    onUploadingChange?.(true);

    try {
      // 1. Get presigned URL from backend
      const presign = await getPresignUrl({
        body: { category, content_type: contentType },
      });

      const presignUrl = presign?.presign_url;
      if (!presignUrl) {
        toast.error('アップロードに失敗しました');
        return;
      }

      // 2. Upload file directly to S3 via PUT
      const res = await fetch(presignUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!res.ok) {
        toast.error('アップロードに失敗しました');
        return;
      }

      onChange(presign.public_url);
    } catch {
      toast.error('アップロードに失敗しました');
    } finally {
      setIsPending(false);
      onUploadingChange?.(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  }

  const isInteractive = !disabled && !isPending;

  function renderContent() {
    if (isPending) {
      return <Loader2 className="text-muted-foreground size-8 animate-spin" />;
    }
    if (value) {
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="uploaded preview" className="h-full w-full object-cover" />
          <button
            type="button"
            className="bg-background/80 hover:bg-background absolute top-1 right-1 rounded-full p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          >
            <X className="size-4" />
          </button>
        </>
      );
    }
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <ImagePlus className="size-8" />
        <span className="text-sm">顔写真をアップロード</span>
        <span className="text-xs">JPG・PNG / 最大5MB / 正面・無帽</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        className={cn(
          'border-border relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          'hover:border-primary/50 hover:bg-muted/30',
          'h-40 overflow-hidden',
          !isInteractive && 'pointer-events-none opacity-60',
          hasError && 'border-destructive',
        )}
        onClick={() => isInteractive && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {renderContent()}
      </div>
      {hint && <span className="text-muted-foreground text-xs">{hint}</span>}
      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleInputChange}
        disabled={!isInteractive}
      />
    </div>
  );
}
