'use client';

import { useState } from 'react';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import { formatDate } from '@/utils/format.util';
import { useQuery } from '@tanstack/react-query';
import { MoreHorizontal, Pencil, User, UserCheck } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { DataStateBoundary } from '@/components/common/data-state-boundary';
import { RoleGatedButton } from '@/components/common/role-gated-button';
import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCrmMembersByIdOptions } from '@/lib/api/@tanstack/react-query.gen';
import { MemberStatus } from '@/lib/api/types.gen';
import { navigate } from '@/lib/routes/routes.util';

import { Permission } from '@/types/permission.type';

import { GENDER_CLASSES, MEMBER_STATUS_CLASSES, MEMBER_TYPE_LABELS } from '../_constants/constants';
import { MEMBER_STATUS_LABELS } from '../_constants/constants';
import { GENDER_LABELS } from '../_constants/constants';
import { PersonalDataDeleteDialog } from './_components/personal-data-delete-dialog';
import { ReEnrollSheet } from './_components/re-enroll-sheet';
import { BasicInfoTab } from './_components/tabs/basic-info-tab';
import { BodyDataTab } from './_components/tabs/body-data-tab';
// import { ChangeHistoryTab } from './_components/tabs/change-history-tab';
import { ContractsTab } from './_components/tabs/contracts-tab';
import { PaymentHistoryTab } from './_components/tabs/payment-history-tab';
import { PointsTab } from './_components/tabs/points-tab';
import { TrainingRecordsTab } from './_components/tabs/training-records-tab';
import { UsageHistoryTab } from './_components/tabs/usage-history-tab';
import { WithdrawSheet } from './_components/withdraw-sheet';

const BREADCRUMB_ITEMS = [{ url: '/members', label: '会員一覧' }, { label: '会員詳細' }];
const TABS = [
  'basic',
  'contracts',
  'payment',
  'usage',
  'points',
  'training',
  'body-data',
  // 'history',
] as const;

const isMemberTab = (value: string | null): value is (typeof TABS)[number] => {
  if (!value) return false;
  return TABS.includes(value as (typeof TABS)[number]);
};

export default function MemberDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const memberId = params.id as string;
  const activeTab = isMemberTab(tab) ? tab : 'basic';

  const [showReEnrollSheet, setShowReEnrollSheet] = useState(false);
  const [showWithdrawSheet, setShowWithdrawSheet] = useState(false);
  const [showPersonalDataDeleteDialog, setShowPersonalDataDeleteDialog] = useState(false);

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

  const handleSuspend = () => {
    // TODO: Navigate to suspend page (A-02-06)
    console.log('Suspend membership');
  };

  const handleWithdraw = () => {
    setShowWithdrawSheet(true);
  };
  const handleReEnroll = () => {
    setShowReEnrollSheet(true);
  };
  const handlePersonalDataDelete = () => {
    setShowPersonalDataDeleteDialog(true);
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

  const handleTabChange = (value: string) => {
    if (!isMemberTab(value)) return;

    const params = new URLSearchParams(searchParams.toString());

    if (value === 'basic') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
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
                    ID: {member.basic_info.member_number}/ 旧No:{' '}
                    {member.basic_info.old_member_number}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {/* Actions by status */}
                {!isWithdrawnStatus && (
                  <RoleGatedButton
                    size="sm"
                    requiredPermission={Permission.MembersPersonalDataEdit}
                    className="gap-1"
                    onClick={handleEdit}
                  >
                    <Pencil className="size-4" />
                    編集
                  </RoleGatedButton>
                )}
                {isWithdrawnStatus && (
                  <>
                    {/* C-01「管理画面入会」: HQ/Sys/Mgr/Staff ○、Trainer/Observer × */}
                    <RoleGatedButton
                      requiredPermission={Permission.MembersReEnroll}
                      denyTooltip="再入会登録の権限がありません"
                      size="sm"
                      onClick={handleReEnroll}
                    >
                      <UserCheck className="mr-1 size-4" />
                      再入会
                    </RoleGatedButton>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md border">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* A-01「個人情報変更」: HQ/Sys のみ */}
                        <RoleGatedMenuItem
                          requiredPermission={Permission.MembersPersonalDataDelete}
                          variant="destructive"
                          onClick={handlePersonalDataDelete}
                        >
                          個人情報削除
                        </RoleGatedMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                {!isWithdrawnStatus && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md border">
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.profile.status === MemberStatus.ACTIVE && (
                        <>
                          {/* A-01「ステータス変更」: HQ/Sys/Mgr/Staff ○、Trainer/Observer × */}
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersSuspend}
                            disabled={member.constraints.hasUnpaidFee}
                            onClick={handleSuspend}
                          >
                            <div className="flex flex-col">
                              <span>休会申請</span>
                              {member.constraints.hasUnpaidFee && (
                                <span className="text-destructive text-xs">
                                  未納金があるため操作できません
                                </span>
                              )}
                            </div>
                          </RoleGatedMenuItem>
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersWithdraw}
                            onClick={handleWithdraw}
                          >
                            退会申請
                          </RoleGatedMenuItem>
                          {/* A-02「承認・否認」: HQ/Sys/Mgr/Staff ○、Trainer/Observer × */}
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersTransfer}
                            disabled={
                              member.constraints.hasUnpaidFee ||
                              member.constraints.inCancellationPeriod
                            }
                            onClick={handleTransfer}
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
                          </RoleGatedMenuItem>
                          <DropdownMenuSeparator />
                          {/* A-01「ゲートストップ」: HQ/Sys/Mgr ○、Staff 自店舗のみ、Trainer/Observer × */}
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersGateStop}
                            onClick={handleGateStopSetting}
                          >
                            ゲートストップ設定
                          </RoleGatedMenuItem>
                          <DropdownMenuSeparator />
                          {/* A-01「BL管理（強制退会）」: HQ/Sys のみ */}
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersForceWithdraw}
                            className="text-destructive"
                            onClick={handleForceWithdraw}
                          >
                            強制退会
                          </RoleGatedMenuItem>
                        </>
                      )}
                      {member.profile.status === MemberStatus.SUSPENDED && (
                        <>
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersSuspend}
                            onClick={handleLeaveRelease}
                          >
                            休会解除
                          </RoleGatedMenuItem>
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersWithdraw}
                            onClick={handleWithdraw}
                          >
                            退会申請
                          </RoleGatedMenuItem>
                          <DropdownMenuSeparator />
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersGateStop}
                            onClick={handleGateStopSetting}
                          >
                            ゲートストップ設定
                          </RoleGatedMenuItem>
                          <DropdownMenuSeparator />
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersForceWithdraw}
                            className="text-destructive"
                            onClick={handleForceWithdraw}
                          >
                            強制退会
                          </RoleGatedMenuItem>
                        </>
                      )}
                      {member.profile.status === MemberStatus.GATE_STOP && (
                        <>
                          {/* ゲートストップ解除: HQ/Sys/Mgr ○、Staff 自店舗のみ、Trainer/Observer × */}
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersGateStop}
                            onClick={handleGateStopSetting}
                          >
                            ゲートストップ解除
                          </RoleGatedMenuItem>
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersWithdraw}
                            onClick={handleWithdraw}
                          >
                            退会申請
                          </RoleGatedMenuItem>
                          <DropdownMenuSeparator />
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersForceWithdraw}
                            className="text-destructive"
                            onClick={handleForceWithdraw}
                          >
                            強制退会
                          </RoleGatedMenuItem>
                        </>
                      )}
                      {member.profile.status === MemberStatus.PENDING_WITHDRAWAL && (
                        <>
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersWithdraw}
                            onClick={handleCancelWithdraw}
                          >
                            退会取り消し
                          </RoleGatedMenuItem>
                          <RoleGatedMenuItem
                            requiredPermission={Permission.MembersGateStop}
                            onClick={handleGateStopSetting}
                          >
                            ゲートストップ設定
                          </RoleGatedMenuItem>
                        </>
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
          onValueChange={handleTabChange}
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        >
          <div className="shrink-0 overflow-x-auto overflow-y-hidden pt-4 pb-2">
            <TabsList className="inline-flex min-w-max">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="contracts">契約操作</TabsTrigger>
              <TabsTrigger value="payment">支払い履歴</TabsTrigger>
              <TabsTrigger value="usage">利用履歴</TabsTrigger>
              <TabsTrigger value="points">ポイント履歴</TabsTrigger>
              <TabsTrigger value="training">トレーニング記録</TabsTrigger>
              <TabsTrigger value="body-data">ボディーデータ</TabsTrigger>
              {/* <TabsTrigger value="history">変更履歴</TabsTrigger> */}
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

            <TabsContent value="body-data">
              <BodyDataTab memberId={memberId} />
            </TabsContent>

            {/* <TabsContent value="history">
              <ChangeHistoryTab memberId={memberId} />
            </TabsContent> */}
          </ScrollArea>
        </Tabs>
      </div>

      <ReEnrollSheet
        open={showReEnrollSheet}
        onOpenChange={setShowReEnrollSheet}
        memberId={memberId}
        withdrawnAt={member.profile.withdrawn_at}
        lastPlan={member.profile.contract_id ? 'レギュラー会員 ¥7,700/月' : undefined}
      />

      <WithdrawSheet
        open={showWithdrawSheet}
        onOpenChange={setShowWithdrawSheet}
        memberId={memberId}
      />

      <PersonalDataDeleteDialog
        open={showPersonalDataDeleteDialog}
        onOpenChange={setShowPersonalDataDeleteDialog}
        memberId={memberId}
        isBlacklisted={member.profile.is_black_listed}
      />
    </div>
  );
}
