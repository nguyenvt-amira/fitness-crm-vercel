'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit, Ellipsis, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { getCrmMembersByIdContractsOptions } from '@/lib/api/@tanstack/react-query.gen';

interface ContractData {
  mainContracts?: Array<{
    contractId: string;
    plan_name: string;
    status: 'active' | 'terminated';
    store_name: string;
    start_date: string;
    end_date: string | null;
  }>;
  optionContracts?: Array<{
    contractId: string;
    name: string;
    status: 'active' | 'terminated';
    store_name: string;
    start_date: string;
    end_date: string | null;
  }>;
  oneDayPasses?: any[];
  optionSets?: any[];
  campaigns?: any[];
}

export function ContractsTab({ memberId }: { memberId: string }) {
  const { data, isLoading } = useQuery(
    getCrmMembersByIdContractsOptions({
      path: {
        id: memberId,
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">データが見つかりません</div>
      </div>
    );
  }

  const contractData = data as unknown as ContractData;
  const {
    mainContracts = [],
    optionContracts = [],
    oneDayPasses = [],
    optionSets = [],
    campaigns = [],
  } = contractData;

  return (
    <div className="space-y-4">
      {/* 主契約 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">主契約</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 size-4" />
                主契約変更
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                主契約追加
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {mainContracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA]">
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    利用者契約ID
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    主契約名
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    ステータス
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    店舗
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    契約開始日
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    契約終了日
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mainContracts.map((contract, index) => (
                  <TableRow
                    key={`${contract.contractId}-${index}`}
                    className={`border-b ${
                      index % 2 === 1
                        ? 'bg-[#F5F5F5] hover:bg-[#F5F5F5]'
                        : 'bg-white hover:bg-white'
                    }`}
                  >
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.contractId}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.plan_name}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium ${
                          contract.status === 'active'
                            ? 'border-[#22C55E] bg-[#F0FDF4] text-[#22C55E]'
                            : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#171717]'
                        }`}
                      >
                        {contract.status === 'active' ? '利用中' : '契約終了'}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.store_name}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.start_date
                        ? new Date(contract.start_date).toLocaleDateString('ja-JP')
                        : '-'}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.end_date
                        ? new Date(contract.end_date).toLocaleDateString('ja-JP')
                        : '---'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">該当のデータがありません。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* オプション契約 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">オプション契約</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 size-4" />
              オプション契約追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {optionContracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA]">
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    利用者契約ID
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    オプション名
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    ステータス
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    店舗
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    契約開始日
                  </TableHead>
                  <TableHead className="text-foreground h-10 px-2 text-sm font-medium">
                    契約終了日
                  </TableHead>
                  <TableHead className="h-10 w-[52px] px-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {optionContracts.map((contract, index) => (
                  <TableRow
                    key={`${contract.contractId}-${index}`}
                    className={`border-b ${
                      index % 2 === 1
                        ? 'bg-[#F5F5F5] hover:bg-[#F5F5F5]'
                        : 'bg-white hover:bg-white'
                    }`}
                  >
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.contractId}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.name}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium ${
                          contract.status === 'active'
                            ? 'border-[#22C55E] bg-[#F0FDF4] text-[#22C55E]'
                            : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#171717]'
                        }`}
                      >
                        {contract.status === 'active' ? '利用中' : '契約終了'}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.store_name}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.start_date
                        ? new Date(contract.start_date).toLocaleDateString('ja-JP')
                        : '-'}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2 text-sm font-normal">
                      {contract.end_date
                        ? new Date(contract.end_date).toLocaleDateString('ja-JP')
                        : '---'}
                    </TableCell>
                    <TableCell className="h-11 px-2 py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Ellipsis className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>編集</DropdownMenuItem>
                          <DropdownMenuItem>削除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">該当のデータがありません。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 1DayPass */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">1DayPass</CardTitle>
        </CardHeader>
        <CardContent>
          {oneDayPasses.length > 0 ? (
            <div>1DayPass data</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">該当のデータがありません。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* オプションセット */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">オプションセット</CardTitle>
        </CardHeader>
        <CardContent>
          {optionSets.length > 0 ? (
            <div>Option Sets data</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">該当のデータがありません。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* キャンペーン */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">キャンペーン</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <div>Campaigns data</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground">該当のデータがありません。</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
