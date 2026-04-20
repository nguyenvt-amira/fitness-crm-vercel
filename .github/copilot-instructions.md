# Fitness CRM Development Guidelines

Auto-generated from feature plan: `001-staff-list`. Last updated: 2026-04-08

## Active Technologies

- **Runtime**: Node.js ≥ 24.0.0
- **Framework**: Next.js 16 (App Router only — no Pages Router)
- **Language**: TypeScript 5.x (strict mode; `no-explicit-any` enforced)
- **Styling**: Tailwind CSS v4 + `cn()` utility (`tailwind-merge` + `clsx`) from `src/lib/utils.ts`
- **Server State**: TanStack React Query (`@tanstack/react-query`) — all fetches via generated option-factories
- **URL State**: `nuqs` — all filter/sort/pagination state lives in URL search params
- **Forms**: `react-hook-form` + `@hookform/resolvers/zod`
- **Schema / Types**: Zod as single source of truth; `@asteasolutions/zod-to-openapi` derives OpenAPI spec; `@hey-api/openapi-ts` generates TypeScript client + React Query factories
- **Toasts**: `sonner`
- **Dates**: `date-fns` v4 only (no `moment`, no `dayjs`)
- **Icons**: `lucide-react`
- **UI Primitives**: shadcn/Radix UI components in `src/components/ui/`
- **Lint/Format**: ESLint (core-web-vitals + typescript + prettier), Prettier 100-char line width, husky + lint-staged

## Project Structure

```text
src/
├── types/
│   ├── global.enum.ts       # CookieNames enum
│   ├── global.type.ts
│   ├── member.type.ts       # MemberType, MemberStatus, Brand, MemoType enums
│   └── staff.type.ts        # [NEW 001] StaffRole, StaffStatus, StaffBrand, StaffListItem, Branch
│
├── app/
│   ├── api/
│   │   ├── _mock-db.ts                          # In-memory mock DB (members + staff + branches + positions)
│   │   ├── _schemas/
│   │   │   ├── member.schema.ts                 # Zod schemas for members feature
│   │   │   └── staff.schema.ts                  # [NEW 001] Zod schemas for staff feature
│   │   ├── _routes/                             # registerRoute helpers
│   │   └── crm/
│   │       ├── members/route.ts                 # GET /crm/members
│   │       └── staff/                           # [NEW 001]
│   │           ├── route.ts                     # GET /crm/staff
│   │           ├── positions/route.ts           # GET /crm/staff/positions
│   │           ├── [id]/route.ts                # DELETE /crm/staff/[id]
│   │           └── invitations/route.ts         # POST /crm/staff/invitations
│   │
│   └── (private)/
│       ├── members/                             # Reference implementation (list page pattern)
│       │   ├── page.tsx
│       │   ├── _components/
│       │   ├── _contexts/
│       │   └── _hooks/
│       └── settings/                            # [NEW 001]
│           ├── layout.tsx
│           └── staff/
│               ├── page.tsx
│               ├── _components/
│               │   ├── staff-table-columns.tsx
│               │   ├── staff-filters.tsx
│               │   ├── staff-delete-dialog.tsx
│               │   └── staff-invite-dialog.tsx
│               ├── _contexts/staff-filters-context.tsx
│               └── _hooks/use-staff-filters.ts
│
├── components/
│   ├── ui/                  # shadcn primitives (Button, Badge, Select, Dialog, AlertDialog, …)
│   └── common/
│       ├── data-table/      # DataTable<TData, TValue> — main list component
│       ├── breadcrumb-nav.tsx
│       └── data-state-boundary/
│
└── lib/
    ├── api/                 # GENERATED — do not edit manually
    │   ├── types.gen.ts
    │   └── @tanstack/react-query.gen.ts
    ├── client.config.ts
    └── utils.ts             # cn() utility
```

## Commands

```bash
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run build            # Production build (check bundle size)
npm run lint             # ESLint + Prettier check
npm run type-check       # tsc --noEmit (see tsconfig.typecheck.json)
npm run generate-openapi # Regenerate openapi.json from API route registrations
npm run generate-api     # Regenerate TypeScript client + React Query factories from OpenAPI spec
```

## Code Style

### TypeScript

- **Enums**: use TypeScript `enum` in `src/types/` (see `member.type.ts` as reference)
- **No `any`**: use `unknown` + type guards or Zod `.parse()` / `.safeParse()`
- **Null vs undefined**: prefer `null` for intentional absence; `undefined` for optional params
- **Imports**: path alias `@/` maps to `src/`; group: external libs → `@/lib` → `@/components` → `@/app`

### API Routes

- All routes use `registerRoute(...)` for OpenAPI doc generation before the handler export
- Query validation via `ZodSchema.safeParse(queryObj)` — return `{ status: 400, error }` on failure
- Response via `NextResponse.json(data, { status })` — never `res.json()`
- Schemas live in `src/app/api/_schemas/[feature].schema.ts`

### Components

- All `'use client'` only when hooks/events are needed — default to RSC
- Filter state flows: `nuqs useQueryStates` → Context → components
- All mutations: `useMutation` from React Query; never raw `fetch` in components
- Toast messages: `toast.success(...)` / `toast.error(...)` via `sonner`
- Date formatting: `format(parseISO(dateStr), 'yyyy-MM-dd HH:mm', { timeZone: 'Asia/Tokyo' })` via `date-fns`

## Recent Changes

### 001-staff-list (2026-04-08) — IN PLANNING

- **New route**: `/settings/staff` — Staff list page with DataTable, filters, sort, delete, invite
- **New API routes**: `GET /crm/staff`, `GET /crm/staff/positions`, `DELETE /crm/staff/[id]`, `POST /crm/staff/invitations`
- **New types**: `StaffRole`, `StaffStatus` enums; `StaffListItem`, `Branch`, `StaffPosition` interfaces
- **Mock DB**: Extended with Branch (2), Staff (8), Position (11) seed data
- **Key UX decisions**: Page-based pagination (not infinite scroll); AlertDialog delete with 削除理由; bulk invite via Dialog

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
