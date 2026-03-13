'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Member } from '@/types/api/member.type';

interface PrintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
}

export function PrintModal({ open, onOpenChange, member }: PrintModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>会員情報印刷</DialogTitle>
          <DialogDescription>会員情報を印刷します。</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 print:p-8">
          {/* ヘッダー */}
          <div className="border-b pb-4">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-sm">店舗名: {member.profile.store_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  印刷日時: {new Date().toLocaleString('ja-JP')}
                </p>
              </div>
            </div>
          </div>

          {/* 基本情報 */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">基本情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">会員番号:</span>{' '}
                {member.basic_info.member_number}
              </div>
              <div>
                <span className="text-muted-foreground">氏名:</span> {member.basic_info.name_kanji}{' '}
                ({member.basic_info.name_kana})
              </div>
              <div>
                <span className="text-muted-foreground">生年月日:</span>{' '}
                {member.basic_info.birthday
                  ? new Date(member.basic_info.birthday).toLocaleDateString('ja-JP')
                  : '-'}{' '}
                ({member.basic_info.age || '-'}歳)
              </div>
              <div>
                <span className="text-muted-foreground">性別:</span>{' '}
                {member.basic_info.gender === 'male'
                  ? '男性'
                  : member.basic_info.gender === 'female'
                    ? '女性'
                    : 'その他'}
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">住所:</span>{' '}
                {[
                  member.basic_info.postal_code,
                  member.basic_info.prefecture,
                  member.basic_info.city,
                  member.basic_info.address,
                  member.basic_info.building,
                ]
                  .filter(Boolean)
                  .join(' ')}
              </div>
              <div>
                <span className="text-muted-foreground">電話番号:</span> {member.basic_info.phone}
              </div>
              <div>
                <span className="text-muted-foreground">メールアドレス:</span>{' '}
                {member.basic_info.email}
              </div>
            </div>
          </div>

          {/* 契約情報 */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">契約情報</h3>
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">主契約:</span> -{' '}
                {/* TODO: Get from contracts */}
              </p>
              <p>
                <span className="text-muted-foreground">オプション:</span> -{' '}
                {/* TODO: Get from contracts */}
              </p>
              <p>
                <span className="text-muted-foreground">決済方法:</span> -{' '}
                {/* TODO: Get from payment info */}
              </p>
            </div>
          </div>

          {/* ポイント保有状況 */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">ポイント保有状況</h3>
            <div className="text-sm">
              <p>
                <span className="text-muted-foreground">現在の保有ポイント:</span> -{' '}
                {/* TODO: Get from points */}
              </p>
            </div>
          </div>

          {/* 最近の来館履歴 */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">最近の来館履歴（直近10件）</h3>
            <div className="text-sm">
              <p className="text-muted-foreground">該当のデータがありません。</p>
              {/* TODO: Get from usage history */}
            </div>
          </div>

          {/* スタッフメモ */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold">スタッフメモ（重要度高のみ）</h3>
            <div className="text-sm">
              <p className="text-muted-foreground">該当のデータがありません。</p>
              {/* TODO: Get from communications */}
            </div>
          </div>

          {/* フッター */}
          <div className="border-t pt-4">
            <p className="text-muted-foreground text-center text-sm">ページ 1</p>
          </div>
        </div>

        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            閉じる
          </Button>
          <Button onClick={handlePrint}>印刷実行</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
