import { StaffRole } from '@/lib/api';

import { GetStudiosQuery } from '../../_schemas/lesson-schedule.schema';
import { GetStudioDetailResponse } from '../../_schemas/studio-detail.schema';
import { StudioListResponse } from '../../_schemas/studio.schema';

export type StudiosType = {
  _rows: Array<{
    id: string;
    name: string;
    physical_capacity: number;
    store_id: string;
  }>;
  _seeded: boolean;
  _seed(): void;
  getList(): Array<{
    id: string;
    name: string;
    physical_capacity: number;
    store_id: string;
  }>;
  getByStoreId(storeId: string): Array<{
    id: string;
    name: string;
    physical_capacity: number;
    store_id: string;
  }>;
  /** FR-001: Full CRM studio list with search/filter/sort/pagination */
  list(query: GetStudiosQuery, userRole: StaffRole, userStoreIds: string[]): StudioListResponse;

  getStudioDetailById(
    id: string,
    userRole: StaffRole,
    userStoreIds: string[],
  ): GetStudioDetailResponse | undefined;
};
