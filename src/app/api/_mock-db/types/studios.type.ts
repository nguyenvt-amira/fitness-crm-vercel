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
};
