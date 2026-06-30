# Fitness CRM Development Guidelines

Auto-generated from feature plan: `001-staff-list`. Last updated: 2026-04-08

## Active Technologies

- TypeScript 5.x (strict, `no-explicit-any`); Node.js ≥ 24.0.0 + Next.js 16 (App Router), React, TanStack React Query, react-hook-form + `@hookform/resolvers/zod`, shadcn/ui (Radix: Form, Input, Select, Card, Popover, Command, Badge, Switch, AlertDialog, Button, Sonner), lucide-react, Tailwind CSS v4, `next/image`, date-fns v4 (009-lesson-content-form)
- Phase 1 in-memory mock DB (`src/app/api/_mock-db.ts`) enriched with `create()` / `update()` methods; Phase 2 = REST API via generated client (009-lesson-content-form)

- TypeScript 5.x (strict, `no-explicit-any`); Node.js ≥ 24.0.0 + Next.js 16 (App Router), React, TanStack React Query, nuqs, (008-lesson-content-detail)
- Phase 1 in-memory mock DB (`src/app/api/_mock-db.ts`); Phase 2 = REST API via generated client (008-lesson-content-detail)

- TypeScript 5.x — strict mode, `no-explicit-any` + TanStack React Query 5, shadcn/ui (Radix), nuqs, date-fns v4, Zod, react-hook-form (001-visit-experience-list)
- Phase 1 — in-memory mock via `src/app/api/_mock-db.ts`; Phase 2 — REST API (not yet published) (001-visit-experience-list)

## Recent Changes

### 001-staff-list (2026-04-08) — IN PLANNING

- **New route**: `/settings/staff` — Staff list page with DataTable, filters, sort, delete, invite
- **New API routes**: `GET /crm/staff`, `GET /crm/staff/positions`, `DELETE /crm/staff/[id]`, `POST /crm/staff/invitations`
- **New types**: `StaffRole`, `StaffStatus` enums; `StaffListItem`, `Branch`, `StaffPosition` interfaces
- **Mock DB**: Extended with Branch (2), Staff (8), Position (11) seed data
- **Key UX decisions**: Page-based pagination (not infinite scroll); AlertDialog delete with 削除理由; bulk invite via Dialog

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
