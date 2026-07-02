import Link from 'next/link';

import type { LayoutPreview } from '@/app/api/_schemas/studio-detail.schema';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudioLayoutCardProps {
  layout: LayoutPreview;
}

const LAYOUT_CELL_KINDS = {
  normal_seat: { label: '通常座席', color: 'bg-blue-200' },
  equipment_seat: { label: '器材座席', color: 'bg-amber-200' },
  fixed_object: { label: '固定物', color: 'bg-slate-400' },
};

/**
 * Studio layout card component.
 * Displays layout preview when configured, or not-configured state with configure button.
 */
export function StudioLayoutCard({ layout }: StudioLayoutCardProps) {
  if (layout.state === 'not_configured') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">スペースレイアウト</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 py-8">
            <p className="text-muted-foreground mb-4 text-center text-sm">
              レイアウト情報が未設定です
            </p>
            <Link href={layout.configure_path}>
              <Button size="sm" variant="outline">
                レイアウトを設定する
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!layout.rows || !layout.columns || !layout.cells) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">スペースレイアウト</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            レイアウト情報が利用できません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">スペースレイアウト</CardTitle>
        <p className="text-muted-foreground text-sm">
          {layout.rows}行 × {layout.columns}列
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid visualization */}
        <div
          className="inline-block gap-1 rounded-md border border-slate-200 p-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layout.columns}, minmax(30px, 1fr))`,
            gap: '4px',
          }}
        >
          {layout.cells.map((cell, idx) => {
            const kind = LAYOUT_CELL_KINDS[cell.kind as keyof typeof LAYOUT_CELL_KINDS];
            return (
              <div
                key={`${cell.x}-${cell.y}`}
                className={`${kind?.color || 'bg-gray-200'} flex h-8 w-8 items-center justify-center rounded border border-slate-300 text-xs font-semibold`}
                title={`(${cell.x}, ${cell.y}) - ${kind?.label || 'Unknown'}`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="space-y-2 border-t pt-4">
          <p className="text-sm font-medium">凡例</p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(LAYOUT_CELL_KINDS).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`${color} h-4 w-4 rounded`} />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
