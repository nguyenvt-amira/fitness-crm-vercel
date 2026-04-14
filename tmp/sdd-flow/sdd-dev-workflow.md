# SDD Development Workflow — Fitness CRM

> AI-assisted development workflow using **SpecKit** (GitHub Copilot) for the Fitness CRM project.
> Reference: [sdd-sequence-flow.md](./sdd-sequence-flow.md) | [constitution.md](../.specify/memory/constitution.md) | [implementation-playbook.md](../.specify/memory/implementation-playbook.md)

---

## Overview

```
PO / PM → Feature idea or Jira ticket
    |
    v
[Phase 1] Kickoff & Handoff ──── Commit prototype + flow screens + spec assets to feature branch
    |
    v
Feature Branch (### -feature-name)
    |
    v
[Phase 2] FE: Spec Analysis & Implementation
    |
    ├─ speckit.specify ──── spec.md (draft)
    ├─ speckit.clarify ──── spec.md (finalized, all [NEEDS CLARIFICATION] resolved)
    ├─ speckit.plan    ──── plan.md · research.md · data-model.md · api-contracts/
    ├─ speckit.tasks   ──── tasks.md
    ├─ speckit.analyze ──── consistency report (spec / plan / tasks)
    └─ speckit.implement── code + tests
    |
    v
★ Review Gate 1 – Spec Approved (PO / BA)
    |
    v
[Phase 3] BE Integration & FE–BE Contract QA ──── openapi.json finalized
    |
    v
★ Review Gate 2 – Contract Finalized (FE + BE)
    |
    v
[Phase 4] FE: Real API Integration
    |
    ├─ speckit.plan    ──── plan-integrate-api.md · tasks-integrate-api.md
    └─ speckit.implement── integrated code
    |
    v
[Phase 5] QC: System Testing
    |
    v
★ Review Gate 3 – QC Sign-off
    |
    v
[Phase 6] Bug Triage & Fix (if defects)
    |
    ├─ speckit.specify ──── spec.md (bug scope update)
    ├─ speckit.tasks   ──── tasks-bug.md
    └─ speckit.implement── fixed code
    |
    v
[Phase 7] Verification & Release ──── MR approved → merge → deploy
    |
    v
★ Review Gate 4 – MR Approved
```

---

## Phase 1: Kickoff & Handoff

PO/PM commits prototype, flow screens, and spec assets to the feature branch and notifies the team.

### Branch naming

```
### -feature-name
# Example: 001-staff-list
```

### What to commit

| Asset                          | Location                |
| ------------------------------ | ----------------------- |
| Prototype (HTML or Figma link) | `docs/specs/<feature>/` |
| Flow screens (PNG / Figma)     | `docs/specs/<feature>/` |
| Spec assets (Markdown notes)   | `docs/specs/<feature>/` |

---

## Phase 2: FE Spec Analysis & Implementation

### Step 1 — Draft spec (`speckit.specify`)

Trigger SpecKit Specify with the feature description and commit reference. SpecKit pulls the spec assets from the branch, performs a diff, and generates `spec.md`.

**Output:** `docs/specs/<feature>/spec.md` (draft — contains `[NEEDS CLARIFICATION]` tags)

### Step 2 — Clarify (`speckit.clarify`)

SpecKit identifies up to 5 targeted clarification questions about underspecified areas.

- Resolve within Dev authority → answer directly
- Resolve outside Dev authority → escalate to PO/PM, feed decision back to SpecKit
- All `[NEEDS CLARIFICATION]` tags must be resolved before proceeding

**Output:** `docs/specs/<feature>/spec.md` (finalized)

Commit the finalized spec:

```bash
git add docs/specs/<feature>/spec.md
git commit -m "docs: finalize spec for <feature>"
```

★ **Review Gate 1** — PO and BA review `spec.md`. All acceptance criteria must be verifiable. Status moves from `draft` → `approved`.

### Step 3 — Implementation plan (`speckit.plan`)

SpecKit generates the technical implementation plan from the approved spec.

**Output:**

- `docs/specs/<feature>/plan.md`
- `docs/specs/<feature>/research.md`
- `docs/specs/<feature>/data-model.md`
- `docs/specs/<feature>/contracts/api-contracts.md`

### Step 4 — Task breakdown (`speckit.tasks`)

SpecKit breaks the plan into a dependency-ordered task list.

**Output:** `docs/specs/<feature>/tasks.md`

### Step 5 — Consistency analysis (`speckit.analyze`)

SpecKit performs a read-only cross-artifact check across `spec.md`, `plan.md`, and `tasks.md`.

- Constitution violations → CRITICAL (must fix before proceeding)
- Inconsistencies / gaps → HIGH/MEDIUM (fix or document justification)

**Output:** Analysis report (no files modified)

### Step 6 — Implementation (`speckit.implement`)

SpecKit executes `tasks.md` following the implementation order in the playbook.

**Implementation order (MANDATORY):**

```
Phase 1: Data Layer
  □ src/types/<feature>.type.ts
  □ src/app/api/_schemas/<feature>.schema.ts
  □ src/app/api/_mock-db.ts (extend with seed data)

Phase 2: API Routes
  □ src/app/api/crm/<feature>/route.ts
  □ src/app/api/crm/<feature>/<sub-resource>/route.ts  (if needed)
  □ src/app/api/crm/<feature>/[id]/route.ts            (if DELETE/PATCH needed)
  □ src/app/api/_routes/index.ts                       (add imports)
  □ npm run generate-openapi                           (dev server must be running)
  □ npm run generate-api
  □ Verify generated factories in src/lib/api/

Phase 3: UI Components
  □ src/app/(private)/<feature>/_hooks/use-<feature>-filters.ts
  □ src/app/(private)/<feature>/_contexts/<feature>-filters-context.tsx
  □ src/app/(private)/<feature>/_components/<feature>-table-columns.tsx
  □ src/app/(private)/<feature>/_components/<feature>-filters.tsx
  □ src/app/(private)/<feature>/_components/<feature>-delete-dialog.tsx
  □ src/app/(private)/<feature>/_components/<feature>-invite-dialog.tsx (if needed)
  □ src/app/(private)/<feature>/page.tsx
  □ src/app/(private)/<feature>/layout.tsx                              (if needed)

Phase 4: Validation
  □ npm run type-check  (zero errors)
  □ npm run lint        (zero errors)
  □ npm run build       (bundle ≤ 250 kB per route)
  □ Manual browser test
```

**Output:** Code + tests committed to feature branch with mock API

```bash
git add .
git commit -m "feat(<feature>): implement UI with mock API (refs spec)"
```

---

## Phase 3: BE Integration & FE–BE Contract QA

FE hands off `api-contracts/` to BE for review and real API implementation.

### Contract review checklist

| Item                                             | Owner   |
| ------------------------------------------------ | ------- |
| Endpoint paths match spec                        | FE + BE |
| Field names and data types match `data-model.md` | FE + BE |
| Auth flow and error codes are agreed             | FE + BE |
| Breaking changes require PO sign-off             | PO      |

★ **Review Gate 2** — BE commits `openapi.json` (real API). FE confirms the contract matches `api-contracts.md`.

---

## Phase 4: FE — Real API Integration

### Step 1 — Integration plan (`speckit.plan`)

Feed `openapi.json` into SpecKit to generate the integration plan.

**Output:**

- `docs/specs/<feature>/plan-integrate-api.md`
- `docs/specs/<feature>/tasks-integrate-api.md`

### Step 2 — Implementation (`speckit.implement`)

Execute `tasks-integrate-api.md`. Verify all four states: `loading` / `error` / `empty` / `success`.

```bash
git add .
git commit -m "feat(<feature>): integrate real API (refs spec)"
# Remove temp plan/task files from the branch
git rm docs/specs/<feature>/plan-integrate-api.md
git rm docs/specs/<feature>/tasks-integrate-api.md
git commit -m "chore: remove temp integration plan files"
```

---

## Phase 5: QC — System Testing

| Input                           | Source  |
| ------------------------------- | ------- |
| Test build (integrated branch)  | FE Dev  |
| `spec.md` + acceptance criteria | PO / PM |

| Outcome       | Next step                                   |
| ------------- | ------------------------------------------- |
| All passed    | ★ Gate 3 — QC sign-off → proceed to Phase 7 |
| Defects found | Bug report + evidence → Phase 6             |

---

## Phase 6: Bug Triage & Fix

### Triage

Request reproduction steps from QC. Determine bug scope:

| Scope  | Action                                               |
| ------ | ---------------------------------------------------- |
| BE bug | Hand off report + evidence + affected endpoint to BE |
| FE bug | Proceed with SpecKit fix flow below                  |
| Shared | Coordinate FE + BE, split into separate fix tickets  |

### FE bug fix flow

1. **`speckit.specify`** — feed bug report → update `spec.md` with bug scope
2. Escalate to PO if the fix requires a spec change; get decision before proceeding
3. **`speckit.tasks`** — generate `tasks-bug.md` from updated spec
4. **`speckit.implement`** — execute `tasks-bug.md`

```bash
git add .
git commit -m "fix(<feature>): <bug description> (refs bug-ID + spec)"
```

Notify QC: fix deployed, ready for re-verification.

---

## Phase 7: Verification & Release

QC re-tests and confirms sign-off. PO/PM approves the MR.

```
QC re-test passed
    → PO approves MR
    → Merge to main / release branch
    → Deployed to production
```

★ **Review Gate 4** — MR approval. Reviewer checklist:

| Step | Check                                                   |
| ---- | ------------------------------------------------------- |
| 1    | All acceptance criteria in `spec.md` are met            |
| 2    | No interfaces listed in "do not change" are broken      |
| 3    | No files outside the defined scope were modified        |
| 4    | Constitution Check section is complete (Principles I–V) |

---

## SpecKit Agent Quick Reference

| Agent               | Command                          | When to invoke                                                              |
| ------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| `speckit.specify`   | `@speckit.specify <description>` | Phase 2 Step 1 — draft spec from assets; Phase 6 — bug scope update         |
| `speckit.clarify`   | `@speckit.clarify`               | Phase 2 Step 2 — resolve ambiguities before planning                        |
| `speckit.plan`      | `@speckit.plan`                  | Phase 2 Step 3 — implementation plan; Phase 4 — integration plan            |
| `speckit.tasks`     | `@speckit.tasks`                 | Phase 2 Step 4 — task list; Phase 6 — bug fix tasks                         |
| `speckit.analyze`   | `@speckit.analyze`               | Phase 2 Step 5 — cross-artifact consistency (run after tasks)               |
| `speckit.implement` | `@speckit.implement`             | Phase 2 Step 6 — execute tasks; Phase 4 — integrate API; Phase 6 — fix bugs |
| `speckit.checklist` | `@speckit.checklist <domain>`    | Any phase — generate requirements quality checklist                         |

---

## Definition of Done

A feature branch is ready to merge when ALL gates pass:

| Gate                  | Check                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------- |
| ✅ Type check         | `npm run type-check` → 0 errors                                                         |
| ✅ Lint               | `npm run lint` → 0 errors                                                               |
| ✅ Contract tests     | All API route contract tests pass (Constitution Principle IV)                           |
| ✅ Constitution Check | `spec.md` plan section has explicit pass / N/A / justified-exception for Principles I–V |
| ✅ Performance        | `npm run build` → bundle ≤ 250 kB per route; LCP ≤ 2.5 s                                |
| ✅ Design review      | No duplicate UI primitives; WCAG 2.1 AA contrast                                        |
| ✅ QC sign-off        | All acceptance criteria verified                                                        |

---

## Feedback Loop

| Situation                           | Action                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------- |
| Spec is wrong after writing         | Re-run `speckit.specify` or edit `spec.md` directly; open a spec PR before changing code |
| Plan doesn't match spec             | Re-run `speckit.plan` with the corrected spec                                            |
| Tasks are too coarse                | Re-run `speckit.tasks`; target 1 task ≈ 1 atomic commit                                  |
| `speckit.analyze` flags CRITICAL    | Fix the affected artifact; do not proceed to `speckit.implement`                         |
| Code doesn't match spec             | `speckit.implement` self-reviews via `speckit.analyze`; fix and re-run                   |
| Codegen mismatch after route change | Follow codegen pipeline: `generate-openapi` → `generate-api` → verify factories          |

---

## Key Files Reference

| File                                              | Purpose                                                   |
| ------------------------------------------------- | --------------------------------------------------------- |
| `.specify/memory/constitution.md`                 | Project constitution — non-negotiable principles          |
| `.specify/memory/implementation-playbook.md`      | Proven patterns, anti-patterns, codegen pipeline          |
| `.github/copilot-instructions.md`                 | Active tech stack and project structure                   |
| `docs/specs/<feature>/spec.md`                    | Feature specification (SpecKit output)                    |
| `docs/specs/<feature>/plan.md`                    | Implementation plan (SpecKit output)                      |
| `docs/specs/<feature>/tasks.md`                   | Task list (SpecKit output)                                |
| `docs/specs/<feature>/contracts/api-contracts.md` | FE–BE API contract                                        |
| `src/app/api/_mock-db.ts`                         | In-memory mock DB (must stay in sync with `types.gen.ts`) |
| `src/lib/api/`                                    | Generated client — **do not edit manually**               |
