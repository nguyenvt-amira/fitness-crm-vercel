'use client';

import { useState } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { formatDate } from '@/utils/format.util';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Pencil, PlayCircle, User, UserCheck } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  deleteCrmMembersByIdMemosByMemoIdMutation,
  getCrmMembersByIdCommunicationsQueryKey,
  getCrmMembersByIdOptions,
  postCrmMembersByIdMemosMutation,
  putCrmMembersByIdMemosByMemoIdMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import { MemberStatus, type StaffMemo } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { GENDER_CLASSES, MEMBER_STATUS_CLASSES, MEMBER_TYPE_LABELS } from '../_constants/constants';
import { MEMBER_STATUS_LABELS } from '../_constants/constants';
import { GENDER_LABELS } from '../_constants/constants';
import { MemoModal } from './_components/memo-modal';
import { PrintModal } from './_components/print-modal';
import { BasicInfoTab } from './_components/tabs/basic-info-tab';
import { ChangeHistoryTab } from './_components/tabs/change-history-tab';
import { CommunicationsTab } from './_components/tabs/communications-tab';
import { ContractsTab } from './_components/tabs/contracts-tab';
import { PaymentHistoryTab } from './_components/tabs/payment-history-tab';
import { PointsTab } from './_components/tabs/points-tab';
import { RelationshipsTab } from './_components/tabs/relationships-tab';
import { ServiceUsageTab } from './_components/tabs/service-usage-tab';
import { TrainingRecordsTab } from './_components/tabs/training-records-tab';
import { UsageHistoryTab } from './_components/tabs/usage-history-tab';

const BREADCRUMB_ITEMS = [{ url: '/members', label: '会員一覧' }, { label: '会員詳細' }];

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const memo = searchParams.get('memo');

  const memberId = params.id as string;
  const [activeTab, setActiveTab] = useState(() =>
    tab === 'communications' ? 'communications' : 'basic',
  );
  const queryClient = useQueryClient();
  const [showMemoModal, setShowMemoModal] = useState(() => memo === 'add');
  const [editingMemo, setEditingMemo] = useState<StaffMemo | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const invalidateCommunications = () => {
    queryClient.invalidateQueries({
      queryKey: getCrmMembersByIdCommunicationsQueryKey({ path: { id: memberId } }),
    });
  };

  const postMemo = useMutation({
    ...postCrmMembersByIdMemosMutation(),
    onSuccess: invalidateCommunications,
  });
  const putMemo = useMutation({
    ...putCrmMembersByIdMemosByMemoIdMutation(),
    onSuccess: invalidateCommunications,
  });
  const deleteMemo = useMutation({
    ...deleteCrmMembersByIdMemosByMemoIdMutation(),
    onSuccess: invalidateCommunications,
  });

  const {
    data: member,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    getCrmMembersByIdOptions({
      path: {
        id: memberId,
      },
    }),
  );

  if (isLoading || isError || !member) {
    return (
      <DataStateBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={!member}
        onRetry={() => refetch()}
      />
    );
  }

  const fullAddress = [
    member.basic_info.postal_code,
    member.basic_info.prefecture,
    member.basic_info.city,
    member.basic_info.address,
    member.basic_info.building,
  ]
    .filter(Boolean)
    .join(' ');

  const handleEdit = () => {
    router.push(navigate('/members/[id]/edit', memberId));
  };

  const handleAddMemo = () => {
    setEditingMemo(null);
    setShowMemoModal(true);
  };

  const handleEditMemo = (memo: StaffMemo) => {
    setEditingMemo(memo);
    setShowMemoModal(true);
  };

  const handleMemoModalOpenChange = (open: boolean) => {
    setShowMemoModal(open);
    if (!open) setEditingMemo(null);
  };

  const handleSuspend = () => {
    // TODO: Navigate to suspend page (A-02-06)
    console.log('Suspend membership');
  };

  const handleWithdraw = () => {
    // TODO: Navigate to withdraw page (A-02-05)
    console.log('Withdraw membership');
  };
  const handleReEnroll = () => {
    // TODO: Open re-enroll sheet
    console.log('Re-enroll member');
  };
  const handlePersonalDataDelete = () => {
    // TODO: Open personal data delete dialog
    console.log('Delete personal data');
  };
  const handleTransfer = () => {
    // TODO: Open transfer apply sheet
    console.log('Transfer apply');
  };
  const handleGateStopSetting = () => {
    // TODO: Open gate stop setting sheet
    console.log('Gate stop setting');
  };
  const handleForceWithdraw = () => {
    // TODO: Open force-withdraw dialog
    console.log('Force withdraw');
  };
  const handleLeaveRelease = () => {
    // TODO: Open leave release sheet
    console.log('Leave release');
  };
  const handleCancelWithdraw = () => {
    // TODO: Cancel pending withdraw
    console.log('Cancel pending withdraw');
  };

  const memberStatusLabel = MEMBER_STATUS_LABELS[member.profile.status];
  const isWithdrawnStatus =
    member.profile.status === MemberStatus.WITHDRAWN ||
    member.profile.status === MemberStatus.FORCE_WITHDRAWN;
  const handleSaveMemo = (data: { type: 'caution' | 'vip' | 'other'; content: string }) => {
    const onSuccess = () => {
      setShowMemoModal(false);
      setEditingMemo(null);
    };
    if (editingMemo) {
      putMemo.mutate(
        {
          path: { id: memberId, memoId: editingMemo.id },
          body: { type: data.type, content: data.content.trim() },
        },
        { onSuccess },
      );
    } else {
      postMemo.mutate(
        {
          path: { id: memberId },
          body: { type: data.type, content: data.content.trim() },
        },
        { onSuccess },
      );
    }
  };

  const handleDeleteMemo = (memoId: string) => {
    deleteMemo.mutate(
      { path: { id: memberId, memoId } },
      {
        onSuccess: () => {
          setShowMemoModal(false);
          setEditingMemo(null);
        },
      },
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b px-4 py-4">
        <div className="text-muted-foreground flex size-6 items-center justify-center">
          <User className="size-6" />
        </div>
        <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
      </div>

      {/* Header */}
      <div className="bg-card shrink-0 border-b p-4">
        <Card className="mb-0 py-4">
          <CardContent className="flex flex-col gap-3 px-4 py-3">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={member.ekyc?.photoUrl} alt={member.basic_info.name_kanji} />
                  <AvatarFallback>
                    {member.basic_info.name_kanji
                      .split(' ')
                      .map((s) => s[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold">{member.basic_info.name_kanji}</h1>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${MEMBER_STATUS_CLASSES[member.profile.status]}`}
                    >
                      <span className="mr-1 inline-block size-1.5 rounded-full bg-current" />
                      {memberStatusLabel}
                    </Badge>
                    {member.profile.member_type && (
                      <Badge variant="outline" className="text-[10px]">
                        {MEMBER_TYPE_LABELS[member.profile.member_type]}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {member.basic_info.name_kana}
                  </p>
                  <div className="text-muted-foreground mt-1 font-mono text-xs">
                    ID: {member.basic_info.member_number}/ 旧No:
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!isWithdrawnStatus && (
                  <Button size="sm" className="gap-1" onClick={handleEdit}>
                    <Pencil className="size-4" />
                    編集
                  </Button>
                )}
                {isWithdrawnStatus && (
                  <>
                    <Button size="sm" className="gap-1" onClick={handleReEnroll}>
                      <UserCheck className="size-4" />
                      再入会
                    </Button>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-input bg-background hover:bg-accent hover:text-accent-foreground size-8"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={handlePersonalDataDelete}
                        >
                          個人情報削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {!isWithdrawnStatus && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-input bg-background hover:bg-accent hover:text-accent-foreground size-8"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.profile.status === MemberStatus.ACTIVE && (
                        <>
                          <DropdownMenuItem
                            disabled={member.constraints.hasUnpaidFee}
                            onSelect={handleSuspend}
                          >
                            <div className="flex flex-col">
                              <span>休会申請</span>
                              {member.constraints.hasUnpaidFee && (
                                <span className="text-destructive text-xs">
                                  未納金があるため操作できません
                                </span>
                              )}
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={handleWithdraw}>退会申請</DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={
                              member.constraints.hasUnpaidFee ||
                              member.constraints.inCancellationPeriod
                            }
                            onSelect={handleTransfer}
                          >
                            <div className="flex flex-col">
                              <span>移籍申請</span>
                              {member.constraints.inCancellationPeriod && (
                                <span className="text-destructive text-xs">
                                  解約手数料期間中のため移籍できません
                                </span>
                              )}
                              {!member.constraints.inCancellationPeriod &&
                                member.constraints.hasUnpaidFee && (
                                  <span className="text-destructive text-xs">
                                    未納金があるため操作できません
                                  </span>
                                )}
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={handleGateStopSetting}>
                            ゲートストップ設定
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={handleForceWithdraw}
                          >
                            強制退会
                          </DropdownMenuItem>
                        </>
                      )}
                      {member.profile.status === MemberStatus.SUSPENDED && (
                        <>
                          <DropdownMenuItem onSelect={handleLeaveRelease}>
                            <PlayCircle className="size-4" />
                            休会解除
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={handleWithdraw}>退会申請</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={handleGateStopSetting}>
                            ゲートストップ設定
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={handleForceWithdraw}
                          >
                            強制退会
                          </DropdownMenuItem>
                        </>
                      )}
                      {member.profile.status === MemberStatus.PENDING_WITHDRAWAL && (
                        <DropdownMenuItem onSelect={handleCancelWithdraw}>
                          退会取り消し
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <Separator />
            {member.profile.status === MemberStatus.GATE_STOP && (
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTitle>ゲートストップ中</AlertTitle>
                <AlertDescription>全店舗への入館が制限されています。</AlertDescription>
              </Alert>
            )}

            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <dt className="text-muted-foreground mb-1 text-xs">生年月日</dt>
                <dd className="text-sm font-medium">
                  {member.basic_info.birthday
                    ? `${formatDate(member.basic_info.birthday)}（${member.basic_info.age ?? '—'}歳）`
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs">性別</dt>
                <dd className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className={`text-xs ${GENDER_CLASSES[member.basic_info.gender]}`}
                  >
                    {GENDER_LABELS[member.basic_info.gender]}
                  </Badge>
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-muted-foreground mb-1 text-xs">住所</dt>
                <dd className="text-sm font-medium">{fullAddress || '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs">電話番号</dt>
                <dd className="text-sm font-medium">{member.basic_info.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs">メールアドレス</dt>
                <dd className="text-sm font-medium">{member.basic_info.email || '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs">主契約店舗</dt>
                <dd className="text-sm font-medium">{member.profile.store_name || '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs">登録日</dt>
                <dd className="text-sm font-medium">
                  {member.profile.joined_at ? formatDate(member.profile.joined_at) : '—'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 pt-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        >
          <div className="shrink-0 overflow-x-auto overflow-y-hidden pt-4 pb-2">
            <TabsList className="inline-flex min-w-max">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="contracts">契約操作</TabsTrigger>
              <TabsTrigger value="payment">支払い履歴</TabsTrigger>
              <TabsTrigger value="usage">利用履歴</TabsTrigger>
              <TabsTrigger value="points">ポイント履歴</TabsTrigger>
              <TabsTrigger value="service">サービス利用履歴</TabsTrigger>
              <TabsTrigger value="communications">コミュニケーション</TabsTrigger>
              <TabsTrigger value="training">トレーニング記録</TabsTrigger>
              <TabsTrigger value="history">変更履歴</TabsTrigger>
              <TabsTrigger value="relationships">関係者情報</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="mt-2 min-h-0 min-w-0 flex-1 overflow-hidden pr-2">
            <TabsContent value="basic">
              <BasicInfoTab member={member} />
            </TabsContent>

            <TabsContent value="contracts">
              <ContractsTab memberId={memberId} memberStatus={member.profile.status} />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentHistoryTab memberId={memberId} />
            </TabsContent>

            <TabsContent value="points">
              <PointsTab memberId={memberId} brand={member.profile.brand} />
            </TabsContent>

            <TabsContent value="usage">
              <UsageHistoryTab memberId={memberId} />
            </TabsContent>

            <TabsContent value="training">
              <TrainingRecordsTab memberId={memberId} />
            </TabsContent>

            <TabsContent value="service">
              <ServiceUsageTab memberId={memberId} />
            </TabsContent>

            <TabsContent value="communications">
              <CommunicationsTab
                memberId={memberId}
                onAddMemo={handleAddMemo}
                onEditMemo={handleEditMemo}
                onDeleteMemo={handleDeleteMemo}
              />
            </TabsContent>

            <TabsContent value="history">
              <ChangeHistoryTab memberId={memberId} />
            </TabsContent>

            <TabsContent value="relationships">
              <RelationshipsTab memberId={memberId} />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Modals */}
      <MemoModal
        open={showMemoModal}
        onOpenChange={handleMemoModalOpenChange}
        memo={editingMemo}
        onSave={handleSaveMemo}
        onDelete={handleDeleteMemo}
        isSaving={postMemo.isPending || putMemo.isPending}
        isDeleting={deleteMemo.isPending}
      />
      <PrintModal open={showPrintModal} onOpenChange={setShowPrintModal} member={member} />
    </div>
  );
}
