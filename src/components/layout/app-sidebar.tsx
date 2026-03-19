'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BookUser,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  DoorOpen,
  FileText,
  Home,
  Image,
  Package,
  Settings,
  User,
  Users,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { getRoutePattern } from '@/lib/routes/routes.util';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const menuItems = [
  {
    label: 'ダッシュボード',
    icon: Home,
    href: '/',
  },
  {
    label: '会員管理',
    icon: User,
    href: '/members',
    subItems: [
      {
        label: '移籍',
        href: '/members/transfer',
      },
      {
        label: '休会・退会',
        href: '/members/leave-withdrawal',
      },
    ],
  },
  {
    label: '入会処理',
    icon: FileText,
    href: getRoutePattern('/membership-applications'),
  },
  {
    label: '家族入会',
    icon: BookUser,
    href: getRoutePattern('/family-registrations'),
  },
  {
    label: '入退館',
    icon: DoorOpen,
    href: getRoutePattern('/checkin'),
    subItems: [
      {
        label: '入退館履歴',
        href: getRoutePattern('/checkin/histories'),
      },
    ],
  },
  {
    label: 'レッスン',
    icon: Calendar,
    href: '/lessons',
  },
  {
    label: '施設設備管理',
    icon: Settings,
    href: '/facilities',
  },
  {
    label: '売上',
    icon: CircleDollarSign,
    href: '/sales',
    subItems: [
      {
        label: '返金手続き一覧',
        href: '/sales/refund-procedures',
      },
    ],
  },
  {
    label: '商材・施策',
    icon: Package,
    href: '/products',
    subItems: [
      {
        label: '主契約',
        href: '/products/main-contract',
      },
      {
        label: 'オプション',
        href: '/products/options',
      },
      {
        label: 'キャンペーン',
        href: '/products/campaigns',
      },
      {
        label: 'アンケート',
        href: '/products/questionnaires',
      },
      {
        label: '入会金',
        href: '/products/enrollment-fee',
      },
    ],
  },
  {
    label: 'コンテンツ',
    icon: Image,
    href: '/content',
    subItems: [
      {
        label: '店舗ページ管理',
        href: '/content/store-pages',
      },
      {
        label: '告知・ブログ管理',
        href: '/content/announcements-blog',
      },
      {
        label: '通知管理',
        href: '/content/notifications',
      },
    ],
  },
  {
    label: 'システム設定',
    icon: Settings,
    href: '/settings',
    subItems: [
      {
        label: 'スタッフ・権限',
        href: '/settings/staff-permissions',
      },
      {
        label: '店舗',
        href: '/settings/stores',
      },
      {
        label: 'ブランド',
        href: '/settings/brands',
      },
      {
        label: 'FC企業',
        href: '/settings/fc-companies',
      },
      {
        label: '規約文書',
        href: '/settings/terms-documents',
      },
      {
        label: 'アプリ配信バージョン',
        href: '/settings/app-distribution',
      },
      {
        label: 'アプリメンテナンス',
        href: '/settings/app-maintenance',
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="mt-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href || item.subItems?.some((sub) => pathname === sub.href);
                const hasSubItems = item.subItems && item.subItems.length > 0;

                if (hasSubItems) {
                  const isSubItemActive = item.subItems?.some((sub) => pathname === sub.href);
                  return (
                    <Collapsible
                      key={item.href}
                      defaultOpen={isSubItemActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isActive}>
                            <Icon />
                            <span>{item.label}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                  <Link href={subItem.href}>
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
