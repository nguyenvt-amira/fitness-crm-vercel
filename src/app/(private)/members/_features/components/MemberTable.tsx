import { AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { MemberListItem } from '@/lib/api';

import { MEMBER_COLUMNS } from '../constants';

interface MemberTableProps {
  data: MemberListItem[];
}

export function MemberTable({ data }: MemberTableProps) {
  return (
    <div className="overflow-hidden rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            <TableHead className="w-12.5 px-4">
              <Checkbox />
            </TableHead>
            {MEMBER_COLUMNS.map((col) => (
              <TableHead
                key={col.id}
                className={`py-4 text-[13px] font-bold ${col.align === 'center' ? 'text-center' : ''}`}
              >
                <div
                  className={`flex items-center gap-1 ${col.align === 'center' ? 'justify-center' : ''}`}
                >
                  {col.label}
                  {col.sortable && (
                    <span className="text-[10px] font-normal text-gray-400">↑↓</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((member, index) => (
            <TableRow
              key={index}
              className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 ${member.hasUnpaid ? 'bg-red-50/50' : ''}`}
            >
              <TableCell className="px-4">
                <Checkbox />
              </TableCell>
              {MEMBER_COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  className={` ${col.align === 'center' ? 'text-center' : ''}`}
                >
                  {renderCellContent(member, col.id)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function renderCellContent(member: MemberListItem, key: string) {
  switch (key) {
    case 'name':
      return (
        <div className="flex items-center justify-center gap-1">
          {member.hasUnpaid && <AlertCircle className="h-4 w-4 text-red-500" />}
          {member.nameKanji || '-'}
        </div>
      );
    case 'status':
      return <StatusBadge status={member.status || ''} />;
    default:
      return (member as any)[key] || '-';
  }
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === '利用中';
  return (
    <Badge
      variant="secondary"
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[12px] font-medium ${
        isActive ? 'border-green-400 bg-green-50 text-green-600' : ''
      }`}
    >
      {status}
    </Badge>
  );
}
