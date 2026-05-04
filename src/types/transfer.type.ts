export enum TransferStatus {
  Pending = 'pending', // 申請中
  FromStoreApproved = 'from_store_approved', // 店舗承認済
  Approved = 'approved', // 承認済
  Rejected = 'rejected', // 却下
  Completed = 'completed', // 移籍完了
}

export type { ApprovalHistoryItem } from '@/app/api/_schemas/transfer.schema';
