# Fitness CRM Business Flows

> Change frequency: Medium (update when adding new features or modifying flows)
> Last updated: April 2026
>
> This document describes the end-to-end business flows of the Fitness CRM system.
> See `requirements/` folder for detailed specifications of each module.

---

## 1. Product Overview

Fitness CRM is a **member management platform** for fitness gym operations.

The platform serves two fitness brands under the Wellness Company:

- **JOYFIT** — Full-service fitness club with studio lessons
- **FIT365** — 24/7 fitness gym with self-service focus

### Product Vision: "Move to Happy"

The system is designed to achieve happiness for three stakeholders:

| Stakeholder     | "Happy" Definition                                                     |
| --------------- | ---------------------------------------------------------------------- |
| **Members**     | Convenient, intuitive UI/UX for gym usage                              |
| **Store Staff** | Liberation from administrative tasks, more time for member interaction |
| **Operations**  | Clear visibility into business metrics and operations                  |

---

## 2. System Actors

### Internal Users (CRM)

| Actor           | Japanese     | Description             | Primary Functions                          |
| --------------- | ------------ | ----------------------- | ------------------------------------------ |
| **System**      | システム     | Automated processes     | Batch jobs, auto-withdrawal, notifications |
| **Headquarter** | 本部         | Corporate staff         | Full access, master data, analytics        |
| **Manager**     | マネージャー | Area/territory managers | Multi-store management                     |
| **Staff**       | 店舗スタッフ | Store employees         | Daily operations, member support           |
| **Trainer**     | トレーナー   | Instructors/trainers    | Lesson management only                     |
| **Observer**    | 閲覧のみ     | Read-only users         | View access only                           |

### External Users (Mobile App)

| Actor              | Description                             |
| ------------------ | --------------------------------------- |
| **Member**         | Active gym member with primary contract |
| **Applicant**      | Person applying for membership          |
| **Companion**      | Guest invited by premium member         |
| **1Day Pass User** | Single-visit ticket holder              |

---

## 3. Core Business Categories

```
┌────────────────────────────────────────────────────────────────┐
│                    FITNESS CRM SYSTEM                           │
├────────────────────────────────────────────────────────────────┤
│  OPERATIONS                                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │   A    │ │   B    │ │   C    │ │   D    │ │   E    │        │
│  │ Member │ │ Entry/ │ │ Member │ │ Lesson │ │Facility│        │
│  │ Mgmt   │ │ Exit   │ │ Apply  │ │  Mgmt  │ │  Mgmt  │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                  │
│  BUSINESS                                                        │
│  ┌────────┐ ┌────────┐ ┌────────┐                              │
│  │   F    │ │   G    │ │   I    │                              │
│  │ Sales  │ │Products│ │Content │                              │
│  │  Mgmt  │ │Campaign│ │  Mgmt  │                              │
│  └────────┘ └────────┘ └────────┘                              │
│                                                                  │
│  PLATFORM                                                        │
│  ┌────────┐ ┌────────┐ ┌────────┐                              │
│  │   X    │ │   Y    │ │   Z    │                              │
│  │Analytics│ │ System │ │ Dash-  │                              │
│  │ Report │ │Settings│ │ board  │                              │
│  └────────┘ └────────┘ └────────┘                              │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Business Flows

### 4.1 Member Onboarding Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    MEMBER ONBOARDING FLOW                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Mobile App]                      [CRM]                         │
│                                                                   │
│  Applicant opens app               │                             │
│       │                            │                             │
│       ▼                            │                             │
│  Select Campaign ─────────────────►│ Campaign determines         │
│       │                            │ Primary Contract (G-03)     │
│       ▼                            │                             │
│  Enter Personal Info               │                             │
│       │                            │                             │
│       ▼                            │                             │
│  Age Verification ◄───────────────►│ JOYFIT: 15+, FIT365: 16+   │
│       │                            │                             │
│       ├── Under age ──────────────►│ Application blocked         │
│       │                            │                             │
│       ├── Minor (15-17/16-17) ────►│ Parent consent required    │
│       │                            │                             │
│       ▼                            │                             │
│  Face Photo Upload                 │                             │
│       │                            │                             │
│       ▼                            │                             │
│  Select Options (Locker, etc.)     │                             │
│       │                            │                             │
│       ▼                            │                             │
│  Register Payment                  │                             │
│  (SBPS Credit / JACCS Bank)        │                             │
│       │                            │                             │
│       ▼                            │                             │
│  Submit Application ──────────────►│ C-01: Application created   │
│                                    │       │                     │
│                                    │       ▼                     │
│                                    │  Blacklist Auto-Check       │
│                                    │       │                     │
│                                    │       ├── Match found ───► Staff review
│                                    │       │                     │
│                                    │       ▼                     │
│                                    │  Staff Reviews (C-01-01)   │
│                                    │       │                     │
│                                    │       ├── Approve ────────► Member created
│                                    │       │                     │     │
│  Receive confirmation ◄────────────│───────┼─────────────────────┘     │
│                                    │       │                           │
│                                    │       ▼                           ▼
│                                    │  Enrollment fee charged    A-01: Member
│                                    │  (Initial + Prepay)        Management
│                                    │                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Entry/Exit Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      ENTRY/EXIT FLOW (B-01)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Mobile App]                      [Gate System]       [CRM]     │
│                                                                   │
│  Member opens app                       │                │       │
│       │                                 │                │       │
│       ▼                                 │                │       │
│  Generate One-time QR                   │                │       │
│       │                                 │                │       │
│       │  (Already inside?) ─────────────┼───► QR Invalid │       │
│       │                                 │                │       │
│       ▼                                 │                │       │
│  Present QR to reader ─────────────────►│                │       │
│                                         │                │       │
│                                         ▼                │       │
│                                    Validate QR           │       │
│                                         │                │       │
│                     ┌───────────────────┴───────────────────┐    │
│                     ▼                                       ▼    │
│               Check: Gate Stop?                    Check: Blacklist?
│                     │                                       │    │
│            ┌────────┴────────┐                    ┌────────┴────┐│
│            ▼                 ▼                    ▼             ▼│
│         Manual Stop     Unpaid Balance      Blacklisted    Family in use
│            │                 │                    │             ││
│            └────────┬────────┘                    └──────┬──────┘│
│                     ▼                                    ▼       │
│               Display Message                       Gate Denied  │
│                     │                                            │
│            ┌────────┴────────┐                                   │
│            ▼                 ▼                                   │
│        Allow Entry      Block Entry                              │
│                                                                   │
│                     ▼                                            │
│               Gate Opens                                         │
│                     │                                            │
│                     ▼                                            │
│               Entry Log Recorded ────────────────────────► B-01  │
│                                                           Monitor│
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 Member Status Change Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                 MEMBER STATUS CHANGE FLOW (A-01/A-02/A-03)        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│                        [Active Member]                            │
│                              │                                    │
│              ┌───────────────┼───────────────┐                    │
│              ▼               ▼               ▼                    │
│         SUSPENSION       WITHDRAWAL       TRANSFER                │
│              │               │               │                    │
│              ▼               ▼               ▼                    │
│   ┌─────────────────┐ ┌─────────────┐ ┌─────────────────────┐    │
│   │ A-01-01-b       │ │ A-01-01-b   │ │ A-01-01-b           │    │
│   │ Request suspend │ │ Request     │ │ Request transfer    │    │
│   │ (start/end date)│ │ withdrawal  │ │ (target store)      │    │
│   └────────┬────────┘ └──────┬──────┘ └──────────┬──────────┘    │
│            │                 │                   │                │
│            ▼                 ▼                   ▼                │
│   ┌─────────────────┐        │          ┌───────────────────┐    │
│   │ A-03: Suspend   │        │          │ JOYFIT vs FIT365  │    │
│   │ Management List │        │          │ different flows   │    │
│   └────────┬────────┘        │          └─────────┬─────────┘    │
│            │                 │                    │               │
│            ▼                 ▼                    ▼               │
│   [Suspended Status]  ┌─────────────┐    ┌───────────────────┐   │
│            │          │ A-03: With- │    │ JOYFIT: Auto      │   │
│            │          │ drawal List │    │ (origin approve)  │   │
│   End date │          └──────┬──────┘    │                   │   │
│   reached  │                 │           │ FIT365: Manual    │   │
│            ▼                 │           │ (both approve)    │   │
│   [Active Again]             │           └─────────┬─────────┘   │
│                              │                     │              │
│                              ▼                     ▼              │
│                    [Withdrawn Status]    [Transfer Complete]      │
│                              │                     │              │
│                              ▼                     ▼              │
│                    (Blacklist if unpaid)  [New Store Active]     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.4 Billing & Payment Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    MONTHLY BILLING FLOW (F-01)                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Day 2: Calculate billing amounts                                │
│         (Primary contract + Options + Variable fees)             │
│              │                                                    │
│              ▼                                                    │
│  Staff/Manager: Review & Confirm billing (F-01)                  │
│              │                                                    │
│    ┌─────────┴─────────┐                                         │
│    ▼                   ▼                                         │
│  [SBPS]              [JACCS]                                     │
│  Day 9: Send         Day 12-13: Send                             │
│  Day 13: Result      Next 4th: Result                            │
│    │                   │                                         │
│    └─────────┬─────────┘                                         │
│              │                                                    │
│    ┌─────────┴─────────┐                                         │
│    ▼                   ▼                                         │
│ [Success]           [Failed]                                     │
│    │                   │                                         │
│    ▼                   ▼                                         │
│ F-01-01:           F-01-02:                                      │
│ Payment Record     Unpaid Management                             │
│                        │                                         │
│                        ▼                                         │
│               Retry next month                                   │
│               (No 6-month limit)                                 │
│                        │                                         │
│              ┌─────────┴─────────┐                               │
│              ▼                   ▼                               │
│    [Eventually Paid]    [Write-off at month end]                 │
│              │                   │                               │
│              ▼                   ▼                               │
│         Cleared             Bad Debt                             │
│                             (Date: 1st of next month)            │
│                                                                   │
│  Forced Withdrawal Rules:                                        │
│  • SBPS: 2 months consecutive unpaid → auto-withdrawal           │
│  • JACCS (JOYFIT): 1 month unpaid → withdrawal                   │
│  • JACCS (FIT365): 3 months grace → withdrawal                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 4.5 Lesson Booking Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    LESSON BOOKING FLOW (D-01)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    STUDIO LESSON                             │ │
│  │                                                               │ │
│  │  HQ: Create lesson content master (D-02)                     │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │  Store: Configure studio (D-03)                              │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │  Store: Create schedule (D-01)                               │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │  [Mobile App] Member books slot                              │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │  Day of lesson: Member scans QR → Attendance confirmed       │ │
│  │       │                                                       │ │
│  │       └── No-show (2x in 1 week) → 1 week booking ban        │ │
│  │                                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 PERSONAL TRAINING                            │ │
│  │                                                               │ │
│  │  Mode A (Slot Publishing):                                   │ │
│  │    Trainer publishes available slots                         │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │    Member selects from available slots via app               │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │    Payment processed (if paid session)                       │ │
│  │                                                               │ │
│  │  Mode B (Schedule Notification):                             │ │
│  │    Trainer confirms monthly schedule                         │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │    Notify regular clients                                    │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │    Clients respond with preferences                          │ │
│  │       │                                                       │ │
│  │       ▼                                                       │ │
│  │    Trainer confirms booking in CRM                           │ │
│  │                                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. System Integration Points

| Integration           | Direction     | Purpose                                  |
| --------------------- | ------------- | ---------------------------------------- |
| SBPS (Credit Card)    | Bidirectional | Payment processing, results import       |
| JACCS (Bank Transfer) | Bidirectional | Payment processing, results import       |
| WordPress             | Export        | Store page content, announcements        |
| Push Notification     | Export        | SMS, push, email, in-app notifications   |
| Gate Control Device   | Bidirectional | QR validation, entry/exit signals        |
| Mobile App Backend    | Bidirectional | Member data sync, booking, notifications |

---

## 6. Related Documents

- [architecture.md](./architecture.md) — System architecture and tech stack
- [business-glossary.md](./business-glossary.md) — Term definitions
- [user-personas.md](./user-personas.md) — User behavior patterns
- `requirements/` folder — Detailed feature specifications

---

_Last updated: April 2026_
