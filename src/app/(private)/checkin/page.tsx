'use client';

import { useState } from 'react';

import { ArrowLeft, ArrowRight, LogIn, Users } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { cn } from '@/lib/utils';

import {
  CheckinKpiCards,
  CurrentMembersGrid,
  MemberTable,
  NotificationPanel,
  PageControls,
} from './_components';

interface Member {
  id: string;
  name: string;
  kana: string;
  gender: 'M' | 'F';
  avatar: string;
  membershipType: string;
  membershipCode: string;
  checkInTime: string;
  gate: string;
  status?: string;
  visits: number;
}

interface Notification {
  id: string;
  type?: 'alert' | 'warning' | 'announcement';
  name: string;
  badge: string;
  title: string;
  description: string;
  avatar?: string;
}

const entryMembers: Member[] = [
  {
    id: '1',
    name: 'やばい奴',
    kana: 'ヤバイ ヤツ',
    gender: 'M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    membershipType: 'フィットネスクレジット会員2(相互利用なし)',
    membershipCode: '3750009173',
    checkInTime: '12:45',
    gate: 'ゲートA',
    status: '要対応',
    visits: 2,
  },
  {
    id: '2',
    name: '田中太郎',
    kana: 'タナカ タロウ',
    gender: 'M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    membershipCode: '3750008421',
    checkInTime: '14:00',
    gate: 'ゲートA',
    status: '誕生日',
    visits: 2,
  },
  {
    id: '3',
    name: '中村さくら',
    kana: 'ナカムラ サクラ',
    gender: 'F',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    membershipCode: '3750007856',
    checkInTime: '12:45',
    gate: 'ゲートA',
    status: 'もうすぐ誕生日',
    visits: 156,
  },
  {
    id: '4',
    name: '山本大輔',
    kana: 'ヤマモト ダイスケ',
    gender: 'M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    membershipType: 'ナイトクレジット会員(相互利用なし)',
    membershipCode: '3750006234',
    checkInTime: '12:45',
    gate: 'ゲートA',
    status: '久しぶり',
    visits: 72,
  },
  {
    id: '5',
    name: '伊藤健太',
    kana: 'イトウ ケンタ',
    gender: 'M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    membershipCode: '3750009251',
    checkInTime: '12:45',
    gate: 'ゲートA',
    visits: 203,
  },
];

const currentMembers: Member[] = [
  {
    id: '6',
    name: '高橋美咲',
    kana: 'タカハシ ミサキ',
    gender: 'F',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    membershipCode: '3750005678',
    checkInTime: '14:00',
    gate: 'ゲートA',
    visits: 2,
  },
  {
    id: '7',
    name: 'ジョイフィット太郎',
    kana: 'ジョイフィット タロウ',
    gender: 'M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    membershipType: 'フィットネスクレジット会員2(相互利用なし)',
    membershipCode: '3750009925',
    checkInTime: '14:00',
    gate: 'ゲートA',
    status: '要対応',
    visits: 2,
  },
  {
    id: '8',
    name: '中村さくら',
    kana: 'ナカムラ サクラ',
    gender: 'F',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    membershipCode: '3750007856',
    checkInTime: '14:00',
    gate: 'ゲートA',
    status: '常連',
    visits: 156,
  },
  {
    id: '9',
    name: '佐藤隆',
    kana: 'サトウ タカシ',
    gender: 'M',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    membershipType: 'フィットネスクレジット会員(相互利用なし)',
    membershipCode: '3750004321',
    checkInTime: '13:30',
    gate: 'ゲートB',
    visits: 31,
  },
  {
    id: '10',
    name: '鈴木花子',
    kana: 'スズキ ハナコ',
    gender: 'F',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    membershipCode: '3750003890',
    checkInTime: '13:15',
    gate: 'ゲートA',
    visits: 89,
  },
];

// Mock data for currently in gym members based on Figma design
const currentInGymMembers = [
  {
    id: '1',
    name: 'やばい奴',
    kana: 'ヤバイ ヤツ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    membershipType: 'フィットネスクレジット会員2(相互利用なし)',
    stayDuration: '滞在1時間30分',
    badge: '要対応',
    hasAlert: true,
  },
  {
    id: '2',
    name: '田中太郎',
    kana: 'タナカ タロウ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在2時間15分',
  },
  {
    id: '3',
    name: '中村さくら',
    kana: 'ナカムラ サクラ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    stayDuration: '滞在1時間45分',
  },
  {
    id: '4',
    name: '高橋美咲',
    kana: 'タカハシ ミサキ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在58分',
  },
  {
    id: '5',
    name: '山本大輔',
    kana: 'ヤマモト ダイスケ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    membershipType: 'ナイトクレジット会員(相互利用なし)',
    stayDuration: '滞在45分',
  },
  {
    id: '6',
    name: '渡辺愛美',
    kana: 'ワタナベ マナミ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在1時間10分',
  },
  {
    id: '7',
    name: '伊藤健太',
    kana: 'イトウ ケンタ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    stayDuration: '滞在30分',
  },
  {
    id: '8',
    name: '小林裕子',
    kana: 'コバヤシ ユウコ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    membershipType: 'フィットネスクレジット会員(相互利用なし)',
    stayDuration: '滞在2時間',
  },
  {
    id: '9',
    name: '加藤誠',
    kana: 'カトウ マコト',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在1時間20分',
  },
  {
    id: '10',
    name: '吉田恵',
    kana: 'ヨシダ メグミ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
    membershipType: 'ナイトクレジット会員(相互利用なし)',
    stayDuration: '滞在55分',
  },
  {
    id: '11',
    name: '松本翔',
    kana: 'マツモト ショウ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在40分',
  },
  {
    id: '12',
    name: '井上真理',
    kana: 'イノウエ マリ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=16',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    stayDuration: '滞在1時間5分',
  },
  {
    id: '13',
    name: '木村拓也',
    kana: 'キムラ タクヤ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=17',
    membershipType: 'フィットネスクレジット会員(相互利用なし)',
    stayDuration: '滞在25分',
  },
  {
    id: '14',
    name: '清水彩香',
    kana: 'シミズ アヤカ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=18',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在1時間50分',
  },
  {
    id: '15',
    name: '森田健一',
    kana: 'モリタ ケンイチ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=19',
    membershipType: 'ナイトクレジット会員(相互利用なし)',
    stayDuration: '滞在35分',
  },
  {
    id: '16',
    name: '藤井優',
    kana: 'フジイ ユウ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=20',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在1時間15分',
  },
  {
    id: '17',
    name: '岡田直樹',
    kana: 'オカダ ナオキ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=21',
    membershipType: 'プレミアムクレジット会員(相互利用あり)',
    stayDuration: '滞在50分',
  },
  {
    id: '18',
    name: '三浦美穂',
    kana: 'ミウラ ミホ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=22',
    membershipType: 'フィットネスクレジット会員(相互利用なし)',
    stayDuration: '滞在20分',
  },
  {
    id: '19',
    name: '石川大地',
    kana: 'イシカワ ダイチ',
    gender: 'M' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=23',
    membershipType: 'フィットネスクレジット会員(相互利用あり)',
    stayDuration: '滞在15分',
  },
  {
    id: '20',
    name: '前田香織',
    kana: 'マエダ カオリ',
    gender: 'F' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=24',
    membershipType: 'ナイトクレジット会員(相互利用なし)',
    stayDuration: '滞在10分',
  },
];

const notifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    name: 'やばい奴',
    badge: '要対応',
    title: '店舗警告設定',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    description: 'ブラックリスト登録済み。入館時に必ずスタッフが対応してください。',
  },
  {
    id: '2',
    type: 'alert',
    name: 'ジョイフィット太郎',
    badge: '要対応',
    title: '決済エラー',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    description: '月会費の引き落としに失敗しています。決済情報の更新を案内してください。',
  },
  {
    id: '3',
    type: 'alert',
    name: '佐藤隆',
    badge: '要対応',
    title: '会員資格失効',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    description: '会員資格の有効期限が切れています。更新手続きを案内してください。',
  },
  {
    id: '4',
    type: 'warning',
    name: '小林裕子',
    badge: '長時間滞在',
    title: '滞在 2時間超過',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    description: '2時間以上滞在しています。体調確認の声かけを推奨します。',
  },
  {
    id: '5',
    type: 'warning',
    name: '田中太郎',
    badge: '長時間滞在',
    title: '滞在 2時間15分',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    description: '通常の利用時間を大幅に超えています。確認をお勧めします。',
  },
  {
    id: '6',
    type: 'warning',
    name: '加藤誠',
    badge: '退館忘れ？',
    title: '滞在 4時間20分',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    description: '退館処理がされていません。退館忘れの可能性があります。',
  },
  {
    id: '7',
    type: 'warning',
    name: '鈴木花子',
    badge: '休会期間中',
    title: '利用制限中',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    description: '現在休会中のため入館できません。再開手続きをお願いします。',
  },
];

const announcements: Notification[] = [
  {
    id: '1',
    name: '田中太郎',
    badge: '誕生日',
    title: '本日が誕生日です',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    description: 'お祝いの声かけで顧客満足度アップにつなげましょう。',
  },
  {
    id: '2',
    name: '高橋美咲',
    badge: '入会1周年',
    title: '入会記念日',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    description: '継続利用への感謝を伝えましょう。',
  },
  {
    id: '3',
    name: '山本大輔',
    badge: '久しぶり',
    title: '32日ぶりの来館',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    description: '長期未利用からの復帰です。お声がけで継続利用を促しましょう。',
  },
  {
    id: '4',
    name: '伊藤健太',
    badge: '入会3周年',
    title: '継続利用3年記念',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    description: 'ロングタームメンバーのため、特典のご提案をお考えください。',
  },
  {
    id: '5',
    name: '中村さくら',
    badge: '誕生日',
    title: '来月が誕生日です',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    description: 'あらかじめお誕生日のご案内をいただけます。',
  },
];

export default function CheckinPage() {
  const [activeTab, setActiveTab] = useState('entry');
  const [open, setOpen] = useState(false);

  const alertNotifications = notifications.filter((n) => n.type === 'alert');
  const warningNotifications = notifications.filter((n) => n.type === 'warning');
  const announcementNotifications = announcements;

  return (
    <div className="w-full">
      {/* Header */}
      {/* <CheckinHeader /> */}

      {/* Main Content */}
      <div className={cn('flex w-full justify-between')}>
        <div className="w-full space-y-6 p-6">
          {/* Page Controls */}
          <PageControls
            currentDate="2026年11月1日"
            lastUpdated="14:02:35"
            onRefresh={() => {
              // Handle refresh logic
            }}
            onToggleNotifications={() => setOpen((prev) => !prev)}
          />

          {/* KPI Cards */}
          <CheckinKpiCards maleCount={18} femaleCount={3} totalCount={21} />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 rounded-lg bg-gray-50 p-1">
              <TabsTrigger value="entry" className="gap-2">
                <LogIn className="h-4 w-4" />
                入退館
              </TabsTrigger>
              <TabsTrigger value="current" className="gap-2">
                <Users className="h-4 w-4" />
                在館者
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-700">
                  21
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entry" className="space-y-4">
              <div className="flex justify-between gap-3">
                <MemberTable
                  title="入館"
                  icon={<ArrowLeft className="h-4 w-4 text-green-600" />}
                  members={entryMembers}
                  variant="entry"
                />
                <MemberTable
                  title="在館者"
                  icon={<ArrowRight className="h-4 w-4 text-green-600" />}
                  members={currentMembers}
                  variant="current"
                />
              </div>
            </TabsContent>

            <TabsContent value="current" className="space-y-4">
              <CurrentMembersGrid members={currentInGymMembers} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Notification Panel */}
        {open && (
          <div className="flex-1">
            <NotificationPanel
              alerts={alertNotifications}
              warnings={warningNotifications}
              announcements={announcementNotifications}
              onToggleNotifications={() => setOpen((prev) => !prev)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
