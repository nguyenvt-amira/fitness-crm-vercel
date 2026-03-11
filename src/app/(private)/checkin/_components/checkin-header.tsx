import { Avatar, AvatarImage } from '@/components/ui/avatar';

export function CheckinHeader() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-14 items-center justify-center rounded-sm bg-linear-to-r from-blue-400 to-blue-600">
          <span className="text-xs font-bold text-white">Logo</span>
        </div>
        <div>
          <h1 className="text-sm font-medium">Fit365八潮店</h1>
          <p className="text-xs text-gray-600">fit365</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold">テストユーザー</p>
        </div>
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
        </Avatar>
      </div>
    </div>
  );
}
