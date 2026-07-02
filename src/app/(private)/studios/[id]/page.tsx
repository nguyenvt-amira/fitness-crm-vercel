import { Suspense } from 'react';

import { Loading } from '@/components/common/data-state-boundary/loading';

export default function StudioDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <div>Studio Detail (FR-003)</div>
    </Suspense>
  );
}
