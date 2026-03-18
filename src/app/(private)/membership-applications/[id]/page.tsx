'use client';

import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Clock, Download, FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  getCrmMembershipApplicationsByIdOptions,
  getCrmMembershipApplicationsInfiniteQueryKey,
  postCrmMembershipApplicationsByIdApproveMutation,
  postCrmMembershipApplicationsByIdRejectMutation,
} from '@/lib/api/@tanstack/react-query.gen';
import { navigate } from '@/lib/routes/routes.util';

import ApplicationDetailFooter from './_components/application-detail-footer';
import { BasicInfoCard } from './_components/basic-info-card';
import { ContractInfoTab } from './_components/contract-info-tab';
import { HistoryTab } from './_components/history-tab';
import { MemberInfoTab } from './_components/member-info-tab';
import { MembershipApplicationDetailSkeleton } from './_components/membership-application-detail-skeleton';
import { PaymentInfoTab } from './_components/payment-info-tab';
import { RiskDetailsSection } from './_components/risk-details-section';

const BREADCRUMB_ITEMS = [
  { url: '/membership-applications', label: '入会処理' },
  { label: '入会申込詳細画面' },
];

export default function MembershipApplicationDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const applicationId = params.id as string;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(() => tab || 'member-info');

  const { data, isLoading, error } = useQuery(
    getCrmMembershipApplicationsByIdOptions({
      path: { id: applicationId },
    }),
  );

  const approveMutation = useMutation(postCrmMembershipApplicationsByIdApproveMutation());
  const rejectMutation = useMutation(postCrmMembershipApplicationsByIdRejectMutation());

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        path: { id: applicationId },
      });
      toast.success('承認しました');
      // Invalidate list query to refresh
      queryClient.invalidateQueries({
        queryKey: getCrmMembershipApplicationsInfiniteQueryKey({ query: {} }),
      });
      // Navigate back to list
      navigate('/membership-applications');
    } catch (err: any) {
      const message = err?.error ?? err?.message ?? '承認に失敗しました';
      toast.error(message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        path: { id: applicationId },
      });
      toast.success('却下しました');
      queryClient.invalidateQueries({
        queryKey: getCrmMembershipApplicationsInfiniteQueryKey({ query: {} }),
      });
      navigate('/membership-applications');
    } catch (err: any) {
      const message = err?.error ?? err?.message ?? '却下に失敗しました';
      toast.error(message);
    }
  };

  if (isLoading) {
    return <MembershipApplicationDetailSkeleton />;
  }

  if (error || !data?.application) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-destructive">申込情報が見つかりません</div>
      </div>
    );
  }

  const application = data.application;
  const statusLabels: Record<string, string> = {
    pending: '要確認',
    payment_failed: '決済失敗',
    auto_approved: '自動承認済み',
    manual_approved: '手動承認済み',
    rejected: '却下',
    cancelled: 'キャンセル',
  };

  return (
    <div className="flex flex-1 flex-col pb-[70px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="default" className="gap-2">
            <Download className="size-4" />
            エクスポート
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                その他の操作
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.info('準備中です')}>
                <Printer className="mr-2 size-4" />
                印刷
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('準備中です')}>
                <Clock className="mr-2 size-4" />
                保留
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
        {/* Basic Info Card */}
        <BasicInfoCard
          application={application}
          statusLabels={statusLabels}
          onEdit={() => toast.info('準備中です')}
        />

        {/* Risk Details Section */}
        {application.risk_score > 0 && (
          <RiskDetailsSection
            riskScore={application.risk_score}
            riskReason={application.risk_reason}
            riskDetails={application.risk_details}
          />
        )}

        {/* Tabs */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
            <TabsList className="border-b bg-transparent">
              <TabsTrigger value="member-info" className="data-[state=active]:bg-secondary">
                会員情報
              </TabsTrigger>
              <TabsTrigger value="contract" className="data-[state=active]:bg-secondary">
                契約
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-secondary">
                支払い
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-secondary">
                利用履歴
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-1 overflow-auto">
              <TabsContent value="member-info" className="mt-4 flex-1">
                <MemberInfoTab application={application} />
              </TabsContent>
              <TabsContent value="contract" className="mt-4 flex-1">
                <ContractInfoTab application={application} />
              </TabsContent>
              <TabsContent value="payment" className="mt-4 flex-1">
                <PaymentInfoTab application={application} />
              </TabsContent>
              <TabsContent value="history" className="mt-4 flex-1">
                <HistoryTab application={application} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Action Footer */}
      <ApplicationDetailFooter application={application} />
    </div>
  );
}
