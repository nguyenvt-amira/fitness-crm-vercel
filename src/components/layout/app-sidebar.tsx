'use client';

import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, type LucideIcon, Settings, UserPlus, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { getRoutePattern } from '@/lib/routes/routes.util';
import { cn } from '@/lib/utils';

import { Collapsible, CollapsibleContent } from '../ui/collapsible';

type SubItem = {
  label: string;
  href: string;
};

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  subItems?: SubItem[];
};

const menuItems: MenuItem[] = [
  {
    label: 'ダッシュボード',
    icon: Home,
    href: '/',
  },
  {
    label: '会員管理',
    icon: Users,
    href: '/members',
    // subItems: [
    //   {
    //     label: '移籍',
    //     href: '/members/transfer',
    //   },
    //   {
    //     label: '休会・退会',
    //     href: '/members/leave-withdrawal',
    //   },
    // ],
  },
  {
    label: '入会処理',
    icon: UserPlus,
    href: getRoutePattern('/membership-applications'),
  },
  {
    label: '家族入会',
    icon: UserPlus,
    href: getRoutePattern('/family-registrations'),
    subItems: [
      {
        label: 'ダッシュボード',
        href: '/family-registrations/dashboard',
      },
    ],
  },
  // {
  //   label: '入退館',
  //   icon: DoorOpen,
  //   href: getRoutePattern('/checkin'),
  //   subItems: [
  //     {
  //       label: '入退館履歴',
  //       href: getRoutePattern('/checkin/histories'),
  //     },
  //   ],
  // },
  // {
  //   label: 'レッスン',
  //   icon: Calendar,
  //   href: '/lessons',
  // },
  // {
  //   label: '施設設備管理',
  //   icon: Settings,
  //   href: '/facilities',
  // },
  // {
  //   label: '売上',
  //   icon: CircleDollarSign,
  //   href: '/sales',
  //   subItems: [
  //     {
  //       label: '返金手続き一覧',
  //       href: '/sales/refund-procedures',
  //     },
  //   ],
  // },
  // {
  //   label: '商材・施策',
  //   icon: Package,
  //   href: '/products',
  //   subItems: [
  //     {
  //       label: '主契約',
  //       href: '/products/main-contract',
  //     },
  //     {
  //       label: 'オプション',
  //       href: '/products/options',
  //     },
  //     {
  //       label: 'キャンペーン',
  //       href: '/products/campaigns',
  //     },
  //     {
  //       label: 'アンケート',
  //       href: '/products/questionnaires',
  //     },
  //     {
  //       label: '入会金',
  //       href: '/products/enrollment-fee',
  //     },
  //   ],
  // },
  // {
  //   label: 'コンテンツ',
  //   icon: Image,
  //   href: '/content',
  //   subItems: [
  //     {
  //       label: '店舗ページ管理',
  //       href: '/content/store-pages',
  //     },
  //     {
  //       label: '告知・ブログ管理',
  //       href: '/content/announcements-blog',
  //     },
  //     {
  //       label: '通知管理',
  //       href: '/content/notifications',
  //     },
  //   ],
  // },
  {
    href: '/stores',
    icon: Settings,
    label: 'スタッフ管理',
    subItems: [
      {
        label: 'スタッフ管理',
        href: '/staffs',
      },

      {
        label: '店舗管理',
        href: '/stores',
      },
    ],
  },
];

/**
 * Check if a pathname matches a menu item's href or any of its sub-items' hrefs.
 * Uses segment-aware matching to support breadcrumb navigation
 * (e.g., /members/123 keeps /members active) while avoiding false positives
 * (e.g., /membership-applications should NOT match /members).
 */
function checkItemActive(pathname: string, item: MenuItem): boolean {
  if (item.href) {
    if (item.href === '/') return pathname === '/';
    if (pathname === item.href || pathname.startsWith(item.href + '/')) return true;
  }
  return (
    item.subItems?.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + '/')) ??
    false
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  // Controlled accordion state — only one item can be open at a time
  const [openIndex, setOpenIndex] = useState<number | null>(() => {
    const idx = menuItems.findIndex(
      (item) => !!item.subItems?.length && checkItemActive(pathname, item),
    );
    return idx >= 0 ? idx : null;
  });

  // Sync open state when pathname changes (adjusting state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    const activeIdx = menuItems.findIndex(
      (item) => !!item.subItems?.length && checkItemActive(pathname, item),
    );
    setOpenIndex(activeIdx >= 0 ? activeIdx : null);
  }

  /**
   * Handle menu item click:
   * - Items with subitems → always open (accordion switches)
   * - Items without subitems → close any open accordion
   */
  const handleMenuItemClick = (index: number, hasSubItems: boolean) => {
    if (hasSubItems) {
      setOpenIndex(index);
    } else {
      setOpenIndex(null);
    }
  };

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="py-5 pr-0 pl-6">
        <span className="text-sidebar-foreground text-xl leading-7 font-bold tracking-[0.025em]">
          LOGO
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = checkItemActive(pathname, item);
                const hasSubItems = !!(item.subItems && item.subItems.length > 0);
                const isOpen = openIndex === index;

                if (hasSubItems) {
                  const anySubActive =
                    item.subItems?.some(
                      (sub) => pathname === sub.href || pathname.startsWith(sub.href + '/'),
                    ) ?? false;
                  const focused = active || isOpen;
                  // Parent gets accent bg only when focused AND no subitem is active
                  const parentActive = focused && !anySubActive;
                  return (
                    <Collapsible key={item.label} open={isOpen}>
                      <SidebarMenuItem>
                        {item.href ? (
                          <SidebarMenuButton asChild isActive={parentActive}>
                            <Link href={item.href} onClick={() => handleMenuItemClick(index, true)}>
                              <Icon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton asChild isActive={parentActive}>
                            <Link
                              href={item.subItems![0].href}
                              onClick={() => handleMenuItemClick(index, true)}
                            >
                              <Icon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems?.map((subItem) => {
                              const subActive =
                                pathname === subItem.href ||
                                pathname.startsWith(subItem.href + '/');
                              return (
                                <SidebarMenuSubItem key={subItem.href}>
                                  <SidebarMenuSubButton asChild isActive={subActive}>
                                    <Link href={subItem.href}>
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    {item.href ? (
                      <SidebarMenuButton asChild isActive={active}>
                        <Link href={item.href} onClick={() => handleMenuItemClick(index, false)}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        isActive={active}
                        onClick={() => handleMenuItemClick(index, false)}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    )}
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
