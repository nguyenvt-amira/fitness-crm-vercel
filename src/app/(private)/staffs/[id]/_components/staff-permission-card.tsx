'use client';

import { Check, Minus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { type GetCrmStaffsByIdResponse, type GetCrmStaffsByIdResponses } from '@/lib/api/types.gen';

import {
  STAFF_BRAND_LABELS,
  STAFF_ROLE_LABELS,
  type StaffBrand,
  type StaffRole,
} from '../../_constants/constants';
import { formatDateOnly, formatScopeTarget } from '../_lib/staff-detail.util';

type Staff = GetCrmStaffsByIdResponse['staff'];

interface StaffPermissionCardProps {
  staff: Staff;
}

export function StaffPermissionCard({ staff }: StaffPermissionCardProps) {
  const permission = staff.permission_settings;
  const staffRole = permission.role as StaffRole;
  const billing = permission.additional_permissions.billing_correction;
  const refund = permission.additional_permissions.refund_request;
  const transfer = permission.additional_permissions.transfer_request;

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-base">権限設定</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <div className="text-muted-foreground text-xs font-medium">編集権限</div>
            <div className="mt-1 text-sm">{STAFF_ROLE_LABELS[staffRole]}</div>
          </div>

          <div className="bg-muted/20 rounded-lg border p-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-2">
                {billing ? (
                  <Check className="size-4 text-green-700" />
                ) : (
                  <Minus className="text-muted-foreground size-4" />
                )}
                <span className="text-sm">確定請求訂正</span>
              </div>
              <div className="flex items-center gap-2">
                {refund ? (
                  <Check className="size-4 text-green-700" />
                ) : (
                  <Minus className="text-muted-foreground size-4" />
                )}
                <span className="text-sm">返金申請</span>
              </div>
              <div className="flex items-center gap-2">
                {transfer ? (
                  <Check className="size-4 text-green-700" />
                ) : (
                  <Minus className="text-muted-foreground size-4" />
                )}
                <span className="text-sm">移籍申請・否認</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="text-muted-foreground text-xs font-medium">編集可能情報</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ブランド</TableHead>
                  <TableHead>対象</TableHead>
                  <TableHead>有効開始日</TableHead>
                  <TableHead>有効終了日</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.editable_scopes.map((scope, idx) => (
                  <TableRow key={`${scope.brand}-${idx}`}>
                    <TableCell>{STAFF_BRAND_LABELS[scope.brand as StaffBrand]}</TableCell>
                    <TableCell>{formatScopeTarget(scope.target, scope.store_name)}</TableCell>
                    <TableCell>{formatDateOnly(scope.start_date)}</TableCell>
                    <TableCell>{scope.end_date ? formatDateOnly(scope.end_date) : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
