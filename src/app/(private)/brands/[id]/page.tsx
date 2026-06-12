import { Suspense } from 'react';

import { Loading } from '@/components/common/data-state-boundary/loading';

import { BrandDetailPage as BrandDetailPageContent } from './_components/brand-detail-page';

export default function BrandDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BrandDetailPageContent />
    </Suspense>
  );
}
