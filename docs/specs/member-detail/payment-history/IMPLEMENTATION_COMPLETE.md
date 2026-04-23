# Implementation Checklist: 支払い履歴タブ（A-01-01-d）

## ✅ COMPLETED - All 16 Tasks

### Phase 1: Backend – Schema & Mock Data (6 tasks)

- [x] **Task 1.1** - Add Zod schemas for Payment History API
  - ✅ PaymentHistoryTypeSchema, PaymentHistoryItemSchema, PaymentHistoryListResponseSchema
  - ✅ File: `src/app/api/_schemas/member.schema.ts`

- [x] **Task 1.2** - Add Zod schemas for Billing List API
  - ✅ BillingStatusSchema, BillingTypeSchema, BillingItemSchema, GetBillingResponseSchema
  - ✅ File: `src/app/api/_schemas/member.schema.ts`

- [x] **Task 1.3** - Add Zod schema for Payment Summary API
  - ✅ PaymentSummarySchema with all 4 fields
  - ✅ File: `src/app/api/_schemas/member.schema.ts`

- [x] **Task 1.4** - Add mock Payment History seed data
  - ✅ 10 records with mix of sales/refunds, varied dates/methods
  - ✅ File: `src/app/api/_mock-db.ts`

- [x] **Task 1.5** - Add mock Billing List seed data
  - ✅ 8 records covering all 4 statuses, mixed types
  - ✅ File: `src/app/api/_mock-db.ts`

- [x] **Task 1.6** - Add Payment Summary helper function
  - ✅ `getPaymentSummary()` computes from mock billing data
  - ✅ File: `src/app/api/_mock-db.ts`

### Phase 2: Backend – API Routes (4 tasks)

- [x] **Task 2.1** - Create Payment History Route
  - ✅ GET /crm/members/{id}/payment-history
  - ✅ Query params: page, limit, period, type
  - ✅ Filtering + pagination implemented
  - ✅ File: `src/app/api/crm/members/[id]/payment-history/route.ts`

- [x] **Task 2.2** - Create Billing List Route
  - ✅ GET /crm/members/{id}/billing
  - ✅ Query params: page, limit
  - ✅ Pagination implemented
  - ✅ File: `src/app/api/crm/members/[id]/billing/route.ts`

- [x] **Task 2.3** - Create Payment Summary Route
  - ✅ GET /crm/members/{id}/payment-summary
  - ✅ No query params, calls helper function
  - ✅ File: `src/app/api/crm/members/[id]/payment-summary/route.ts`

- [x] **Task 2.4** - Generate OpenAPI Schema & Client Code
  - ✅ Updated `src/app/api/_routes/index.ts` with 3 new imports
  - ✅ Ran `npm run generate-openapi` → ✅ Success
  - ✅ Ran `npm run generate-api` → ✅ Success
  - ✅ Generated types & React Query factories:
    - getCrmMembersByIdPaymentHistoryOptions
    - getCrmMembersByIdBillingOptions
    - getCrmMembersByIdPaymentSummaryOptions

### Phase 3: Frontend – UI Components (6 tasks)

- [x] **Task 3.1** - Create Payment History Tab Shell
  - ✅ `'use client'` component
  - ✅ Props: memberId
  - ✅ Local state: period, type, ledgerPage, billingPage
  - ✅ Three independent useQuery calls
  - ✅ Layout: 60% left + 40% right sticky
  - ✅ File: `src/app/(private)/members/[id]/_components/tabs/payment-history-tab/index.tsx`

- [x] **Task 3.2** - Create Payment Ledger Card
  - ✅ DataStateBoundary wrapper
  - ✅ Period & Type Select dropdowns
  - ✅ Table with 5 columns
  - ✅ Amount formatting (¥, destructive for negative)
  - ✅ Type badges (secondary/default)
  - ✅ Pagination component
  - ✅ File: `src/app/(private)/members/[id]/_components/tabs/payment-history-tab/payment-ledger-card.tsx`

- [x] **Task 3.3** - Create Billing List Card
  - ✅ DataStateBoundary wrapper
  - ✅ Table with 5 columns
  - ✅ Type badges (outline/default)
  - ✅ Status badge integration
  - ✅ Pagination component
  - ✅ File: `src/app/(private)/members/[id]/_components/tabs/payment-history-tab/billing-list-card.tsx`

- [x] **Task 3.4** - Create Billing Status Badge Component
  - ✅ Status → Label mapping (4 statuses)
  - ✅ Color mapping (blue/green/orange/red)
  - ✅ Badge variant outline
  - ✅ File: `src/app/(private)/members/[id]/_components/tabs/payment-history-tab/billing-status-badge.tsx`

- [x] **Task 3.5** - Create Payment Summary Card
  - ✅ Sticky positioning (top-6)
  - ✅ Current month amount (large bold)
  - ✅ Border divider
  - ✅ Unpaid total (destructive if >0)
  - ✅ Last payment date
  - ✅ Payment method with CreditCard icon
  - ✅ File: `src/app/(private)/members/[id]/_components/tabs/payment-history-tab/payment-summary-card.tsx`

- [x] **Task 3.6** - Integrate into MemberDetailPage
  - ✅ Import PaymentHistoryTab
  - ✅ Add TabsTrigger (after contracts, before points)
  - ✅ Add TabsContent with memberId prop
  - ✅ File: `src/app/(private)/members/[id]/page.tsx`

### Phase 4: Testing & Validation

- [x] **Task 4.0** - Type Checking & Linting
  - ✅ `npm run type-check` → No TypeScript errors
  - ✅ `npm run lint` → No errors from new code

---

## Summary

| Metric                   | Count    |
| ------------------------ | -------- |
| New files created        | 8        |
| Modified files           | 4        |
| Regenerated files        | 3        |
| Total tasks completed    | 16/16 ✅ |
| TypeScript errors        | 0        |
| ESLint errors (new code) | 0        |

---

## Files Overview

### Backend API

- ✅ 3 route handlers (payment-history, billing, payment-summary)
- ✅ 8 Zod schemas with OpenAPI metadata
- ✅ Mock seed data (18 total records)
- ✅ Helper function for summary computation

### Frontend Components

- ✅ 1 main tab shell component
- ✅ 2 card components (ledger, billing list)
- ✅ 1 badge sub-component (status)
- ✅ 1 summary card (sticky layout)

### Integration

- ✅ Wired into MemberDetailPage
- ✅ Tab appears after "契約情報", before "ポイント"
- ✅ All props correctly typed and passed

---

## Testing Status

### ✅ Compilations Pass

- TypeScript: ✅
- ESLint: ✅
- Prettier: ✅

### ✅ Acceptance Criteria

- AC-1 through AC-15: All addressed in implementation

### Ready for:

- ⏳ Manual QA testing
- ⏳ Code review
- ⏳ Staging deployment

---

**Implementation Date**: 2026-04-22
**Status**: ✅ READY FOR TESTING
