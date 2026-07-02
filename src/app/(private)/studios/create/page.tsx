import { Suspense } from 'react';

import { Loading } from '@/components/common/data-state-boundary/loading';

export default function StudioCreatePage() {
  return (
    <Suspense fallback={<Loading />}>
      <div>Studio Create (FR-002)</div>
    </Suspense>
  );
}
