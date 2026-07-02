import Image from 'next/image';

import type { StudioImage } from '@/app/api/_schemas/studio-detail.schema';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudioImagesCardProps {
  images: StudioImage[];
}

/**
 * Studio images card.
 * Displays image thumbnails in a grid layout.
 */
export function StudioImagesCard({ images }: StudioImagesCardProps) {
  if (!images || images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">スタジオ画像</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">画像はありません</p>
        </CardContent>
      </Card>
    );
  }

  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">スタジオ画像</CardTitle>
        <p className="text-muted-foreground text-sm">{sortedImages.length}件の画像</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {sortedImages.map((image) => (
            <div
              key={image.image_id}
              className="relative aspect-video overflow-hidden rounded-md bg-slate-100"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
