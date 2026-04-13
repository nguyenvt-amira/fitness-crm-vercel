'use client';

import { MEMO_TYPE_LABELS } from '@/app/(private)/members/_constants/constants';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';

import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { getCrmMembersByIdCommunicationsOptions } from '@/lib/api/@tanstack/react-query.gen';
import { MemoType, StaffMemo } from '@/lib/api/types.gen';

interface CommunicationsTabProps {
  memberId: string;
  onAddMemo?: () => void;
  onEditMemo?: (memo: StaffMemo) => void;
  onDeleteMemo?: (memoId: string) => void;
}

export function CommunicationsTab({
  memberId,
  onAddMemo,
  onEditMemo,
  onDeleteMemo,
}: CommunicationsTabProps) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdCommunicationsOptions({
      path: { id: memberId },
    }),
  );

  const handleDelete = (memoId: string) => {
    if (!onDeleteMemo) return;
    if (!confirm('このメモを削除しますか？')) return;
    onDeleteMemo(memoId);
  };

  return (
    <DataStateBoundary
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data}
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>スタッフメモ</CardTitle>
              {onAddMemo && (
                <Button variant="outline" size="sm" onClick={onAddMemo}>
                  <MessageSquare className="mr-2 size-4" />
                  メモ追加
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {((data as { memos?: StaffMemo[] }).memos ?? []).length === 0 ? (
                <p className="text-muted-foreground text-sm">メモはまだありません。</p>
              ) : (
                <div className="space-y-4">
                  {((data as { memos?: StaffMemo[] }).memos ?? []).map((memo) => (
                    <div
                      key={memo.id}
                      className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-muted-foreground text-sm">
                          {MEMO_TYPE_LABELS[memo.type as MemoType] ?? memo.type}
                        </span>
                        <p className="font-medium">{memo.content}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {new Date(memo.date).toLocaleString('ja-JP')} - {memo.created_by}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {onEditMemo && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => onEditMemo(memo)}
                            aria-label="編集"
                          >
                            <Pencil className="size-4" />
                          </Button>
                        )}
                        {onDeleteMemo && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive size-8"
                            onClick={() => handleDelete(memo.id)}
                            aria-label="削除"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {((data as { inquiries?: unknown[] }).inquiries?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>問い合わせ・対応履歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(
                    (
                      data as {
                        inquiries: Array<{
                          id: string;
                          date: string;
                          content: string;
                          staff_name: string;
                        }>;
                      }
                    ).inquiries ?? []
                  ).map((inq) => (
                    <div key={inq.id} className="border-b pb-2">
                      <p className="font-medium">{inq.content}</p>
                      <p className="text-muted-foreground text-sm">
                        {new Date(inq.date).toLocaleString('ja-JP')} - {inq.staff_name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </DataStateBoundary>
  );
}
