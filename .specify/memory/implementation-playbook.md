# Implementation Playbook

> **Purpose**: This file is the "implementation roadmap" for the entire project. All agents (plan, tasks, implement)
> MUST read this file **first** before reading source code. It contains proven patterns, correct commands, and anti-patterns to avoid.
>
> **Updates**: Whenever adding new patterns or discovering recurring errors, update this file.

---

## 1. Package Manager & Commands

| Action                  | Command                    | Notes                                                        |
| ----------------------- | -------------------------- | ------------------------------------------------------------ |
| Dev server              | `npm run dev`              | Start Next.js + mock API at `http://localhost:3000`          |
| Build production        | `npm run build`            | Check bundle size                                            |
| Lint                    | `npm run lint`             | ESLint + Prettier                                            |
| Type check              | `npm run type-check`       | `tsc --noEmit`                                               |
| Format                  | `npm run format`           | Prettier write                                               |
| Regenerate openapi.json | `npm run generate-openapi` | Runs `tsx src/app/api/_scripts/generate-openapi-from-zod.ts` |
| Regenerate API client   | `npm run generate-api`     | Runs `dotenv -e .env -- openapi-ts --output src/lib/api`     |
| Regenerate routes       | `npm run generate-routes`  | Runs `tsx src/lib/routes/scripts/generate-routes.ts`         |

### Codegen pipeline (MUST follow this order)

```bash
# 1. Dev server MUST be running (generate-api needs to hit live endpoint)
npm run dev

# 2. Regenerate openapi.json from registerRoute() definitions
npm run generate-openapi

# 3. Regenerate TypeScript client + React Query factories from openapi.json
npm run generate-api
```

**⚠ IMPORTANT**: `generate-api` reads from URL `NEXT_PUBLIC_OPENAPI_GENERATOR_URL` in `.env` (usually `http://localhost:3000/api/openapi.json`). Dev server MUST be running.

---

## 2. File Architecture by Layer

### 2.1. Types (`src/types/`)

- Use TypeScript `enum` (DO NOT use `as const` union)
- File naming: `[feature].type.ts`
- Exports: enums, interfaces, type aliases

```typescript
// src/types/staff.type.ts
export enum StaffRole {
  SYSTEM = 'system',
  HEADQUARTER = 'headquarter',
  // ...
}
export interface StaffListItem {
  /* ... */
}
```

### 2.2. Zod Schemas (`src/app/api/_schemas/`)

- File naming: `[feature].schema.ts`
- Each schema MUST have `.openapi({ example: ... })` annotations
- Schemas are single source of truth → export inferred `type` from Zod

```typescript
// src/app/api/_schemas/staff.schema.ts
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const StaffListItemSchema = z.object({
  staff_id: z.string().openapi({ example: 'STF-001' }),
  // ...
});
export type StaffListItemType = z.infer<typeof StaffListItemSchema>;
```

### 2.3. Mock Database (`src/app/api/_mock-db.ts`)

- All seed data centralized here
- Expose via `db.[entity]` accessor objects with `getList()`, `getById()`, `delete()` methods
- MUST be compile-compatible with `types.gen.ts`

### 2.4. API Routes (`src/app/api/crm/[feature]/`)

**Standard pattern for each route:**

```typescript
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/app/api/_mock-db';
import { ErrorSchema, MyQuerySchema, MyResponseSchema } from '@/app/api/_schemas/[feature].schema';
import { registerRoute } from '@/app/api/_scripts/register-route';

// 1. REGISTER OpenAPI BEFORE handler
registerRoute({
  method: 'get',
  path: '/crm/feature',
  summary: 'Short summary',
  description: 'Detailed description',
  tags: ['FeatureTag'],
  query: MyQuerySchema, // for GET query params
  // body: MyBodySchema,          // for POST/PUT/DELETE body
  // pathParams: MyPathSchema,    // for dynamic [id] params
  responses: [
    { status: 200, schema: MyResponseSchema, description: 'Success' },
    { status: 400, schema: ErrorSchema, description: 'Bad request' },
  ],
});

// 2. Handler export
export async function GET(request: NextRequest) {
  // Validate query
  const queryObj = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = MyQuerySchema.safeParse(queryObj);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  // Logic...
  return NextResponse.json(data, { status: 200 });
}
```

**After creating a NEW route → MUST add import to `src/app/api/_routes/index.ts`:**

```typescript
// src/app/api/_routes/index.ts
import '@/app/api/crm/[feature]/route';
```

### 2.5. Generated Client (`src/lib/api/` — DO NOT edit manually)

After `npm run generate-api`, will have:

- `types.gen.ts` — TypeScript interfaces
- `@tanstack/react-query.gen.ts` — React Query option factories
- `client.gen.ts` — SDK client
- `sdk.gen.ts` — SDK classes

**Naming convention for generated factories:**

- `GET /crm/staff` → `getCrmStaffOptions`, `getCrmStaffQueryKey`
- `GET /crm/staff/positions` → `getCrmStaffPositionsOptions`
- `DELETE /crm/staff/[id]` → `deleteCrmStaffByIdMutation`
- `POST /crm/staff/invitations` → `postCrmStaffInvitationsMutation`

### 2.6. Client Config (`src/lib/client.config.ts`)

```typescript
import type { CreateClientConfig } from '@/lib/api/client.gen';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
});
```

---

## 3. Frontend Component Patterns

### 3.1. Page Structure (`src/app/(private)/[feature]/page.tsx`)

```
'use client'
│
├── imports (external → @/lib → @/components → relative)
├── constants (BREADCRUMB_ITEMS, etc.)
│
├── PageContent() — business logic component
│   ├── useRouter()
│   ├── useState() for dialog state
│   ├── useContextHook() for filters (from context, NOT direct hook)
│   ├── useQuery() with generated options
│   ├── useMemo() for derived data
│   ├── handler functions
│   └── JSX: Header → Filters → Count → DataTable → Dialogs
│
├── PageWithProvider() — wraps Content in Provider
│   ├── useFiltersHook() — called HERE, passed as value to Provider
│   └── <Provider value={hook}><PageContent /></Provider>
│
└── default export Page() — wraps in <Suspense>
    └── <Suspense><PageWithProvider /></Suspense>
```

**Provider pattern (MANDATORY):**

- `useStaffFilters()` called in `PageWithProvider`, pass `value={filtersHook}` to Provider
- `PageContent` uses `useStaffFiltersContext()` (from context), DO NOT call hook again

### 3.2. Filter Hook (`_hooks/use-[feature]-filters.ts`)

```typescript
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

export function useStaffFilters() {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useQueryStates(
    {
      /* nuqs parsers */
    },
    { history: 'push', shallow: false },
  );

  // 300ms debounce for search (q) only, other filters fire immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      /* update q */
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const clearFilters = () => {
    /* reset filters DO NOT reset q */
  };
  const activeFilterCount = [
    /* non-null filter values */
  ].filter(Boolean).length;
  const queryParams = {
    /* strip empty/default values for API call */
  };

  return {
    searchInput,
    setSearchInput,
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,
    queryParams,
  };
}
```

### 3.3. Filter Context (`_contexts/[feature]-filters-context.tsx`)

```typescript
export type FiltersContextValue = ReturnType<typeof useFiltersHook>;
const Context = createContext<FiltersContextValue | undefined>(undefined);

export function Provider({ children, value }: Readonly<{ children: ReactNode; value: FiltersContextValue }>) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useContextHook() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('Must be used within Provider');
  return ctx;
}
```

### 3.4. Column Definitions (`_components/[feature]-table-columns.tsx`)

- Export function (NOT a hook) accepting options object
- Columns use `<DataTableColumnHeader>` for sortable columns
- `enableSorting: true/false` on each column
- Actions column uses callbacks (`onEditClick`, `onDeleteClick`), DO NOT use `useRouter()` inside
- Badge variant: `default` + `className="bg-green-500 text-white"` for active (NO `success` variant)

```typescript
interface ColumnsOptions {
  role: string;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export function tableColumns({
  role,
  onEditClick,
  onDeleteClick,
}: ColumnsOptions): ColumnDef<Row>[] {
  // DO NOT use useRouter() here — violates rules-of-hooks
  return [
    /* column defs */
  ];
}
```

### 3.5. DataTable Usage

```tsx
<DataTable
  variant="simple" // "simple" = standard table, "default" = infinite scroll
  columns={columns}
  data={staff}
  isLoading={isLoading}
  totalRows={total}
  tableOptions={{
    onSortingChange: handleSortingChange,
    manualSorting: true,
    state: { sorting },
  }}
/>
```

### 3.6. Delete Dialog (`_components/[feature]-delete-dialog.tsx`)

- Use `<AlertDialog>` (NOT `<Dialog>`)
- Optimistic update: `onMutate` → snapshot + remove from cache, `onError` → rollback
- Toast: `toast.success('Deleted successfully')` / `toast.error('Deletion failed')`
- Query invalidation: `queryClient.invalidateQueries({ queryKey: getQueryKey() })`

### 3.7. Invite/Create Dialog (`_components/[feature]-invite-dialog.tsx`)

- Use `<Dialog>` (NOT AlertDialog)
- Labels MUST use `<Label htmlFor="id">` + `id` prop on control (avoid a11y lint error)
- When generated client type has `body?: never` (codegen issue), use raw `fetch()` instead

---

## 4. Styling Rules

### Tailwind CSS v4

- Use standard utility classes, DO NOT use arbitrary values when standard class exists:
  - ❌ `min-w-[160px]` → ✅ `min-w-40`
  - ❌ `max-w-[240px]` → ✅ `max-w-60`
- Use `cn()` from `@/lib/utils` for conditional classes

### Badge Variants Available

`default` | `secondary` | `destructive` | `outline` | `ghost` | `link`

- **NO** `success` variant → use `variant="default" className="bg-green-500 text-white"`

### Import Order (enforced by ESLint)

```
react / next          → external libs
@/lib/                → @/components/
@/types/              → relative imports (./)
```

---

## 5. Anti-Patterns (ALREADY ENCOUNTERED — AVOID REPEATING)

| #   | Anti-pattern                                                     | Consequence                                    | Correct approach                                            |
| --- | ---------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| 1   | Use `useRouter()` in column factory function                     | Rules-of-hooks violation                       | Pass `onEditClick` callback prop                            |
| 2   | `window.location.href`                                           | ESLint: "Prefer globalThis over window"        | Use callback → `router.push()` in component                 |
| 3   | `variant="success"` on Badge                                     | Runtime error, variant doesn't exist           | `variant="default"` + `className="bg-green-500 text-white"` |
| 4   | Arbitrary Tailwind values when standard class exists             | ESLint warning                                 | Use standard: `min-w-40` instead of `min-w-[160px]`         |
| 5   | `void promise`                                                   | SonarJS: "Remove this use of void"             | `.catch(console.error)`                                     |
| 6   | `<label>` HTML element                                           | a11y lint: "must be associated with control"   | `<Label htmlFor="id">` + `id` on control                    |
| 7   | Call `useFiltersHook()` in both Provider AND Content             | Two separate instances, state out of sync      | Call hook once in Provider wrapper, Content uses Context    |
| 8   | Use `pnpm` commands                                              | Project uses npm                               | Use `npm run [script]`                                      |
| 9   | `body` in DELETE mutation when generated type has `body?: never` | TypeScript error                               | Remove body, or use raw fetch if body needed                |
| 10  | Heredoc (`cat << 'EOF'`) to write file with JSX                  | Shell parse error with `${}` template literals | Use Python script to write file                             |

---

## 6. Codegen Pipeline in Detail

### When adding a NEW API route:

1. Create Zod schemas in `src/app/api/_schemas/[feature].schema.ts`
2. Create route file with `registerRoute()` + handler
3. **Add import** to `src/app/api/_routes/index.ts`
4. Run `npm run generate-openapi` (dev server must be running)
5. Run `npm run generate-api`
6. Verify generated factories in `src/lib/api/@tanstack/react-query.gen.ts`

### Important config files:

| File                           | Purpose                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| `openapi-ts.config.ts`         | Config for `@hey-api/openapi-ts` — input URL, output path, plugins  |
| `.env`                         | `NEXT_PUBLIC_OPENAPI_GENERATOR_URL` — URL endpoint for openapi.json |
| `src/lib/client.config.ts`     | Base URL for SDK client                                             |
| `src/app/api/_routes/index.ts` | Import all routes → triggers `registerRoute()`                      |

---

## 7. Feature Implementation Checklist

When implementing a new feature, follow this order:

```
Phase 1: Data Layer
  □ types/[feature].type.ts
  □ api/_schemas/[feature].schema.ts
  □ api/_mock-db.ts (extend)

Phase 2: API Routes
  □ api/crm/[feature]/route.ts (GET list)
  □ api/crm/[feature]/[sub-resource]/route.ts
  □ api/crm/[feature]/[id]/route.ts (DELETE/PATCH)
  □ api/_routes/index.ts (add imports)
  □ npm run generate-openapi
  □ npm run generate-api
  □ Verify generated factories

Phase 3: UI Components
  □ (private)/[feature]/_hooks/use-[feature]-filters.ts
  □ (private)/[feature]/_contexts/[feature]-filters-context.tsx
  □ (private)/[feature]/_components/[feature]-table-columns.tsx
  □ (private)/[feature]/_components/[feature]-filters.tsx
  □ (private)/[feature]/_components/[feature]-delete-dialog.tsx
  □ (private)/[feature]/_components/[feature]-invite-dialog.tsx (if needed)
  □ (private)/[feature]/page.tsx
  □ (private)/[feature]/layout.tsx (if needed)

Phase 4: Validation
  □ npm run type-check (zero errors)
  □ npm run lint (zero errors)
  □ npm run build (bundle ≤ 250kB)
  □ Manual test in browser
```

---

## 8. Reference Implementation

**Complete feature for reference**: `settings/staff/` (001-staff-list)

| Layer           | File                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| Types           | `src/types/staff.type.ts`                                                     |
| Schemas         | `src/app/api/_schemas/staff.schema.ts`                                        |
| Mock DB         | `src/app/api/_mock-db.ts` (section `db.staff`, `db.branches`, `db.positions`) |
| GET list        | `src/app/api/crm/staff/route.ts`                                              |
| GET positions   | `src/app/api/crm/staff/positions/route.ts`                                    |
| DELETE          | `src/app/api/crm/staff/[id]/route.ts`                                         |
| POST invite     | `src/app/api/crm/staff/invitations/route.ts`                                  |
| Filters hook    | `src/app/(private)/settings/staff/_hooks/use-staff-filters.ts`                |
| Filters context | `src/app/(private)/settings/staff/_contexts/staff-filters-context.tsx`        |
| Columns         | `src/app/(private)/settings/staff/_components/staff-table-columns.tsx`        |
| Filter bar      | `src/app/(private)/settings/staff/_components/staff-filters.tsx`              |
| Delete dialog   | `src/app/(private)/settings/staff/_components/staff-delete-dialog.tsx`        |
| Invite dialog   | `src/app/(private)/settings/staff/_components/staff-invite-dialog.tsx`        |
| Page            | `src/app/(private)/settings/staff/page.tsx`                                   |

**Additional reference** (infinite scroll pattern): `members/`

| Layer   | File                                                              |
| ------- | ----------------------------------------------------------------- |
| Page    | `src/app/(private)/members/page.tsx`                              |
| Columns | `src/app/(private)/members/_components/members-table-columns.tsx` |
| Filters | `src/app/(private)/members/_components/members-filters.tsx`       |
| Hook    | `src/app/(private)/members/_hooks/use-members-filters.ts`         |
| Context | `src/app/(private)/members/_contexts/members-filters-context.tsx` |
