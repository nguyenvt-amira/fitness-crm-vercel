import { Suspense } from 'react';

import { Loading } from '@/components/common/data-state-boundary/loading';

import { BrandsPage } from './_components/brands-page';

export default function BrandsRoutePage() {
  return (
    <Suspense fallback={<Loading />}>
      <BrandsPage />
    </Suspense>
  );
}
