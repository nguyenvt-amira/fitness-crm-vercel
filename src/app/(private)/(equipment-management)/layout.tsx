'use client';

import type { ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Plus } from 'lucide-react';

import { PageHeader } from '@/components/common/page-header';
import { RoleGatedMenuItem } from '@/components/common/role-gated-menu-item';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getCrmEquipmentSummaryOptions } from '@/lib/api/@tanstack/react-query.gen';
import type { RouteKey } from '@/lib/routes/routes.type';
import { navigate } from '@/lib/routes/routes.util';

import { Permission } from '@/types/permission.type';

import { EquipmentCsvExportButton } from './_components/equipment-csv-export-button';

type EquipmentTab = 'equipment' | 'controllers';

const EQUIPMENT_TAB_ROUTES: Record<EquipmentTab, RouteKey> = {
  equipment: '/equipment',
  controllers: '/controllers',
};

function getActiveTab(pathname: string): EquipmentTab | null {
  if (pathname === navigate('/controllers')) return 'controllers';
  if (pathname === navigate('/equipment')) return 'equipment';
  return null;
}

export default function EquipmentManagementLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = getActiveTab(pathname);

  const { data: summary } = useQuery({
    ...getCrmEquipmentSummaryOptions(),
    enabled: activeTab !== null,
  });

  if (!activeTab) {
    return children;
  }

  const equipmentCount = summary?.equipment_count ?? 0;
  const controllerCount = summary?.controllers_count ?? 0;

  const handleTabChange = (tab: string) => {
    const routeKey = EQUIPMENT_TAB_ROUTES[tab as EquipmentTab];
    if (routeKey) {
      router.push(navigate(routeKey));
    }
  };

  return (
    <>
      <PageHeader
        title="店舗機器管理"
        badge={
          <Badge variant="outline" className="text-xs">
            {equipmentCount}件
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <EquipmentCsvExportButton activeTab={activeTab} />
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button className="gap-1">
                    <Plus className="size-4" />
                    新規登録
                    <ChevronDown className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(navigate('/equipment/create'))}>
                  接続機器を登録
                </DropdownMenuItem>
                <RoleGatedMenuItem
                  requiredPermission={Permission.ControllerEdit}
                  denyBadge="権限なし"
                  onClick={() => router.push(navigate('/controllers/create'))}
                >
                  接点制御装置を登録
                </RoleGatedMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="bg-background flex flex-1 flex-col gap-4 px-6 py-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-4">
          <TabsList variant="line">
            <TabsTrigger value="equipment" className="text-sm">
              接続機器一覧
              <Badge
                variant="outline"
                className="bg-muted-foreground/15 text-muted-foreground ml-1 min-w-5 border-transparent px-1 font-medium tabular-nums"
              >
                {equipmentCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="controllers" className="text-sm">
              接点制御装置一覧
              <Badge
                variant="outline"
                className="bg-muted-foreground/15 text-muted-foreground ml-1 min-w-5 border-transparent px-1 font-medium tabular-nums"
              >
                {controllerCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </>
  );
}
