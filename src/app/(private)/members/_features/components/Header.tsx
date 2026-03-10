import { Download, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <User />
        <h1 className="text-xl font-bold">会員管理</h1>
      </div>
      <Button variant="outline">
        <Download />
        あんしんサポート契約状況の出力
      </Button>
    </div>
  );
}
