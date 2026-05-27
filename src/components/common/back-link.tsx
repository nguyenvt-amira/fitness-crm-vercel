import { ChevronLeft } from 'lucide-react';

interface BackLinkProps {
  onClick: () => void;
  label: string;
}

/**
 * 1階層戻るナビゲーション（一覧→詳細 / 一覧→フォーム）
 * 2階層以上は shadcn Breadcrumb を使うこと
 */
export function BackLink({ onClick, label }: BackLinkProps) {
  return (
    <a
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1 text-xs"
    >
      <ChevronLeft className="size-3" />
      {label}
    </a>
  );
}
