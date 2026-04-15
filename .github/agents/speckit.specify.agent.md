---
description: Create or update the feature specification from a natural language feature description.
handoffs:
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
  - label: Clarify Spec Requirements
    agent: speckit.clarify
    prompt: Clarify specification requirements
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Pre-Execution Checks

**Check for extension hooks (before specification)**:

- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_specify` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):

    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```

  - **Mandatory hook** (`optional: false`):

    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Outline.
    ```

- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Outline

The text the user typed after `/speckit.specify` in the triggering message **is** the feature description. Assume you always have it available in this conversation even if `$ARGUMENTS` appears literally below. Do not ask the user to repeat it unless they provided an empty command.

Given that feature description, do this:

1. **Determine branch type and generate a slug**:

   **Branch type** — infer from the feature description:
   - Use `feat/` prefix for new features, enhancements, or additions
   - Use `fix/` prefix for bug fixes, regressions, or corrections
   - Examples:
     - "Add member search filter" → `feat/member-search-filter`
     - "Fix rendering of member name on detail page" → `fix/render-member-name`
     - "Implement OAuth2 login" → `feat/oauth2-login`
     - "Fix payment timeout bug" → `fix/payment-timeout`

   **Slug rules** — the part after `feat/` or `fix/`:
   - 2–5 words, all lowercase, hyphen-separated
   - Preserve technical acronyms (OAuth2, API, JWT, QR, etc.)
   - No special characters other than hyphens
   - Final branch name format: `feat/<slug>` or `fix/<slug>`

2. **Checkout the base branch before creating the feature branch**:

   **Determine base branch**:
   - If the user explicitly named a base branch in their prompt (e.g., "branch off `dev`", "base: `QA`"), use that branch name.
   - If no base branch is specified, use `dev` as the default.

   Run the checkout command first:

   ```bash
   git checkout <base-branch>
   ```

   If the checkout fails (branch does not exist locally), try fetching first:

   ```bash
   git fetch origin <base-branch> && git checkout <base-branch>
   ```

   If it still fails, stop and report the error to the user — do **not** proceed with branch creation from an unknown base.

2.5. **Create the feature branch** by running the script with `--short-name` (and `--json`). The `--short-name` value MUST be the full branch name including the `feat/` or `fix/` prefix determined in step 1.

**Branch numbering mode**: Before running the script, check if `.specify/init-options.json` exists and read the `branch_numbering` value.

- If `"timestamp"`, add `--timestamp` (Bash) or `-Timestamp` (PowerShell) to the script invocation
- If `"sequential"` or absent, do not add any extra flag (default behavior)

- Bash example: `.specify/scripts/bash/create-new-feature.sh "$ARGUMENTS" --json --short-name "feat/member-search-filter" "Add member search filter"`
- Bash (timestamp): `.specify/scripts/bash/create-new-feature.sh "$ARGUMENTS" --json --timestamp --short-name "feat/member-search-filter" "Add member search filter"`
- PowerShell example: `.specify/scripts/bash/create-new-feature.sh "$ARGUMENTS" -Json -ShortName "feat/member-search-filter" "Add member search filter"`
- PowerShell (timestamp): `.specify/scripts/bash/create-new-feature.sh "$ARGUMENTS" -Json -Timestamp -ShortName "feat/member-search-filter" "Add member search filter"`

**IMPORTANT**:

- Do NOT pass `--number` — the script determines the correct next number automatically
- Always include the JSON flag (`--json` for Bash, `-Json` for PowerShell) so the output can be parsed reliably
- You must only ever run this script once per feature
- The JSON is provided in the terminal as output - always refer to it to get the actual content you're looking for
- The JSON output will contain BRANCH_NAME and SPEC_FILE paths
- For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot")

3. Load `.specify/templates/spec-template.md` to understand required sections.

3.5. **Load Steering context** — Before writing any spec content, read the following steering files to understand the system domain, terminology, and existing module boundaries. Use this context throughout all subsequent steps to ensure the spec is consistent with the rest of the system.

Files to read (all under `docs/steering/`):

- `docs/steering/_index.md` — module registry and category overview
- `docs/steering/architecture.md` — tech stack, folder structure, API design patterns
- `docs/steering/business-flows.md` — end-to-end business flows and actor interactions
- `docs/steering/business-glossary.md` — canonical business term definitions
- `docs/steering/user-personas.md` — user types and their goalsWhile reading, identify:

- **Which module category** (A–Z) the new feature belongs to, if any
- **Related modules** that may be affected or referenced by this spec
- **Business terms** already defined in the glossary that apply to this feature — use exact glossary terms in the spec (do not invent synonyms)
- **Actors** from `user-personas.md` who interact with this feature
- **Existing flows** in `business-flows.md` that this feature extends or modifies

If any steering file does not exist, skip it silently and continue.

4. **Detect UI screenshots**: Check whether the user attached one or more images (wireframes / mockups / screenshots) to this message.
   - **If images are present**: set `HAS_WIREFRAME = true` — the spec MUST include a completed `UI Specification` section (see step 4.9 below)
   - **If no images**: set `HAS_WIREFRAME = false` — omit the `UI Specification` section entirely from the spec

5. Follow this execution flow:
   1. Parse user description from Input
      If empty: ERROR "No feature description provided"
   2. Extract key concepts from description
      Identify: actors, actions, data, constraints
   3. For unclear aspects:
      - Make informed guesses based on context and industry standards
      - Only mark with [NEEDS CLARIFICATION: specific question] if:
        - The choice significantly impacts feature scope or user experience
        - Multiple reasonable interpretations exist with different implications
        - No reasonable default exists
      - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
      - Prioritize clarifications by impact: scope > security/privacy > user experience > technical details
   4. Fill User Scenarios & Testing section
      If no clear user flow: ERROR "Cannot determine user scenarios"
   5. Generate Functional Requirements
      Each requirement must be testable
      Use reasonable defaults for unspecified details (document assumptions in Assumptions section)
   6. Define Success Criteria
      Create measurable, technology-agnostic outcomes
      Include both quantitative metrics (time, performance, volume) and qualitative measures (user satisfaction, task completion)
      Each criterion must be verifiable without implementation details
   7. Identify Key Entities (if data involved)
   8. Return: SUCCESS (spec ready for planning)
   9. **[Only when HAS_WIREFRAME = true] Analyse attached wireframes and populate UI Specification** — see detailed rules in the [UI Screenshot Analysis](#ui-screenshot-analysis) section below

6. Write the specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the feature description (arguments) while preserving section order and headings.
   - If `HAS_WIREFRAME = true`: include a fully populated `UI Specification` section (placed just before `Assumptions`)
   - If `HAS_WIREFRAME = false`: omit the `UI Specification` section entirely

6.5. **Update Steering** — After writing the spec, determine whether any steering file needs to be updated to reflect new or changed domain knowledge introduced by this spec. Apply updates directly; do not ask for permission.

**When to update each file**:

| Steering File          | Update if…                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `_index.md`            | A new module/screen is introduced that does not yet appear in the Module Index table                         |
| `business-glossary.md` | The spec introduces new business terms, actors, or domain concepts not yet defined in the glossary           |
| `business-flows.md`    | The spec adds or materially changes an end-to-end business flow, or introduces a new flow not yet documented |
| `architecture.md`      | The spec introduces a new technical pattern, integration, or structural convention not yet described         |
| `user-personas.md`     | The spec introduces a new user type/actor or significantly extends an existing persona's responsibilities    |

**Update rules**:

- **Additive only**: only append new rows, sections, or bullet points. Do **not** remove or rewrite existing steering content.
- **`_index.md` Module Index**: add one row per new module using the existing table format:
  `| [Category] | [ID] | [Module Name] | \`docs/specs/[feature-dir]/spec.md\` | In Progress |`
- **`business-glossary.md`**: add new terms to the most appropriate existing section table. If no section fits, append a new section at the bottom before the `*Last updated*` line.
- **`business-flows.md`**: if a new flow is needed, append it as a new numbered subsection under `## 4. Key Business Flows`.
- **Always update** the `*Last updated*` date at the bottom of any file you modify (ISO date: `April 2026` format).
- **Do not update** a steering file if the spec contains only implementation details with no new business/domain knowledge.

After updating, list each file modified and the specific change made (one line per file).

7. **Specification Quality Validation**: After writing the initial spec, validate it against quality criteria:

   a. **Create Spec Quality Checklist**: Generate a checklist file at `FEATURE_DIR/checklists/requirements.md` using the checklist template structure with these validation items:

   ```markdown
   # Specification Quality Checklist: [FEATURE NAME]

   **Purpose**: Validate specification completeness and quality before proceeding to planning
   **Created**: [DATE]
   **Feature**: [Link to spec.md]

   ## Content Quality

   - [ ] No implementation details (languages, frameworks, APIs)
   - [ ] Focused on user value and business needs
   - [ ] Written for non-technical stakeholders
   - [ ] All mandatory sections completed

   ## Requirement Completeness

   - [ ] No [NEEDS CLARIFICATION] markers remain
   - [ ] Requirements are testable and unambiguous
   - [ ] Success criteria are measurable
   - [ ] Success criteria are technology-agnostic (no implementation details)
   - [ ] All acceptance scenarios are defined
   - [ ] Edge cases are identified
   - [ ] Scope is clearly bounded
   - [ ] Dependencies and assumptions identified

   ## UI Specification (skip if no wireframe was provided)

   - [ ] UI Specification section present in spec (required when wireframe attached)
   - [ ] Every visible UI region has a corresponding sub-section
   - [ ] All component cells reference a component from src/components/ui/ or src/components/common/
   - [ ] Variant/Props column specifies exact shadcn variant string (e.g., `variant="destructive"`)
   - [ ] Layout wrapper classes described (flex, grid, gap-\*, etc.)
   - [ ] All dialogs/overlays listed with trigger, title, body, and footer actions
   - [ ] No implementation code (JSX/HTML) — descriptions only

   ## Feature Readiness

   - [ ] All functional requirements have clear acceptance criteria
   - [ ] User scenarios cover primary flows
   - [ ] Feature meets measurable outcomes defined in Success Criteria
   - [ ] No implementation details leak into specification

   ## Notes

   - Items marked incomplete require spec updates before `/speckit.clarify` or `/speckit.plan`
   ```

   b. **Run Validation Check**: Review the spec against each checklist item:
   - For each item, determine if it passes or fails
   - Document specific issues found (quote relevant spec sections)

   c. **Handle Validation Results**:
   - **If all items pass**: Mark checklist complete and proceed to step 7

   - **If items fail (excluding [NEEDS CLARIFICATION])**:
     1. List the failing items and specific issues
     2. Update the spec to address each issue
     3. Re-run validation until all items pass (max 3 iterations)
     4. If still failing after 3 iterations, document remaining issues in checklist notes and warn user

   - **If [NEEDS CLARIFICATION] markers remain**:
     1. Extract all [NEEDS CLARIFICATION: ...] markers from the spec
     2. **LIMIT CHECK**: If more than 3 markers exist, keep only the 3 most critical (by scope/security/UX impact) and make informed guesses for the rest
     3. For each clarification needed (max 3), present options to user in this format:

        ```markdown
        ## Question [N]: [Topic]

        **Context**: [Quote relevant spec section]

        **What we need to know**: [Specific question from NEEDS CLARIFICATION marker]

        **Suggested Answers**:

        | Option | Answer                    | Implications                          |
        | ------ | ------------------------- | ------------------------------------- |
        | A      | [First suggested answer]  | [What this means for the feature]     |
        | B      | [Second suggested answer] | [What this means for the feature]     |
        | C      | [Third suggested answer]  | [What this means for the feature]     |
        | Custom | Provide your own answer   | [Explain how to provide custom input] |

        **Your choice**: _[Wait for user response]_
        ```

     4. **CRITICAL - Table Formatting**: Ensure markdown tables are properly formatted:
        - Use consistent spacing with pipes aligned
        - Each cell should have spaces around content: `| Content |` not `|Content|`
        - Header separator must have at least 3 dashes: `|--------|`
        - Test that the table renders correctly in markdown preview
     5. Number questions sequentially (Q1, Q2, Q3 - max 3 total)
     6. Present all questions together before waiting for responses
     7. Wait for user to respond with their choices for all questions (e.g., "Q1: A, Q2: Custom - [details], Q3: B")
     8. Update the spec by replacing each [NEEDS CLARIFICATION] marker with the user's selected or provided answer
     9. Re-run validation after all clarifications are resolved

   d. **Update Checklist**: After each validation iteration, update the checklist file with current pass/fail status

8. Report completion with branch name, spec file path, checklist results, and readiness for the next phase (`/speckit.clarify` or `/speckit.plan`).

9. **Check for extension hooks**: After reporting completion, check if `.specify/extensions.yml` exists in the project root.
   - If it exists, read it and look for entries under the `hooks.after_specify` key
   - If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
   - Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
   - For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
     - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
     - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
   - For each executable hook, output the following based on its `optional` flag:
     - **Optional hook** (`optional: true`):

       ```
       ## Extension Hooks

       **Optional Hook**: {extension}
       Command: `/{command}`
       Description: {description}

       Prompt: {prompt}
       To execute: `/{command}`
       ```

     - **Mandatory hook** (`optional: false`):

       ```
       ## Extension Hooks

       **Automatic Hook**: {extension}
       Executing: `/{command}`
       EXECUTE_COMMAND: {command}
       ```

   - If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

**NOTE:** The script creates and checks out the new branch and initializes the spec file before writing.

---

## UI Screenshot Analysis

> **Triggered only when `HAS_WIREFRAME = true`** — i.e., the user attached one or more images.

### Goal

Translate visual wireframe information into a deterministic, code-ready UI specification so that the implementer can reproduce the layout and component choices faithfully using shadcn/Radix UI primitives — without re-interpreting the design.

### Allowed Component Inventory

Only reference components that exist in the project. Before analysing, mentally load the following sources:

- `src/components/ui/` — shadcn primitives (Button, Badge, Input, Select, Dialog, AlertDialog, Table, etc.)
- `src/components/common/` — composite components (DataTable, BreadcrumbNav, DataStateBoundary, etc.)
- Tailwind CSS v4 utility classes for layout

If a visual element has no matching primitive, describe it as "custom component — suggest adding to `src/components/ui/`".

### Analysis Steps

For each attached screenshot/wireframe:

1. **Identify regions** — divide the screen into named regions (e.g., "Page Header", "Filter Bar", "Data Table", "Empty State", "Delete Dialog"). Use the visual hierarchy.

2. **For each region, enumerate elements** and for every element record:
   - **Element** — plain name (e.g., "Search input", "Status badge", "Delete button")
   - **Component** — exact component name with backtick-code formatting (e.g., `<Input>`, `<Badge>`, `<Button>`)
   - **Variant / Props** — exact shadcn variant string and notable props visible or inferable from the wireframe:
     - Buttons: `variant="default|secondary|destructive|outline|ghost|link"` + `size="default|sm|lg|icon"`
     - Badges: `variant="default|secondary|destructive|outline"` + any overriding `className` (e.g., `"bg-green-500 text-white"`)
     - Inputs: `placeholder="…"` text, presence of prefix/suffix icons
     - Selects / Comboboxes: whether it is a `<Select>` (few fixed options) or `<Combobox>` (searchable)
     - Dialogs: `<Dialog>` (form/informational) vs `<AlertDialog>` (destructive confirmation)
   - **Notes** — position (left/right/center), alignment cues, approximate width hint (e.g., `w-full`, `w-64`), or any conditional rendering visible

3. **Describe layout wrappers** for each region — use Tailwind layout classes only:
   - Flex / grid arrangement, gap, alignment, padding
   - Example: `flex items-center justify-between gap-4 px-6 py-4`

4. **Identify overlays** — list every Dialog, AlertDialog, Sheet, Drawer, Popover, or Tooltip visible or implied by the wireframe. For each specify:
   - **Trigger**: what opens it (button label + variant)
   - **Title**: heading text
   - **Body**: form fields, select lists, descriptions, warnings
   - **Footer actions**: button labels + variants, left-to-right order

5. **Infer missing details** conservatively — if a prop is not visible, use the shadcn default (e.g., `variant="default"`, `size="default"`). Do **not** invent custom variants that don't exist in the project.

6. **Flag ambiguous elements** — if a UI element is too small or unclear to identify confidently, add a note: `[VISUAL UNCLEAR: brief description]`. Limit to 3 flags maximum.

### Output Format

Populate the `## UI Specification` section in the spec file following the template's table structure. Use one sub-section per identified region. Example:

```markdown
## UI Specification

### Page Layout

Overall wrapper: `flex flex-col gap-6 p-6`. Page is divided into three vertical stacks:

1. Header row (title + action button)
2. Filter bar
3. Data table with pagination

### Header Row

| Element         | Component  | Variant / Props                 | Notes                           |
| --------------- | ---------- | ------------------------------- | ------------------------------- |
| Page title      | `<h1>`     | `text-2xl font-semibold`        | Left side                       |
| "Invite" button | `<Button>` | `variant="default"` `size="sm"` | Right side, opens Invite Dialog |

### Filter Bar

Layout: `flex items-center gap-3 flex-wrap`

| Element       | Component  | Variant / Props                                  | Notes                          |
| ------------- | ---------- | ------------------------------------------------ | ------------------------------ |
| Search input  | `<Input>`  | `placeholder="名前で検索…"` + search icon prefix | Grows to fill space (`flex-1`) |
| Status filter | `<Select>` | Placeholder "ステータス"                         | Fixed width `w-40`             |
| Clear button  | `<Button>` | `variant="ghost"` `size="sm"`                    | Shown only when filters active |

### Dialog / Overlay Components

| Dialog       | Trigger                                  | Title            | Body Summary                              | Footer Actions                                        |
| ------------ | ---------------------------------------- | ---------------- | ----------------------------------------- | ----------------------------------------------------- |
| Invite staff | Header "Invite" button                   | "スタッフ招待"   | Email input + Role select + Branch select | "キャンセル" (`ghost`) · "招待する" (`default`)       |
| Delete staff | Row action "削除" button (`destructive`) | "スタッフを削除" | Warning text + Reason `<Select>`          | "キャンセル" (`outline`) · "削除する" (`destructive`) |
```

### Rules & Constraints

- **No JSX / HTML code** — use component names in backtick notation only
- **No `variant="success"`** — use `variant="default" className="bg-green-500 text-white"` (project constraint)
- **Dialog vs AlertDialog**: use `<AlertDialog>` for destructive/irreversible actions; `<Dialog>` for all others
- **Select vs Combobox**: use `<Select>` when options are ≤ ~10 fixed items; use `<Combobox>` when the list is long or searchable
- **DataTable**: always `variant="simple"` for page-based pagination; `variant="default"` for infinite scroll
- **Keep descriptions scannable** — one row per element; avoid paragraph prose in table cells

---

## Quick Guidelines

- Focus on **WHAT** users need and **WHY**.
- Avoid HOW to implement (no tech stack, APIs, code structure).
- Written for business stakeholders, not developers.
- DO NOT create any checklists that are embedded in the spec. That will be a separate command.

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Make informed guesses**: Use context, industry standards, and common patterns to fill gaps
2. **Document assumptions**: Record reasonable defaults in the Assumptions section
3. **Limit clarifications**: Maximum 3 [NEEDS CLARIFICATION] markers - use only for critical decisions that:
   - Significantly impact feature scope or user experience
   - Have multiple reasonable interpretations with different implications
   - Lack any reasonable default
4. **Prioritize clarifications**: scope > security/privacy > user experience > technical details
5. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
6. **Common areas needing clarification** (only if no reasonable default exists):
   - Feature scope and boundaries (include/exclude specific use cases)
   - User types and permissions (if multiple conflicting interpretations possible)
   - Security/compliance requirements (when legally/financially significant)

**Examples of reasonable defaults** (don't ask about these):

- Data retention: Industry-standard practices for the domain
- Performance targets: Standard web/mobile app expectations unless specified
- Error handling: User-friendly messages with appropriate fallbacks
- Authentication method: Standard session-based or OAuth2 for web apps
- Integration patterns: Use project-appropriate patterns (REST/GraphQL for web services, function calls for libraries, CLI args for tools, etc.)

### Success Criteria Guidelines

Success criteria must be:

1. **Measurable**: Include specific metrics (time, percentage, count, rate)
2. **Technology-agnostic**: No mention of frameworks, languages, databases, or tools
3. **User-focused**: Describe outcomes from user/business perspective, not system internals
4. **Verifiable**: Can be tested/validated without knowing implementation details

**Good examples**:

- "Users can complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"
- "Task completion rate improves by 40%"

**Bad examples** (implementation-focused):

- "API response time is under 200ms" (too technical, use "Users see results instantly")
- "Database can handle 1000 TPS" (implementation detail, use user-facing metric)
- "React components render efficiently" (framework-specific)
- "Redis cache hit rate above 80%" (technology-specific)
