'use client';

import { useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Clock, Download, Printer } from 'lucide-react';
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

import { getCrmMembershipApplicationsByIdOptions } from '@/lib/api/@tanstack/react-query.gen';

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

  const [activeTab, setActiveTab] = useState(() => tab || 'member-info');

  const { data, isLoading, error } = useQuery(
    getCrmMembershipApplicationsByIdOptions({
      path: { id: applicationId },
    }),
  );

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
        <BasicInfoCard application={application} statusLabels={statusLabels} />

        {/* Risk Details Section */}
        {(application.risk_score > 0 || application.ekyc) && (
          <RiskDetailsSection
            riskScore={application.risk_score}
            riskReason={application.risk_reason}
            riskDetails={application.risk_details}
            ekyc={application.ekyc}
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
                契約情報
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-secondary">
                決済情報
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-secondary">
                履歴
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
                <PaymentInfoTab application={application} paymentStatusLabels={statusLabels} />
              </TabsContent>
              <TabsContent value="history" className="mt-4 flex-1">
                <HistoryTab application={application} statusLabels={statusLabels} />
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
