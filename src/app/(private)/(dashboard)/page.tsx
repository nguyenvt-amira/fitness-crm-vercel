'use client';

import { Home } from 'lucide-react';

import { BreadcrumbNav } from '@/components/common/breadcrumb-nav';

import {
  CampaignsTable,
  DashboardAlerts,
  HandoverNotesTable,
  KPISummary,
  NotificationsTable,
  RealtimeStatus,
  TodayReservations,
} from './_components';

const BREADCRUMB_ITEMS = [{ label: 'ダッシュボード' }];

// Mock data
const alerts = [
  {
    id: '1',
    title: '決済エラーの入会申し込みが3件あります。',
    description: '再決済手続きを進めてください。',
  },
  {
    id: '2',
    title: '異常系・要対応アラート',
    description: 'XXXXXXXX',
  },
];

const kpis = [
  {
    id: '1',
    label: '総収益',
    value: '¥1,000,000,000',
  },
  {
    id: '2',
    label: 'チケット販売枚数',
    value: '21',
  },
  {
    id: '3',
    label: '在籍総会員数',
    value: '1234人',
  },
  {
    id: '4',
    label: '継続率',
    value: 'XXX％',
  },
  {
    id: '5',
    label: '新規入会数',
    value: '0人',
    badge: {
      label: '前月比：+4.8%',
      variant: 'success' as const,
    },
  },
  {
    id: '6',
    label: '退会',
    value: '0人',
    badge: {
      label: '前月比：+0.5%',
      variant: 'error' as const,
    },
  },
];

const reservations = [
  {
    id: '1',
    lessonName: 'レッスン名',
    dateTime: '2026/01/10 12:00:00',
    space: '15名',
    trainer: {
      name: 'Name',
      initials: 'CN',
    },
    bookedCount: 0,
    capacity: 15,
  },
  {
    id: '2',
    lessonName: 'レッスン名',
    dateTime: '2026/01/10 12:00:00',
    space: '15名',
    trainer: {
      name: 'Name',
      initials: 'CN',
    },
    bookedCount: 0,
    capacity: 15,
  },
  {
    id: '3',
    lessonName: 'レッスン名',
    dateTime: '2026/01/10 12:00:00',
    space: '15名',
    trainer: {
      name: 'Name',
      initials: 'CN',
    },
    bookedCount: 0,
    capacity: 15,
  },
  {
    id: '4',
    lessonName: 'レッスン名',
    dateTime: '2026/01/10 12:00:00',
    space: '15名',
    trainer: {
      name: 'Name',
      initials: 'CN',
    },
    bookedCount: 0,
    capacity: 15,
  },
];

const campaigns = [
  {
    id: '1',
    name: 'キャンペーン名',
    contractCount: 1,
    period: '2025/01/01 ~ 2026/01/01',
  },
  {
    id: '2',
    name: 'キャンペーン名',
    contractCount: 1,
    period: '2025/01/01 ~ 2026/01/01',
  },
  {
    id: '3',
    name: 'キャンペーン名',
    contractCount: 1,
    period: '2025/01/01 ~ 2026/01/01',
  },
];

const notifications = [
  {
    id: '1',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '2',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '3',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '4',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '5',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '6',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '7',
    title: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
];

const handoverNotes = [
  {
    id: '1',
    content: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '2',
    content: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
  {
    id: '3',
    content: 'XXXXXXXXXXXXXXX',
    date: '2025/01/01',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-4">
        <Home className="text-foreground size-6" />
        <BreadcrumbNav items={BREADCRUMB_ITEMS} variant="section" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6 bg-gray-50/40 p-4">
        {/* Alerts Section */}
        <DashboardAlerts alerts={alerts} />

        {/* Real-time Status Section */}
        <div className="space-y-4">
          <RealtimeStatus
            totalCurrent={21}
            maleCurrent={18}
            femaleCurrent={3}
            totalToday={97}
            maleToday={63}
            femaleToday={34}
          />
          <TodayReservations reservations={reservations} totalCount={4} />
        </div>

        {/* KPI Summary Section */}
        <KPISummary kpis={kpis} />

        {/* Recent Schedule/Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">直近のスケジュール・タスク</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <CampaignsTable campaigns={campaigns} totalCount={3} />
            </div>
            <div className="flex-1">
              <NotificationsTable notifications={notifications} totalCount={7} />
            </div>
          </div>
        </div>

        {/* New Topics Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">新着トピック</h2>
          <HandoverNotesTable notes={handoverNotes} totalCount={3} />
        </div>
      </div>
    </div>
  );
}
