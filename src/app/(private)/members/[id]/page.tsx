'use client';

import { useParams } from 'next/navigation';

import { Edit, Mail, User } from 'lucide-react';

import { BreadcrumbItemType, BreadcrumbNav } from '@/components/common/breadcrumb-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ContractsAlert, ContractsOverview } from '../../contracts/_components/contracts-overview';
import { MemberContracts } from './_components/member-contracts-section';

// Mock: application processing (入会処理) dashboard data
const MOCK_SUMMARY = {
  totalApplications: 1234,
  autoApprovalRate: 82.5,
  autoApprovalCount: 678,
  avgProcessingTime: '1h23m',
};

const MOCK_ALERTS: ContractsAlert[] = [
  {
    title: '要確認の入会申し込みが12件あります。',
    description: '承認もしくは却下の操作を行なってください。',
  },
  {
    title: '決済エラーの入会申し込みが3件あります。',
    description: '再決済手続きを進めてください。',
  },
];

const BREADCRUMB_ITEMS: BreadcrumbItemType[] = [
  { url: '/', label: '会員管理' },
  { label: '会員詳細' },
];

export default function ContractsPage() {
  useParams(); // [id] - use when wiring real API

  const MOCK_MEMBER = {
    id: 'M-00001',
    name: '佐藤 花子',
    kana: 'サトウ ハナコ',
    email: 'hanako.sato@example.com',
    phone: '090-1234-5678',
    status: 'アクティブ',
    joinedAt: '2024/01/15',
    membership: 'Fit365八潮店',
    contracts: '通常会員',
    online: '0回',
    gender: '女性',
    birthday: '1990/01/01',
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <div className="text-muted-foreground flex size-6 items-center justify-center">
          <User className="size-6" />
        </div>
        <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
      </div>
      <div className="p-4">
        <Card className="overflow-hidden rounded-lg border shadow-sm">
          <CardHeader className="flex items-start gap-4">
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                {/* If you have a real avatar URL, pass it to AvatarImage */}
                <AvatarImage src="/file.svg" alt={MOCK_MEMBER.name} />
                <AvatarFallback>
                  {MOCK_MEMBER.name
                    .split(' ')
                    .map((s) => s[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <CardTitle className="text-lg">
                  {MOCK_MEMBER.name} <span className="text-base font-normal">ヤマダタロウ</span>
                </CardTitle>
                <CardDescription className="text-foreground flex items-center gap-2">
                  <span className="text-sm">性別：{MOCK_MEMBER.gender}</span>
                  <span className="text-sm">生年月日：{MOCK_MEMBER.birthday}</span>
                </CardDescription>
                <div className="text-muted-foreground text-sm">{MOCK_MEMBER.id}</div>

                {/* <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge>{MOCK_MEMBER.membership}</Badge>
                  <Badge variant="outline">{MOCK_MEMBER.status}</Badge>
                </div> */}
              </div>
            </div>

            {/* <CardAction>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="size-4" /> 編集
                </Button>
                <Button size="sm">
                  <Mail className="size-4" /> メッセージ
                </Button>
              </div>
            </CardAction> */}
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <p className="text-base font-medium">会員ステータス</p>
                <p className="break-all">
                  <Badge variant="secondary">{MOCK_MEMBER.status}</Badge>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium">所属店舗</p>
                <p>{MOCK_MEMBER.membership}</p>
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium">主契約</p>
                <p>{MOCK_MEMBER.contracts}</p>
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium">当月の入館回数</p>
                <p>{MOCK_MEMBER.online}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <ContractsOverview summary={MOCK_SUMMARY} alerts={MOCK_ALERTS} /> */}

      <MemberContracts />
    </div>
  );
}
