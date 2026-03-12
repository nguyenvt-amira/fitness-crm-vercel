'use client';

import { AlertCircle, AlertTriangle, BellRing, Info, PanelRightClose } from 'lucide-react';

import { TextWithTooltip } from '@/components/common/text-with-tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

type NotificationType = 'alert' | 'warning' | 'announcement';

interface NotificationItem {
  id: string;
  type?: NotificationType;
  name: string;
  badge: string;
  title: string;
  description: string;
  avatar?: string;
}

interface NotificationPanelProps {
  alerts: NotificationItem[];
  warnings: NotificationItem[];
  announcements: NotificationItem[];
  onToggleNotifications?: () => void;
}

const getNotificationTypeIcon = (type: NotificationType) => {
  if (type === 'alert') {
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  }
  if (type === 'warning') {
    return <AlertCircle className="h-5 w-5 text-amber-600" />;
  }
  return <Info className="h-5 w-5 text-blue-600" />;
};

const getNotificationTypeStyles = (type: NotificationType) => {
  if (type === 'alert') {
    return {
      headerBg: 'bg-red-50',
      headerIcon: 'bg-red-100',
      countBg: 'bg-red-100 text-red-600',
      cardBg: 'bg-red-50',
      cardBorder: 'border-red-200',
      badgeBg: 'bg-red-100 text-red-600',
    };
  }
  if (type === 'warning') {
    return {
      headerBg: 'bg-amber-50',
      headerIcon: 'bg-amber-100',
      countBg: 'bg-amber-100 text-amber-600',
      cardBg: 'bg-amber-50',
      cardBorder: 'border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-600',
    };
  }
  return {
    headerBg: 'bg-blue-50',
    headerIcon: 'bg-blue-100',
    countBg: 'bg-blue-100 text-blue-600',
    cardBg: 'bg-blue-50',
    cardBorder: 'border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-600',
  };
};

interface NotificationCardProps {
  item: NotificationItem;
  type: NotificationType;
}

const NotificationCard = ({ item, type }: NotificationCardProps) => {
  const styles = getNotificationTypeStyles(type);
  return (
    <div className={`rounded-lg border ${styles.cardBorder} ${styles.cardBg} p-3`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="mt-1 h-7 w-7 shrink-0">
          <AvatarImage src={item.avatar} />
          <AvatarFallback className={`${styles.headerIcon} `} />
        </Avatar>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + Badge */}
          <div className="mb-1 items-center gap-2">
            <TextWithTooltip text={item.name} className="text-xs font-bold text-gray-900" />
            <Badge
              variant="outline"
              className={`${styles.badgeBg} shrink-0 border-0 text-[10px] font-bold`}
            >
              {item.badge}
            </Badge>
          </div>
        </div>
      </div>
      {/* Title */}
      <TextWithTooltip text={item.title} className="mb-1 text-xs font-semibold text-gray-900" />

      {/* Description */}
      <TextWithTooltip text={item.description} lines={2} className="text-xs text-gray-600" />

      {/* <p className="line-clamp-2 text-xs text-gray-600">{item.description}</p> */}
    </div>
  );
};

export function NotificationPanel({
  alerts,
  warnings,
  announcements,
  onToggleNotifications,
}: Readonly<NotificationPanelProps>) {
  const { open } = useSidebar();

  if (!open) {
    return null;
  }

  const totalNotifications = alerts.length + warnings.length + announcements.length;

  return (
    <div className="flex w-full flex-col border-t border-gray-200 sm:w-80 sm:border-t-0 sm:border-l">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
            <BellRing className="h-4 w-4 text-gray-600" />
          </div>
          <h3 className="text-xs font-bold sm:text-sm">通知</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
            {totalNotifications}件
          </span>
        </div>
        <Button
          variant="ghost"
          className="h-6 text-gray-600"
          size="sm"
          onClick={onToggleNotifications}
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="h-[calc(100vh-var(--header-height))] flex-1 space-y-3 overflow-hidden px-3 sm:space-y-4">
        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm">要対応</h3>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                  {alerts.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {alerts.map((alert) => (
                <NotificationCard key={alert.id} item={alert} type="alert" />
              ))}
            </div>
          </div>
        )}

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm">注意</h3>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-600">
                  {warnings.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {warnings.map((warning) => (
                <NotificationCard key={warning.id} item={warning} type="warning" />
              ))}
            </div>
          </div>
        )}

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-xs font-bold text-gray-900 sm:text-sm">お知らせ</h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-600">
                  {announcements.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {announcements.map((announcement) => (
                <NotificationCard key={announcement.id} item={announcement} type="announcement" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
