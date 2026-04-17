import { Link2Off } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function RemoveActionButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-destructive/80 hover:text-destructive size-7"
      aria-label="紐づけを解除"
    >
      <Link2Off className="size-4" />
    </Button>
  );
}
