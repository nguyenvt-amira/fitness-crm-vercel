# Fitness CRM Architecture

> Change frequency: Low (update only when system structure changes significantly)
> Last updated: April 2026

---

## 1. System Overview

Fitness CRM is a **member management platform** for fitness gym operations, supporting two brands: **JOYFIT** and **FIT365**.

The system consists of:

- **CRM Web Application** (this repository) — Staff-facing management console
- **Mobile Application** — Member-facing app for entry, bookings, and account management
- **External Integrations** — Payment gateways (SBPS, JACCS), WordPress CMS, push notification services

```
┌─────────────────────────────────────────────────────────────────┐
│                     Fitness CRM Platform                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   CRM Web    │  │  Mobile App  │  │   WordPress CMS      │   │
│  │  (Next.js)   │  │  (iOS/And)   │  │  (Public Website)    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘   │
│         │                 │                                      │
│         └────────┬────────┘                                      │
│                  ▼                                               │
│         ┌───────────────────┐                                    │
│         │   Backend API     │                                    │
│         │   (REST/OpenAPI)  │                                    │
│         └────────┬──────────┘                                    │
│                  │                                               │
│    ┌─────────────┼─────────────┐                                 │
│    ▼             ▼             ▼                                 │
│ ┌──────┐   ┌──────────┐  ┌──────────┐                           │
│ │  DB  │   │   SBPS   │  │  JACCS   │                           │
│ └──────┘   │ (Credit) │  │  (Bank)  │                           │
│            └──────────┘  └──────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Application Structure

This project follows **Next.js 16 App Router** architecture with the following structure:

```
src/
├── app/
│   ├── api/                    # API Routes (OpenAPI documented)
│   │   ├── _mock-db.ts         # In-memory mock database
│   │   ├── _schemas/           # Zod schemas for validation
│   │   ├── _routes/            # Route registration helpers
│   │   └── crm/                # CRM API endpoints
│   │       ├── members/        # Member management APIs
│   │       ├── staff/          # Staff management APIs
│   │       └── ...
│   │
│   ├── (private)/              # Authenticated routes (CRM screens)
│   │   ├── members/            # A-01: Member Management
│   │   ├── membership-applications/  # C-01: Applications
│   │   └── settings/           # Y-*: System Settings
│   │       └── staff/          # Y-01: Staff Management
│   │
│   └── (public)/               # Public routes
│       ├── login/              # Authentication
│       └── 403/                # Access denied
│
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   └── common/                 # Shared components
│       ├── data-table/         # Generic data table
│       └── data-state-boundary/# Loading/error states
│
├── lib/
│   ├── api/                    # GENERATED - TS client from OpenAPI
│   ├── utils.ts                # cn() utility
│   └── client.config.ts        # API client configuration
│
├── types/                      # TypeScript type definitions
│   ├── member.type.ts          # Member-related enums/types
│   ├── staff.type.ts           # Staff-related enums/types
│   └── global.type.ts          # Shared types
│
└── providers/                  # React context providers
    └── react-query.provider.tsx
```

---

## 3. Module Architecture (Feature-based)

Each functional module follows a consistent structure:

```
(private)/[module-name]/
├── page.tsx                    # Main page component (RSC or Client)
├── _components/                # Module-specific components
│   ├── [module]-table-columns.tsx
│   ├── [module]-filters.tsx
│   └── [module]-dialogs.tsx
├── _contexts/                  # Module-specific React contexts
│   └── [module]-filters-context.tsx
└── _hooks/                     # Module-specific hooks
    └── use-[module]-filters.ts
```

### Design Principles

1. **OOUI (Object-Oriented UI)**: Member details are the central "person" object, with all related data accessible from a single view
2. **Server Components by Default**: Only use \`'use client'\` when hooks/events are required
3. **URL State via nuqs**: Filter/sort/pagination state lives in URL search params
4. **Generated API Client**: All API calls through React Query + generated option factories

---

## 4. API Design

### OpenAPI-First Development

```
Zod Schema → OpenAPI Spec → Generated TypeScript Client → React Query Factories
```

1. Define Zod schemas in \`src/app/api/\_schemas/\`
2. Use \`registerRoute()\` helper for OpenAPI documentation
3. Run \`npm run generate-api\` to regenerate client code
4. Use generated factories in React Query hooks

### API Route Structure

```
/api/crm/
├── members/                    # GET: List members
│   └── [id]/                   # GET/PATCH/DELETE: Single member
├── staff/                      # GET: List staff
│   ├── [id]/                   # DELETE: Remove staff
│   ├── positions/              # GET: List positions
│   └── invitations/            # POST: Invite staff
└── applications/               # GET: List applications
    └── [id]/                   # GET/PATCH: Single application
```

---

## 5. Authentication & Authorization

### 6-Role Permission Model

| Role        | Display Name | Scope                  | Description                 |
| ----------- | ------------ | ---------------------- | --------------------------- |
| System      | (hidden)     | All                    | Development/operations team |
| Headquarter | 本部         | All stores, all brands | Full management access      |
| Manager     | マネージャー | Multiple stores        | Cross-store management      |
| Staff       | スタッフ     | Single store           | Daily operations            |
| Trainer     | トレーナー   | Lesson-related only    | Lesson operations           |
| Observer    | 閲覧のみ     | Read-only              | View only                   |

### 3-Tier Permission Structure

```
Role (fixed, 6 types)
└── Position Master (HQ can add/edit)
    └── Individual (Manager assigns per store)
```

### Store Access Patterns

- **Pattern A (Direct)**: Staff → Store (1:1)
- **Pattern B (FC Company)**: Staff → FC Company → All managed stores

---

## 6. Brand Configuration

The system supports multi-brand operations with brand-specific settings:

| Setting                   | JOYFIT                       | FIT365                 |
| ------------------------- | ---------------------------- | ---------------------- |
| Minimum Age               | 15+                          | 16+                    |
| Transfer Mode             | Auto-transfer                | Manual 2-step approval |
| Enrollment Fee            | ¥2,000 + ¥3,000 registration | ¥5,000 card fee        |
| Prepay Period             | 1-2 months (per contract)    | 2 months fixed         |
| Cross-use                 | Primary contract (free)      | Option (¥500)          |
| Forced Withdrawal (SBPS)  | 2 months unpaid              | 2 months unpaid        |
| Forced Withdrawal (JACCS) | 1 month unpaid               | 3 months grace         |

---

## 7. External Integrations

### Payment Gateways

| Provider  | Method        | Schedule                        |
| --------- | ------------- | ------------------------------- |
| **SBPS**  | Credit Card   | 9th: Data send, 13th: Result    |
| **JACCS** | Bank Transfer | 12-13th: Send, Next 4th: Result |

### Entry/Exit Control

- **QR Code**: One-time QR from mobile app (primary method)
- **NFC Card**: I-CODE SLIX2 standard (legacy, being phased out)

### Content Management

- **WordPress**: Public website content
- **Push Notifications**: App-based notifications (SMS, push, email, in-app)

---

## 8. Data Model Overview

### Core Entities

| Entity           | Description                      | Key Relations                      |
| ---------------- | -------------------------------- | ---------------------------------- |
| Member           | Gym member with primary contract | → Store, → Contracts, → Entry logs |
| Staff            | CRM user (employee)              | → Role, → Position, → Store/FC     |
| Store            | Physical gym location            | → Brand, → FC Company              |
| Brand            | JOYFIT or FIT365                 | → Stores, → Contract templates     |
| Primary Contract | Base membership agreement        | → Member, → Options                |
| Option           | Add-on services (locker, etc.)   | → Member, → Primary Contract       |

### Member Status Flow

```
[Application] → [Pending Review] → [Approved/Member]
                                        ↓
                            ┌───────────┴───────────┐
                            ▼                       ▼
                       [Active]               [Suspended]
                            │                       │
                            └───────────┬───────────┘
                                        ▼
                                   [Withdrawn]
                                        ↓
                                  [Blacklisted]
```

---

## 9. Development Guidelines

### Code Style

- **TypeScript Strict Mode**: No \`any\`, use \`unknown\` + guards
- **Enums in Types**: Define in \`src/types/[module].type.ts\`
- **Import Order**: External → \`@/lib\` → \`@/components\` → \`@/app\`
- **Path Alias**: \`@/\` maps to \`src/\`

### Component Patterns

- **RSC by default**: Only \`'use client'\` when needed
- **DataTable**: Use \`DataTable<TData, TValue>\` for lists
- **Filters via Context**: \`nuqs\` → Context → Components
- **Mutations via React Query**: Never raw \`fetch\` in components
- **Toast via Sonner**: \`toast.success()\` / \`toast.error()\`

### API Route Patterns

- **Validation**: \`ZodSchema.safeParse()\` → 400 on failure
- **Response**: \`NextResponse.json(data, { status })\`
- **Documentation**: Use \`registerRoute()\` for OpenAPI

---

## 10. Related Documents

- [business-flows.md](./business-flows.md) — End-to-end business flows
- [business-glossary.md](./business-glossary.md) — Business term definitions
- [user-personas.md](./user-personas.md) — User types and behaviors
- \`.github/copilot-instructions.md\` — Agent development guidelines

---

_Last updated: April 2026_
