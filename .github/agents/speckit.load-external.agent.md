---
description: Load spec requirements and UI mockups directly from dx-fitness/fitness-crm-ui (single repo) and return structured context for the speckit pipeline.
---

## Purpose

This agent reads from **one remote git repo** only — `dx-fitness/fitness-crm-ui`.  
**Do not rely on any pre-existing local path.**  
All file access must be performed via a local mirror/cache that is cloned/fetched from the remote URL during execution.

### Git Prerequisite (GitHub)

Before running this agent, ensure `git` can clone/fetch from the GitHub remote (SSH key or HTTPS credential configured for `dx-fitness/fitness-crm-ui`).

| Git repo                    | Remote URL                                     | Local cache dir         |
| --------------------------- | ---------------------------------------------- | ----------------------- |
| `dx-fitness/fitness-crm-ui` | `git@github.com:dx-fitness/fitness-crm-ui.git` | `.cache/fitness-crm-ui` |

HTTPS alternative: `https://github.com/dx-fitness/fitness-crm-ui.git`

### Git-only Access Rules

| Operation          | Command to use                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Init/update mirror | `git clone <repo-url> <cache-dir>` (if missing), else `git -C <cache-dir> fetch --all --prune` |
| Checkout snapshot  | `git -C <cache-dir> checkout --detach origin/<default-branch>`                                 |
| Read a file        | `git -C <cache-dir> show HEAD:<relative-path>`                                                 |
| List all files     | `git -C <cache-dir> ls-files <directory>`                                                      |
| Check last commit  | `git -C <cache-dir> log --oneline -1`                                                          |
| Search in content  | `git -C <cache-dir> grep -l "<keyword>" -- <glob>`                                             |

The agent locates the files relevant to the requested feature, reads them via git, and returns a **structured context block** that other agents (primarily `speckit.specify`) can consume directly.

---

## User Input

```text
$ARGUMENTS
```

The input may be:

- A **spec ID** — e.g., `A-02`, `G-03`, `Y-01`
- A **feature keyword or page name** — e.g., `member transfer`, `移籍管理`, `staff-list`
- A **combined reference** — e.g., `A-02 + transfer-list`
- An explicit **source flag** — `--spec-only`, `--ui-only` to limit the search

---

## Remote Repo Structure Reference

### Single Repo: `dx-fitness/fitness-crm-ui`

Remote repo `https://github.com/dx-fitness/fitness-crm-ui` (`git@github.com:dx-fitness/fitness-crm-ui.git`).

> ⚠️ **Maintenance rule**: If a new spec file or page file is added to the repo, it **MUST** also be appended to the relevant registry tables below.

```text
fitness-crm-ui/
├── src/
│   ├── pages/                # Page-level TSX mockups (list/detail/form/...)
│   │   ├── map/              # Screen map metadata (screens.ts, nodes/panels)
│   │   └── spec/             # Spec viewer page
│   ├── data/
│   │   └── requirements.ts   # Spec registry — maps spec IDs to pages and filenames
│   ├── components/           # Shared UI building blocks
│   └── lib/                  # Helpers/constants used by prototype pages
├── public/
│   └── requirements/         # Spec markdown files ({ID}.md, e.g. A-01.md, Y-01.md)
├── package.json
└── vite.config.ts
```

---

### Spec Registry — `src/data/requirements.ts`

This TypeScript file is the **canonical source of truth** for spec ID → page slug → spec file mapping.  
Always read it first when resolving spec IDs or keywords.

```bash
git -C .cache/fitness-crm-ui show HEAD:src/data/requirements.ts
```

Key types from this file:

- `RequirementDoc` — top-level category doc (id, title, shortTitle, version, status, relatedPages, screens)
- `ScreenMapping` — one screen entry (id, name, level, pages[], fileName)

**Quick ID → File lookup table** (derived from `requirements.ts` at last sync):

| ID   | 機能名                     | Label (EN)                       | Spec File                     |
| ---- | -------------------------- | -------------------------------- | ----------------------------- |
| A-01 | 会員管理（一覧）           | Member Management (List)         | `public/requirements/A-01.md` |
| A-02 | 移籍管理一覧               | Transfer Management (List)       | `public/requirements/A-02.md` |
| A-03 | 休会・退会管理一覧         | Leave & Withdrawal (List)        | `public/requirements/A-03.md` |
| B-01 | 入退館管理                 | Entry/Exit Management            | `public/requirements/B-01.md` |
| C-01 | 入会申請管理               | Enrollment Application           | `public/requirements/C-01.md` |
| D-01 | レッスン管理               | Lesson Management                | `public/requirements/D-01.md` |
| D-02 | レッスン内容管理           | Lesson Content Management        | `public/requirements/D-02.md` |
| D-03 | スタジオ管理               | Studio Management                | `public/requirements/D-03.md` |
| D-04 | 指導者管理                 | Instructor Management            | `public/requirements/D-04.md` |
| E-01 | ロッカー管理               | Locker Management                | `public/requirements/E-01.md` |
| E-02 | 店舗機器管理               | Store Equipment Management       | `public/requirements/E-02.md` |
| E-03 | トレーニング機材管理       | Training Equipment Management    | `public/requirements/E-03.md` |
| F-01 | 売上管理                   | Sales Management                 | `public/requirements/F-01.md` |
| G-01 | 主契約管理                 | Primary Contract Management      | `public/requirements/G-01.md` |
| G-02 | オプション管理             | Option Management                | `public/requirements/G-02.md` |
| G-03 | キャンペーン管理           | Campaign Management              | `public/requirements/G-03.md` |
| G-04 | アンケート管理             | Survey Management                | `public/requirements/G-04.md` |
| G-05 | 入会金管理                 | Enrollment Fee Management        | `public/requirements/G-05.md` |
| G-06 | プロモーションコード管理   | Promotion Code Management        | `public/requirements/G-06.md` |
| I-01 | 店舗ページ管理             | Store Page Management            | `public/requirements/I-01.md` |
| I-02 | 告知・ブログ管理           | Notice & Blog Management         | `public/requirements/I-02.md` |
| I-03 | 通知管理                   | Notification Management          | `public/requirements/I-03.md` |
| X-01 | 分析・レポート             | Analytics & Reports              | `public/requirements/X-01.md` |
| Y-01 | スタッフ・権限管理         | Staff & Permission Management    | `public/requirements/Y-01.md` |
| Y-02 | 店舗管理（マスタ）         | Store Master Management          | `public/requirements/Y-02.md` |
| Y-03 | FC企業管理（マスタ）       | FC Company Master Management     | `public/requirements/Y-03.md` |
| Y-04 | 規約文書管理（マスタ）     | Terms Document Master Management | `public/requirements/Y-04.md` |
| Y-05 | アプリ配信バージョン管理   | App Release Version Management   | `public/requirements/Y-05.md` |
| Y-06 | アプリメンテナンス管理     | App Maintenance Management       | `public/requirements/Y-06.md` |
| Y-07 | ブランド管理（マスタ）     | Brand Master Management          | `public/requirements/Y-07.md` |
| Y-08 | エクササイズ管理（マスタ） | Exercise Master Management       | `public/requirements/Y-08.md` |
| Y-09 | ルーティン管理（マスタ）   | Routine Master Management        | `public/requirements/Y-09.md` |
| Y-10 | CRMメンテナンス管理        | CRM Maintenance Management       | `public/requirements/Y-10.md` |
| Y-11 | 称号管理                   | Title Management                 | `public/requirements/Y-11.md` |
| Y-12 | 認証・ログイン             | Auth / Login                     | `public/requirements/Y-12.md` |
| Y-13 | ドメイン管理（マスタ）     | Domain Master Management         | `public/requirements/Y-13.md` |
| Y-14 | パスワードリセット         | Password Reset                   | `public/requirements/Y-14.md` |
| Z-00 | 認証フロー全体（俯瞰）     | Auth Flow Overview               | `public/requirements/Z-00.md` |

**Common sections inside a spec markdown file**:

- メタ情報 (Meta) — ID, name, status, last updated
- ブランド適応範囲 — which brands (JOYFIT / FIT365) the feature applies to
- 概要 / 機能の目的 — Purpose and scope
- 機能要件 — Functional requirements (FR-XXXX rows)
- 画面定義 — Screen definitions (fields, layout, validations)
- ステータス遷移 — Status transitions (if applicable)
- 備考・未解決事項 — Open questions / remarks

---

### UI Page Registry — `src/pages/`

**File naming pattern**: `{feature-slug}-{view-type}.tsx`

- Common view types: `list`, `detail`, `form`, `schedule`, `analytics`, `responses`
- Examples: `member-list.tsx`, `lesson-schedule-form.tsx`

Use this registry as the first lookup source when resolving a UI slug:

```text
analytics-report.tsx
analytics-report/global-filter-bar.tsx
analytics-report/single-store-view.tsx
announcement-detail.tsx
announcement-form.tsx
announcement-list.tsx
app-maintenance-form.tsx
app-maintenance-list.tsx
app-management.tsx
app-version-detail.tsx
app-version-form.tsx
article-category-form.tsx
article-category-list.tsx
auto-layout-test.tsx
banner-form.tsx
banner-list.tsx
blacklist-detail.tsx
blacklist-list.tsx
blog-detail.tsx
blog-form.tsx
blog-list.tsx
brand-list.tsx
campaign-detail.tsx
campaign-form.tsx
campaign-list.tsx
contract-bulk-change.tsx
contract-detail.tsx
contract-form.tsx
contract-list.tsx
controller-detail.tsx
controller-form.tsx
controller-list.tsx
crm-maintenance-detail.tsx
crm-maintenance-list.tsx
dashboard.tsx
domain-list.tsx
emergency-suspension.tsx
enrollment-application-detail.tsx
enrollment-application-form.tsx
enrollment-application-list.tsx
enrollment-fee-detail.tsx
enrollment-fee-form.tsx
enrollment-fee.tsx
entry-exit-history.tsx
entry-exit.tsx
equipment-detail.tsx
equipment-form.tsx
equipment-list.tsx
exercise-detail.tsx
exercise-form.tsx
exercise-list.tsx
fc-company-detail.tsx
fc-company-form.tsx
fc-company-list.tsx
figma-sizing-test.tsx
first-time-password-set.tsx
global-search.tsx
initial-setup.tsx
leave-detail.tsx
leave-list.tsx
lesson-detail.tsx
lesson-form.tsx
lesson-instructor.tsx
lesson-reservation.tsx
lesson-schedule-form.tsx
lesson-schedule.tsx
lesson-studio.tsx
lesson.tsx
locker-contract-detail.tsx
locker-contract-form.tsx
locker-detail.tsx
locker-form.tsx
locker-list.tsx
login-initial-expired.tsx
login-initial-success.tsx
login-initial.tsx
login.tsx
maintenance-form.tsx
manual-notification-detail.tsx
manual-notification-form.tsx
manual-notification-list.tsx
map/map-page.tsx
map/screen-node.tsx
map/screen-panel.tsx
map/screens.ts
member-detail.tsx
member-form.tsx
member-list.tsx
notification-default-settings.tsx
notification-history.tsx
notification-setting-detail.tsx
notification-settings.tsx
notification-store-settings.tsx
notification-template-form.tsx
notification-template-list.tsx
option-detail.tsx
option-form.tsx
option-list.tsx
password-reset.tsx
password-set.tsx
position-form.tsx
position-list.tsx
product-settings.tsx
proto-nav.tsx
routine-detail.tsx
routine-form.tsx
routine-list.tsx
sales-accounting-export.tsx
sales-detail.tsx
sales-receivable-list.tsx
sales-refund-list.tsx
sales-register.tsx
sales-transaction-list.tsx
sales.tsx
set-discount-detail.tsx
set-discount-form.tsx
set-discount.tsx
shared-header.tsx
shared-sidebar.tsx
spec-viewer.tsx
spec/spec-page.tsx
staff-detail.tsx
staff-form.tsx
staff-list.tsx
store-detail.tsx
store-form.tsx
store-list.tsx
store-map-setup.tsx
store-page-form.tsx
store-page-list.tsx
survey-analytics.tsx
survey-detail.tsx
survey-form.tsx
survey-list.tsx
survey-response-detail.tsx
survey-responses.tsx
terms-detail.tsx
terms-form.tsx
terms-list.tsx
training-equipment-detail.tsx
training-equipment-form.tsx
training-equipment-list.tsx
transfer-detail.tsx
transfer-list.tsx
visit-experience-detail.tsx
visit-experience-list.tsx
```

#### UI Map Metadata — `src/pages/map/`

```text
map-page.tsx
screen-node.tsx
screen-panel.tsx
screens.ts
```

The TSX files are **prototype pages** — they contain complete component trees with shadcn/Radix imports, mock data, and layout. Treat them as authoritative UI sources (equivalent to wireframes).

---

## Execution Steps

### 0. Freshness Check

Before reading any files, verify the git repo is reachable and update the local cache:

```bash
git -C .cache/fitness-crm-ui log --oneline -1
```

If the command fails or the cache is missing, initialize it:

```bash
git clone git@github.com:dx-fitness/fitness-crm-ui.git .cache/fitness-crm-ui
```

Otherwise fetch and detach to the latest snapshot:

```bash
git -C .cache/fitness-crm-ui fetch --all --prune
git -C .cache/fitness-crm-ui checkout --detach origin/main
```

Output the commit hash and date. If unreachable, warn:

```
⚠️  Remote git repo is not accessible or local cache init failed.
Check network/authentication and run:
git clone git@github.com:dx-fitness/fitness-crm-ui.git .cache/fitness-crm-ui
```

Always read from the latest fetched remote snapshot. Do not depend on local copies outside the cache dir.

---

### 1. Resolve input to candidate file paths

**If input is a spec ID** (matches pattern `^[A-Z]+-?\d+$`):

- Normalize: uppercase with zero-padded number (e.g., `a-2` → `A-02`)
- Look up the ID in the **Quick ID → File lookup table** above
- If not found in the table, read `src/data/requirements.ts` from the repo and scan for the ID:
  ```bash
  git -C .cache/fitness-crm-ui show HEAD:src/data/requirements.ts
  ```
- As last resort, probe the directory:
  ```bash
  git -C .cache/fitness-crm-ui ls-files public/requirements/
  ```

**If input is a keyword / page name**:

- First check if it matches a known UI page slug directly (from the UI Page Registry above)
- Then search the spec files using git grep:
  ```bash
  git -C .cache/fitness-crm-ui grep -il "<keyword>" -- "public/requirements/*.md"
  ```
- Also search `src/data/requirements.ts` for the keyword in titles/screen names
- Limit to 3 best-matching spec files; prefer title-line matches over body matches

**If `--ui-only` flag present**: skip spec file reading entirely  
**If `--spec-only` flag present**: skip UI page reading entirely

---

### 2. Read the spec file(s)

**All reads via git — never local filesystem.** For each matched spec file:

```bash
git -C .cache/fitness-crm-ui show HEAD:public/requirements/<ID>.md
# e.g.
git -C .cache/fitness-crm-ui show HEAD:public/requirements/A-02.md
```

Also read the registry entry from `src/data/requirements.ts` for the matched category to get the `screens[]` list and `relatedPages` mapping.

Extract and output:

- **Meta block** — ID, name, status, last updated, brand scope
- **Purpose** — 機能の目的 section (2–5 sentences)
- **Functional requirements table** — all FR rows with ID, description, priority
- **Screen definitions** — field lists, validations, status transitions
- **Screen → page mapping** — from `screens[].pages` in `requirements.ts` (which UI slugs map to this spec ID)
- **Open questions** — 備考・未解決事項 section

---

### 3. Resolve the matching UI file(s)

**Mapping spec ID → UI page slug** — use `screens[].pages` from `src/data/requirements.ts` (already read in step 2). Falls back to the category hint table below if the lookup yields no result:

| Spec category | Typical UI page slug pattern                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| A             | `member-*`, `transfer-*`, `leave-*`, `blacklist-*`                                                         |
| B             | `entry-exit*`                                                                                              |
| C             | `enrollment-application-*`                                                                                 |
| D             | `lesson-*`                                                                                                 |
| E             | `locker-*`, `equipment-*`, `controller-*`, `training-equipment-*`                                          |
| F             | `sales-*`                                                                                                  |
| G             | `contract-*`, `option-*`, `set-discount*`, `campaign-*`, `survey-*`                                        |
| I             | `store-page-*`, `announcement-*`, `blog-*`, `notification-*`, `banner-*`                                   |
| X             | `analytics-*`                                                                                              |
| Y             | `staff-*`, `store-*`, `fc-company-*`, `terms-*`, `app-*`, `brand-*`, `exercise-*`, `routine-*`, `domain-*` |
| Z             | `login*`, `password-*`, `first-time-password-set*`                                                         |

If still ambiguous, read `src/pages/map/screens.ts` via git:

```bash
git -C .cache/fitness-crm-ui show HEAD:src/pages/map/screens.ts
```

**All reads via git — never local filesystem.** For each matched UI file:

```bash
git -C .cache/fitness-crm-ui show HEAD:src/pages/<slug>.tsx
# e.g.
git -C .cache/fitness-crm-ui show HEAD:src/pages/transfer-list.tsx
```

Extract and output:

- **Imports** — component inventory (which shadcn/Radix/lucide components are used)
- **Page structure** — top-level layout regions identified from the JSX tree
- **Key components per region** — list with props/variants visible in code
- **Dialog/overlay components** — all `<Dialog>`, `<AlertDialog>`, `<Sheet>`, etc. with their trigger, title, body, and footer
- **State variables** — `useState` hooks (tells us what data/UI state the page manages)
- **Mock data shape** — any `const mockXxx` arrays/objects (describes expected data model)

---

### 4. Output the structured context block

Emit the result in the following format so that consuming agents can parse it cleanly:

```markdown
---
## External Context: {SPEC_ID or KEYWORD}
**Source**: `dx-fitness/fitness-crm-ui` (single repo — spec + UI)
**Loaded at**: {TIMESTAMP}
**Repo commit**: {HASH} {DATE}
---

### Spec: {SPEC_ID} — {機能名}

**Status**: {ステータス}  
**Brands**: {JOYFIT / FIT365 / both}  
**Last updated**: {日付}  
**Spec file**: `public/requirements/{ID}.md`  
**Related UI pages**: {pages from requirements.ts screens[].pages}

#### Purpose

{2–5 sentence summary of 機能の目的}

#### Functional Requirements

| FR ID   | Requirement   | Priority |
| ------- | ------------- | -------- |
| FR-XXXX | {description} | Must     |
| …       | …             | …        |

#### Screen Definitions

{extracted field lists, validations, status flows}

#### Open Questions

{備考・未解決事項 content, if any}

---

### UI Mockup: {page-slug}.tsx

#### Component Inventory

{list of imported components}

#### Page Structure

{identified regions and their layout wrappers}

#### Key Components by Region

**{Region Name}**

| Element        | Component     | Variant / Props          | Notes      |
| -------------- | ------------- | ------------------------ | ---------- |
| {element name} | `<Component>` | `variant="…"` `size="…"` | {position} |
| …              | …             | …                        | …          |

#### Dialogs & Overlays

| Dialog Name | Trigger | Title | Body Summary | Footer Actions |
| ----------- | ------- | ----- | ------------ | -------------- |
| …           | …       | …     | …            | …              |

#### Page State

{useState variables — what data is managed}

#### Mock Data Shape

{shape of mock data arrays/objects found in the file}
```

---

## Error Handling

| Situation                             | Action                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------ |
| Spec file not found for given ID      | List all available IDs via `git ls-files public/requirements/`           |
| No UI file matches the spec           | Output spec context only; note "No matching UI page found"               |
| Remote repo/cache unavailable         | Warn user to verify git auth/network and initialize cache dir            |
| Multiple spec files match keyword     | List candidates and ask user to confirm which to load                    |
| Spec file is very large (> 500 lines) | Read in sections; prioritize FR table and screen definitions             |
| `requirements.ts` parse fails         | Fall back to category hint table and `git ls-files public/requirements/` |

---

## Usage Examples

```
/speckit.load-external A-02
/speckit.load-external Y-01 --spec-only
/speckit.load-external transfer-list --ui-only
/speckit.load-external "移籍管理"
/speckit.load-external staff-list
```
