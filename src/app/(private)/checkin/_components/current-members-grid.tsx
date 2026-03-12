'use client';

import { Clock } from 'lucide-react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface CurrentMember {
  id: string;
  name: string;
  kana: string;
  gender: 'M' | 'F';
  avatar: string;
  membershipType: string;
  stayDuration: string; // e.g., "1時間30分", "2時間15分"
  badge?: string; // e.g., "要対応"
  hasAlert?: boolean; // For red border
}

interface CurrentMembersGridProps {
  members: CurrentMember[];
}

export function CurrentMembersGrid({ members }: CurrentMembersGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {members.map((member) => (
        <Card
          key={member.id}
          className={cn(
            'relative flex flex-col overflow-hidden rounded-[14px] border p-0',
            member.hasAlert ? 'border-[#FFC9C9] bg-[#FEF2F2]' : 'border-[#E5E5E5] bg-white',
          )}
        >
          {/* Avatar */}
          <div className="relative mb-0">
            <Avatar className="h-[130px] w-full rounded-none bg-gray-100">
              <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
            </Avatar>
            {member.badge && (
              <Badge className="absolute top-2 right-2 h-5 border border-[rgba(223,34,37,0.2)] bg-white px-1.5 text-[10px] leading-[14px] font-bold text-[#DF2225]">
                {member.badge}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-1 px-2.5 pt-2.5 pb-2.5">
            {/* Name and Gender */}
            <div className="flex items-center gap-1">
              <span className="text-xs leading-[15px] font-bold text-[#0A0A0A]">{member.name}</span>
              <span
                className={cn(
                  'text-[9px] leading-[13px] font-medium',
                  member.gender === 'M' ? 'text-[#2B7FFF]' : 'text-[#F6339A]',
                )}
              >
                {member.gender === 'M' ? '♂' : '♀'}
              </span>
            </div>

            {/* Kana */}
            <div className="text-[10px] leading-[14px] font-normal text-[#737373]">
              {member.kana}
            </div>

            {/* Membership Type */}
            <div className="text-[10px] leading-[12.5px] font-normal text-[#737373]">
              {member.membershipType}
            </div>

            {/* Stay Duration */}
            <div className="mt-auto flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#737373]" />
              <span className="text-[10px] leading-[14px] font-normal text-[#737373]">
                {member.stayDuration}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
