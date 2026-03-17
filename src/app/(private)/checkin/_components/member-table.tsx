'use client';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, Mars, Venus } from 'lucide-react';

import { DataTable } from '@/components/common/data-table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { navigate } from '@/lib/routes/routes.util';

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

interface MemberTableProps {
  title: string;
  icon: React.ReactNode;
  members: Member[];
  variant?: 'entry' | 'current';
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case '要対応':
      return 'bg-red-50 border-red-200 text-red-600';
    case '誕生日':
      return 'bg-blue-50 border-blue-200 text-blue-600';
    case '入会1周年':
      return 'bg-blue-50 border-blue-200 text-blue-600';
    case '久しぶり':
      return 'bg-green-50 border-green-200 text-green-600';
    case 'もうすぐ誕生日':
      return 'bg-yellow-50 border-yellow-200 text-yellow-600';
    case '常連':
      return 'bg-green-50 border-green-200 text-green-600';
    default:
      return '';
  }
};

const memberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: 'name',
    header: '利用者',
    cell: ({ row }) => {
      const member = row.original;
      const genderColor = member.gender === 'M' ? 'text-blue-600' : 'text-pink-600';
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Avatar className="h-9 w-9 rounded-lg">
              <AvatarImage src={member.avatar} />
            </Avatar>
            <span className={`text-xs font-bold ${genderColor}`}>
              {member.gender === 'M' ? (
                <Mars className="h-4 w-4 text-blue-600" />
              ) : (
                <Venus className="h-4 w-4 text-pink-600" />
              )}
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{member.name}</p>
            <p className="text-xs text-gray-600">{member.kana}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'membershipType',
    header: '種別',
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="text-sm">
          <p className="text-xs font-medium text-gray-900">{member.membershipType}</p>
          <p className="text-xs text-gray-600">{member.membershipCode}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'checkInTime',
    header: '時刻',
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="text-sm">
          <p className="text-xs font-medium text-gray-900">{member.checkInTime}</p>
          <p className="text-xs text-gray-600">{member.gate}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'ステータス',
    cell: ({ row }) => {
      const member = row.original;
      return member.status ? (
        <Badge variant="outline" className={`text-xs font-bold ${getStatusColor(member.status)}`}>
          {member.status}
        </Badge>
      ) : (
        <span className="text-xs text-gray-600">---</span>
      );
    },
  },
  {
    accessorKey: 'visits',
    header: '来館',
    cell: ({ row }) => {
      const visits = row.original.visits;
      return <span className="text-right text-xs text-gray-600">{visits}回</span>;
    },
  },
];

export function MemberTable({
  title,
  icon,
  members,
  variant = 'entry',
}: Readonly<MemberTableProps>) {
  return (
    <Card className="overflow-hidden border border-gray-100 p-0 shadow-sm">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-bold">{title}</h3>
          </div>
          <p className="text-xs text-gray-600">最新5件</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <DataTable
            variant="simple"
            columns={memberColumns}
            data={members}
            className="rounded-none border-none"
          />
        </div>

        {/* Button - Below Table */}
        <div className="border-t border-gray-200 px-4 py-3">
          <Link href={navigate('/checkin/histories')}>
            <Button variant="outline" className="w-full justify-center gap-2 rounded-lg text-sm">
              入退館履歴ですべて表示
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
