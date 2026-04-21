import { formatDate } from '@/utils/format.util';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { GetCrmMembersByIdContractsResponse } from '@/lib/api/types.gen';

type Campaigns = GetCrmMembersByIdContractsResponse['campaigns'];

interface CampaignsCardProps {
  campaigns: Campaigns;
}

export function ActiveCampaignsCard({ campaigns }: CampaignsCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm">適用中のキャンペーン</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold">キャンペーン名</TableHead>
            <TableHead className="text-xs font-semibold">特典内容</TableHead>
            <TableHead className="text-xs font-semibold">適用期間</TableHead>
            <TableHead className="text-xs font-semibold">残り日数</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns?.active && campaigns.active.length > 0 ? (
            campaigns.active.map((cp, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm font-medium">{cp.campaign_name}</TableCell>
                <TableCell className="text-sm">{cp.discount_content ?? '—'}</TableCell>
                <TableCell className="text-sm">
                  {cp.period_start && cp.period_end
                    ? `${formatDate(cp.period_start)} 〜 ${formatDate(cp.period_end)}`
                    : '—'}
                </TableCell>
                <TableCell className="text-sm">
                  {cp.remaining_days != null ? `${cp.remaining_days}日` : '—'}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground py-6 text-center text-sm">
                適用中のキャンペーンはありません
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

export function CampaignHistoryCard({ campaigns }: CampaignsCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-sm">過去の適用履歴</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-semibold">キャンペーン名</TableHead>
            <TableHead className="text-xs font-semibold">特典内容</TableHead>
            <TableHead className="text-xs font-semibold">適用期間</TableHead>
            <TableHead className="text-xs font-semibold">状態</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns?.history && campaigns.history.length > 0 ? (
            campaigns.history.map((cp, i) => (
              <TableRow key={i}>
                <TableCell className="text-sm font-medium">{cp.campaign_name}</TableCell>
                <TableCell className="text-sm">{cp.discount_content ?? '—'}</TableCell>
                <TableCell className="text-sm">
                  {cp.period_start && cp.period_end
                    ? `${formatDate(cp.period_start)} 〜 ${formatDate(cp.period_end)}`
                    : '—'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      cp.status === 'active'
                        ? 'border-success/20 bg-success/15 text-success'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {cp.status === 'active'
                      ? '適用中'
                      : cp.status === 'expired'
                        ? '終了'
                        : 'キャンセル'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-muted-foreground py-6 text-center text-sm">
                過去のキャンペーン履歴はありません
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
