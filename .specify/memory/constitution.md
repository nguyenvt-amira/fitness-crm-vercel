<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0  (initial ratification — no prior version existed)
Modified principles: N/A — all sections are new
Added sections:
  - Core Principles (I–V)
  - Technology Stack & Constraints
  - Development Workflow & Quality Gates
  - Governance
Templates requiring updates:
  - .specify/templates/plan-template.md  ⚠ pending — Constitution Check gates should
    reference the five principles listed here by Roman numeral
  - .specify/templates/spec-template.md  ⚠ pending — Success Criteria section should
    cite the LCP / INP / CLS budgets defined in Principle V
  - .specify/templates/tasks-template.md ⚠ pending — task categories should include
    "accessibility audit", "schema-contract test", and "Core Web Vitals budget check"
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): confirm exact project kick-off date with team;
    placeholder 2026-04-08 (today) used until confirmed.
-->

# Fitness CRM Constitution

## Core Principles

### I. Strict Type Safety (NON-NEGOTIABLE)

Every boundary in the codebase — API contracts, component props, form schemas, and
utility functions — MUST be expressed through TypeScript types or Zod schemas.
Runtime types inferred from Zod MUST be the single source of truth; duplicated
hand-written interfaces for the same shape are forbidden.

- OpenAPI types generated via `@hey-api/openapi-ts` are authoritative for all
  backend contracts. Manual overrides require an explicit inline comment that
  justifies the deviation.
- `any` is banned in production source code. The ESLint rule
  `@typescript-eslint/no-explicit-any` MUST remain `error` for all files under
  `src/` except the generated `src/lib/api/` subtree.
- Every Zod schema used in an API route MUST be co-located in
  `src/app/api/_schemas/` and exported for reuse across the route handler and
  any client-side validation that mirrors the same shape.
- Schema changes that remove or rename fields are breaking (MAJOR); additions
  are non-breaking (MINOR). The version in the affected OpenAPI spec MUST be
  incremented accordingly before the PR is merged.

**Rationale**: The project uses `@asteasolutions/zod-to-openapi` to derive the
OpenAPI spec from Zod, making a unified type layer a natural extension of existing
practice. Drift between runtime and compile-time types is the primary source of
silent regressions in CRM data flows (e.g., member profile updates silently losing
fields).

### II. Component Purity & UI Consistency (NON-NEGOTIABLE)

All user-facing UI MUST be composed exclusively from design-system primitives in
`src/components/ui/` (Radix UI / shadcn-based) or documented composite components
in `src/components/common/`. Ad-hoc component logic duplicated across feature
folders is forbidden.

- One-off inline styles and arbitrary Tailwind classes that bypass the design
  token system (e.g., hard-coded hex colours, font sizes outside the type scale)
  are forbidden without an approved design exception recorded in the feature spec.
- New primitive components MUST be added to `src/components/ui/` and reviewed
  before being consumed by any feature. Primitives MUST NOT encode feature-specific
  business logic.
- Interactive elements MUST meet WCAG 2.1 AA colour-contrast requirements.
  Keyboard navigation and ARIA roles are mandatory for all custom interactive
  widgets (dialogs, comboboxes, data tables).
- The Noto Sans JP font family and the CSS variable token system in
  `src/app/globals.css` are canonical. No additional font families may be
  introduced without a constitution amendment.

**Rationale**: A CRM used daily by gym staff requires zero ambiguity in form
controls, tables, and dialogs. Consistent UI primitives reduce onboarding cost and
prevent accidental UX divergence between feature teams working in parallel.

### III. Server-State Ownership via React Query

All asynchronous server state MUST be fetched and mutated through TanStack React
Query using the generated SDK option-factories from
`src/lib/api/@tanstack/react-query.gen`.

- Direct `fetch` or third-party HTTP calls from components or custom hooks are
  forbidden. All network logic MUST flow through the `@hey-api/client-fetch`
  adapter configured in `src/lib/client.config.ts`.
- Query keys MUST be derived from the generated option-factory helpers (e.g.,
  `getCrmMembersInfiniteOptions`). Hand-crafted string query keys are forbidden.
- Optimistic updates and cache invalidation strategies MUST be documented in the
  relevant feature spec before implementation begins.
- Client-side global state that outlives a single component tree MUST use URL
  search params via `nuqs`. React context is permitted only for ephemeral UI
  state (e.g., table row selection, panel open/close). Introducing a global state
  store (Redux, Zustand, Jotai, etc.) requires a constitution amendment.

**Rationale**: Centralising data-fetching in React Query with typed generated
option-factories provides a single invalidation surface, prevents request
waterfalls, and ensures loading/error states are handled uniformly across all CRM
list and detail views.

### IV. Schema-Contract Testing (NON-NEGOTIABLE)

Every API route handler MUST have a corresponding contract test that:

1. Validates the request shape against the route's Zod input schema.
2. Validates the response shape against the corresponding `types.gen.ts` output type.
3. Covers at least one happy-path scenario and one error-path scenario (e.g.,
   validation failure, not-found).

Enforcement rules:

- New routes MUST NOT be merged without passing contract tests.
- Any schema change (add / remove / rename field) MUST trigger re-generation of
  `src/lib/openapi.json` via `npm run generate-openapi` and re-generation of the
  TypeScript client via `npm run generate-client` before the PR is opened.
- `src/app/api/_mock-db.ts` MUST remain structurally consistent with `types.gen.ts`
  at all times. A TypeScript compilation error in the mock database is a
  build-blocking failure that MUST be resolved before merge.
- The `@tanstack/eslint-plugin-query` ruleset MUST remain enabled; disabling
  individual query-lint rules requires an inline comment with justification.

**Rationale**: The project auto-generates its OpenAPI spec from Zod schemas and
its TypeScript client from that spec. Contract tests close the feedback loop between
the Zod definition, the generated JSON spec, and the generated client, preventing
silent breaking changes that would corrupt CRM staff workflows (membership
applications, member profile edits, contract management).

### V. Performance Budget & Core Web Vitals

Every page route MUST meet the following budgets, measured on production builds
with a simulated mid-tier device and 4G connection:

| Metric                             | Budget                            |
| ---------------------------------- | --------------------------------- |
| LCP (Largest Contentful Paint)     | ≤ 2.5 s                           |
| INP (Interaction to Next Paint)    | ≤ 200 ms for primary interactions |
| CLS (Cumulative Layout Shift)      | ≤ 0.1 on all paginated list views |
| Initial JS bundle per route (gzip) | ≤ 250 kB                          |

Implementation constraints:

- Infinite-scroll list views MUST use `useInfiniteQuery` with a server-side page
  size of ≤ 50 records per request.
- Images MUST use `next/image` with explicit `width`/`height` or `fill` + a
  `sizes` attribute. Bare `<img>` tags are forbidden in production source.
- Dynamic imports via `next/dynamic` MUST be used for any component subtree
  exceeding 30 kB gzip that is not on the critical render path.
- React Server Components (RSC) MUST be the default rendering mode. `'use client'`
  MUST only appear when the component genuinely requires browser APIs, DOM event
  handlers, or React hooks that cannot run on the server.

**Rationale**: CRM staff interact with the application tens of times daily across
member management, membership applications, and contract workflows. Slow page loads
and jank during table operations directly reduce productivity and increase the
risk of data-entry errors.

## Technology Stack & Constraints

**Runtime**: Node.js ≥ 24.0.0 (enforced via the `engines` field in `package.json`).

**Framework**: Next.js 16 (App Router only). Page Router is forbidden for new routes.

**Styling**: Tailwind CSS v4 with `tailwind-merge` + `clsx` via the `cn()` utility
in `src/lib/utils.ts`. CSS-in-JS libraries (styled-components, Emotion, etc.)
MUST NOT be introduced.

**Forms**: `react-hook-form` + `@hookform/resolvers/zod`. Raw controlled components
managing their own validation state are forbidden for any form with more than one
field.

**Date handling**: `date-fns` v4 is the sole permitted date library. `moment`,
`dayjs`, and `luxon` are explicitly banned.

**API client generation**: `@hey-api/openapi-ts` at the version pinned in
`package.json`. Version upgrades MUST be accompanied by a full `npm run generate-client`
run and a verification that no generated type changes are breaking before merging.

**Linting & Formatting**:

- ESLint config: `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
  - `eslint-config-prettier`, canonical in `eslint.config.mjs`.
- Prettier config: 100-char print width, single quotes, trailing commas, with the
  import-order enforcing the layer sequence:
  `react` → `next` → third-party → `@/hooks` → `@/components` → `@/lib` →
  `@/types` → relative. Deviations from this order are a lint error.
- `lint-staged` + `husky` enforce lint and format on every commit. Bypassing hooks
  with `--no-verify` is forbidden except in documented emergency hotfix branches.

**Internationalisation**: Japanese (ja) is the primary display language for UI
labels and user-visible copy. English is used for all code identifiers, comments,
and documentation. Hard-coded Japanese strings in components are acceptable until
a dedicated i18n migration spec is ratified.

## Development Workflow & Quality Gates

### Branch Strategy

- Feature branches: `###-feature-name` (sequential numbering managed by `.specify`).
- Hotfix branches: `hotfix/short-description`.
- Direct commits to `main` are forbidden; all changes require a pull request.

### Definition of Done

A feature is considered done when ALL of the following gates pass:

1. **Type check**: `tsc --noEmit` exits with code 0.
2. **Lint**: `eslint` exits with code 0 (zero errors, zero promoted warnings).
3. **Contract tests**: All API route contract tests pass (Principle IV).
4. **Constitution Check**: The feature's plan document contains a completed
   Constitution Check section with explicit pass / N/A / justified-exception
   status for each of Principles I–V.
5. **Performance review**: Lighthouse CI (or equivalent) confirms budgets from
   Principle V are met for all new or changed routes.
6. **Design review**: All new UI components have been verified against the shadcn
   primitive catalogue; no duplicate primitives have been introduced.

### Mock Database Policy

`src/app/api/_mock-db.ts` is the shared in-memory data layer for local development
and integration testing.

- It MUST compile without errors against `types.gen.ts` at all times.
- Seed data MUST include at least three stores and three contract plans to exercise
  multi-store filtering logic.
- Mock data MUST NOT be used in production builds. The `NEXT_PUBLIC_API_URL`
  environment variable gates all real API calls.

### Secrets & Environment Variables

- All environment variables MUST be declared in `.env.example` with placeholder
  values and a one-line description before the feature is merged.
- `NEXT_PUBLIC_*` variables are embedded in the client bundle at build time.
  No secrets (API keys, session tokens, credentials) may use the `NEXT_PUBLIC_`
  prefix.
- `.env` and `.env.local` are git-ignored. Committing real secrets to the
  repository is a critical violation requiring immediate credential rotation.

## Governance

This constitution supersedes all other project conventions. In cases of conflict,
the constitution takes precedence over README guidance, PR comments, or verbal
agreements made outside the amendment process.

**Amendment procedure**:

1. Open a proposal issue describing the principle change and its motivation.
2. The proposing engineer drafts the amended constitution and increments the
   version according to the versioning policy below.
3. At least one other engineer MUST approve the amended draft.
4. `LAST_AMENDED_DATE` is updated to the merge date (ISO 8601: YYYY-MM-DD).
5. All dependent templates under `.specify/templates/` are updated in the same PR.

**Compliance review**:

- Every pull request description MUST include a "Constitution Check" checklist
  referencing any principles affected by the change.
- Automated gates (type check, lint, contract tests) MUST be green before merge.
- Violations that cannot be immediately remediated MUST be recorded as
  `TODO(CONSTITUTION-<PRINCIPLE>): <explanation>` inline comments with a linked
  follow-up issue.

**Versioning policy**: `MAJOR.MINOR.PATCH` per semantic versioning.

- MAJOR: backward-incompatible governance change — principle removed or
  fundamentally redefined.
- MINOR: new principle or section added; materially expanded guidance.
- PATCH: clarifications, wording adjustments, typo fixes with no semantic change.

**Version**: 1.0.0 | **Ratified**: 2026-04-08 | **Last Amended**: 2026-04-08
