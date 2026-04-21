'use client';

import { useQuery } from '@tanstack/react-query';

import { DataStateBoundary } from '@/components/common/data-state-boundary';

import { getCrmMembersByIdContractsOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { GetCrmMembersByIdResponse } from '@/lib/api/types.gen';

import { ActiveCampaignsCard, CampaignHistoryCard } from './campaigns-card';
import { ContractSummaryCard } from './contract-summary-card';
import { MainContractCard } from './main-contract-card';
import { OptionContractsCard } from './option-contracts-card';
import { DayPassHistoryCard, PaymentHistoryCard } from './payment-history-card';
import { UsageStatusCard } from './usage-status-card';

type MemberStatus = GetCrmMembersByIdResponse['profile']['status'];

interface ContractsTabProps {
  memberId: string;
  memberStatus?: MemberStatus;
}

export function ContractsTab({ memberId, memberStatus }: ContractsTabProps) {
  const { data, isLoading, isError, refetch } = useQuery(
    getCrmMembersByIdContractsOptions({
      path: { id: memberId },
    }),
  );

  const isOnLeave = memberStatus === 'suspended';
  const isRetirePending = memberStatus === 'pending_withdrawal';
  const hasUnpaidFee = (data?.unpaid_info?.amount ?? 0) > 0;

  return (
    <DataStateBoundary
      isLoading={isLoading}
      isError={isError}
      isEmpty={!data}
      onRetry={() => refetch()}
    >
      {data ? (
        <div className="flex gap-4">
          {/* Left Column (60%) */}
          <div className="flex w-[60%] flex-col gap-4">
            <MainContractCard mainContract={data.main_contract} />

            <OptionContractsCard
              optionContracts={data.option_contracts}
              isOnLeave={isOnLeave}
              isRetirePending={isRetirePending}
              hasUnpaidFee={hasUnpaidFee}
            />

            <ActiveCampaignsCard campaigns={data.campaigns} />

            <CampaignHistoryCard campaigns={data.campaigns} />

            <PaymentHistoryCard paymentHistory={data.payment_info?.payment_history} />

            <DayPassHistoryCard />
          </div>

          {/* Right Column (40%) */}
          <div className="w-[40%]">
            <div className="sticky flex flex-col gap-4">
              <ContractSummaryCard
                mainContract={data.main_contract}
                optionContracts={data.option_contracts}
                paymentInfo={data.payment_info}
                unpaidInfo={data.unpaid_info}
              />
              <UsageStatusCard />

              {/* <PaymentInfoCard paymentInfo={data.payment_info} />

              <SpecialContractsCard specialContracts={data.special_contracts} /> */}
            </div>
          </div>
        </div>
      ) : null}
    </DataStateBoundary>
  );
}
