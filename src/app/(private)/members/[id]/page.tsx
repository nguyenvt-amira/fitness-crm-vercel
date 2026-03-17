'use client';

import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertOctagon,
  ArrowLeft,
  Building2,
  Edit,
  MessageSquare,
  Printer,
  User,
} from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  deleteCrmMembersByIdMemosByMemoIdMutation,
  getCrmMembersByIdCommunicationsQueryKey,
  getCrmMembersByIdOptions,
  postCrmMembersByIdMemosMutation,
  putCrmMembersByIdMemosByMemoIdMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import { navigate } from '@/lib/routes/routes.util';

import type { GetMemberDetailResponse, StaffMemo } from '@/types/api/member.type';
import { Brand, MemberStatus } from '@/types/api/member.type';

import { BasicInfoTab } from './_components/basic-info-tab';
import { ChangeHistoryTab } from './_components/change-history-tab';
import { CommunicationsTab } from './_components/communications-tab';
import { ContractsTab } from './_components/contracts-tab';
import { EditMemberModal } from './_components/edit-member-modal';
import { MemoModal } from './_components/memo-modal';
import { PointsTab } from './_components/points-tab';
import { PrintModal } from './_components/print-modal';
import { RelationshipsTab } from './_components/relationships-tab';
import { ServiceUsageTab } from './_components/service-usage-tab';
import { TrainingRecordsTab } from './_components/training-records-tab';
import { UsageHistoryTab } from './_components/usage-history-tab';

const BREADCRUMB_ITEMS = [{ url: '/members', label: '会員一覧' }, { label: '会員詳細' }];

export default function MemberDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const memo = searchParams.get('memo');

  const memberId = params.id as string;
  const [activeTab, setActiveTab] = useState(() =>
    tab === 'communications' ? 'communications' : 'basic',
  );
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
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

  const { data, isLoading } = useQuery(
    getCrmMembersByIdOptions({
      path: {
        id: memberId,
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!data?.member) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-destructive">会員情報が見つかりません</div>
      </div>
    );
  }

  // Type assertion to use the proper type from member.type.ts
  const typedData = data as unknown as GetMemberDetailResponse;
  const { member } = typedData;
  const statusLabels: Record<MemberStatus, string> = {
    [MemberStatus.ACTIVE]: '利用中',
    [MemberStatus.SUSPENDED]: '休会中',
    [MemberStatus.WITHDRAWN]: '退会済み',
    [MemberStatus.FORCE_WITHDRAWN]: '強制退会済み',
  };

  const STATUS_VARIANTS: Record<MemberStatus, 'default' | 'secondary' | 'destructive' | 'outline'> =
    {
      [MemberStatus.ACTIVE]: 'default',
      [MemberStatus.SUSPENDED]: 'secondary',
      [MemberStatus.WITHDRAWN]: 'outline',
      [MemberStatus.FORCE_WITHDRAWN]: 'destructive',
    };

  // Mock alerts - in real app, these would come from API
  const has_unpaid = false; // TODO: Get from member data
  const contractRenewalSoon = false; // TODO: Calculate from contract end date

  const handleEdit = () => {
    setShowEditModal(true);
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

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleChangeMainContract = () => {
    // TODO: Navigate to main contract change page (B-01)
    console.log('Change main contract');
  };

  const handleSuspend = () => {
    // TODO: Navigate to suspend page (A-02-06)
    console.log('Suspend membership');
  };

  const handleWithdraw = () => {
    // TODO: Navigate to withdraw page (A-02-05)
    console.log('Withdraw membership');
  };

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
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <div className="text-muted-foreground flex size-6 items-center justify-center">
          <User className="size-6" />
        </div>
        <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
      </div>

      {/* Header */}
      <div className="bg-card border-b p-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={member.ekyc?.photoUrl} alt={member.basic_info.name_kanji} />
                  <AvatarFallback>
                    {member.basic_info.name_kanji
                      .split(' ')
                      .map((s) => s[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{member.basic_info.name_kanji}</CardTitle>
                    <span className="text-muted-foreground text-base font-normal">
                      {member.basic_info.name_kana}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={STATUS_VARIANTS[member.profile.status]}>
                      {statusLabels[member.profile.status]}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Building2 className="size-3" />
                      {member.profile.brand === Brand.FIT365 ? 'FIT365' : 'JOYFIT'}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {member.profile.store_name}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-sm">
                    会員番号: {member.basic_info.member_number}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/members')}>
                  <ArrowLeft className="mr-2 size-4" />
                  一覧に戻る
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 size-4" />
                  印刷
                </Button>
                <Button variant="outline" size="sm" onClick={handleAddMemo}>
                  <MessageSquare className="mr-2 size-4" />
                  メモ追加
                </Button>
                <Button size="sm" onClick={handleEdit}>
                  <Edit className="mr-2 size-4" />
                  編集
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Alert Area */}
            {(has_unpaid || contractRenewalSoon) && (
              <Alert variant={has_unpaid ? 'destructive' : 'default'}>
                <AlertOctagon className="size-4" />
                <AlertTitle>アラート</AlertTitle>
                <AlertDescription>
                  {has_unpaid && '未納金があります。'}
                  {contractRenewalSoon && '契約更新が間近です。'}
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleChangeMainContract}>
                主契約変更
              </Button>
              <Button variant="outline" size="sm" onClick={handleSuspend}>
                休会処理
              </Button>
              <Button variant="outline" size="sm" onClick={handleWithdraw}>
                退会処理
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="contracts">契約情報</TabsTrigger>
            <TabsTrigger value="points">ポイント</TabsTrigger>
            <TabsTrigger value="usage">利用履歴</TabsTrigger>
            <TabsTrigger value="training">トレーニング記録</TabsTrigger>
            <TabsTrigger value="service">サービス利用</TabsTrigger>
            <TabsTrigger value="communications">コミュニケーション</TabsTrigger>
            <TabsTrigger value="history">変更履歴</TabsTrigger>
            <TabsTrigger value="relationships">関係性</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-4">
            <BasicInfoTab memberId={memberId} />
          </TabsContent>

          <TabsContent value="contracts" className="mt-4">
            <ContractsTab memberId={memberId} />
          </TabsContent>

          <TabsContent value="points" className="mt-4">
            <PointsTab memberId={memberId} brand={member.profile.brand} />
          </TabsContent>

          <TabsContent value="usage" className="mt-4">
            <UsageHistoryTab memberId={memberId} />
          </TabsContent>

          <TabsContent value="training" className="mt-4">
            <TrainingRecordsTab memberId={memberId} />
          </TabsContent>

          <TabsContent value="service" className="mt-4">
            <ServiceUsageTab memberId={memberId} />
          </TabsContent>

          <TabsContent value="communications" className="mt-4">
            <CommunicationsTab
              memberId={memberId}
              onAddMemo={handleAddMemo}
              onEditMemo={handleEditMemo}
              onDeleteMemo={handleDeleteMemo}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ChangeHistoryTab memberId={memberId} />
          </TabsContent>

          <TabsContent value="relationships" className="mt-4">
            <RelationshipsTab memberId={memberId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EditMemberModal open={showEditModal} onOpenChange={setShowEditModal} member={member} />
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
