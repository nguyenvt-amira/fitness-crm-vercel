# Fitness CRM User Personas

> Main user types of Fitness CRM and their behavior patterns.
> A reference to determine which users are impacted during requirements definition.

---

## Persona Overview

| #   | Persona       | System Used      | Primary Concerns           |
| --- | ------------- | ---------------- | -------------------------- |
| 1   | Store Staff   | CRM (Management) | Efficient member support   |
| 2   | Store Manager | CRM (Management) | Store operations oversight |
| 3   | Trainer       | CRM (Limited)    | Lesson scheduling          |
| 4   | Headquarter   | CRM (Management) | Full system management     |
| 5   | Member        | Mobile App       | Convenient gym experience  |
| 6   | Applicant     | Mobile App       | Easy signup process        |

---

## 1. Store Staff (店舗スタッフ)

### Profile

- Full-time or part-time employee at a gym location
- Uses CRM daily for member interactions
- Handles front desk operations, inquiries, and basic admin tasks
- May use both PC and mobile (PWA)

### Goals

- Quickly find member information during interactions
- Process membership applications efficiently
- Handle payments and billing inquiries
- Manage locker assignments and facility issues
- Minimize paperwork, maximize member face-time

### "Happy" Definition

> **Liberation from administrative tasks** — Complete operations quickly so more time can be spent interacting with members

### Main Features Used

| Feature                | Frequency | Related Module |
| ---------------------- | --------- | -------------- |
| Member search/details  | Highest   | A-01           |
| Entry monitor          | High      | B-01           |
| Application review     | High      | C-01           |
| Lesson schedule view   | Medium    | D-01           |
| Locker management      | Medium    | E-01           |
| Payment/billing lookup | Medium    | F-01           |
| Dashboard              | Low       | Z-01           |

### Typical Flow (Member Inquiry)

```
Member arrives at front desk
    ↓
Staff: Search member in A-01
    ↓
View member details (contract, status, history)
    ↓
Resolve inquiry or perform operation
    ↓
Document interaction if needed
```

### Typical Flow (New Application)

```
Receive application notification
    ↓
Staff: Open C-01 application list
    ↓
Review application details
    ↓
Check blacklist match warning
    ↓
Approve or reject application
```

---

## 2. Store Manager (店舗責任者 / マネージャー)

### Profile

- Responsible for one or multiple store locations
- Oversees staff operations and store performance
- Reports to area/regional management
- Often a promoted staff member with additional responsibilities

### Goals

- Monitor store KPIs (entries, signups, withdrawals)
- Manage staff schedules and permissions
- Handle escalated member issues
- Ensure smooth daily operations across shifts

### "Happy" Definition

> **Operational visibility** — Understand store status at a glance and identify issues before they escalate

### Main Features Used

| Feature                   | Frequency | Related Module |
| ------------------------- | --------- | -------------- |
| Dashboard                 | Highest   | Z-01           |
| Entry monitor             | High      | B-01           |
| Member list/search        | High      | A-01           |
| Transfer/withdrawal lists | Medium    | A-02, A-03     |
| Billing overview          | Medium    | F-01           |
| Staff management          | Medium    | Y-01           |
| Lesson schedules          | Medium    | D-01           |

### Typical Flow (Daily Check)

```
Morning: Check dashboard (Z-01)
    ↓
Review today's scheduled events (trials, PT sessions)
    ↓
Check any pending applications (C-01)
    ↓
Review withdrawal/transfer requests (A-02, A-03)
    ↓
Address any escalated issues
```

---

## 3. Trainer (トレーナー)

### Profile

- May be full-time employee or contracted instructor
- Primarily focused on lesson delivery
- Limited CRM access (lesson-related only)
- Uses mobile app or tablet frequently

### Goals

- Manage personal training schedule efficiently
- Track session attendance and notes
- Minimize administrative burden
- Focus on member fitness outcomes

### "Happy" Definition

> **Schedule management in one place** — No more juggling Google Calendar, LINE, and paper notes

### Main Features Used

| Feature                    | Frequency | Related Module |
| -------------------------- | --------- | -------------- |
| My schedule view           | Highest   | D-01           |
| Session booking management | High      | D-01           |
| Session attendance         | High      | D-01           |
| Session notes              | Medium    | D-01           |
| Member basic info          | Low       | A-01 (limited) |

### Typical Flow (Mode A - Slot Publishing)

```
Trainer: Set weekly availability in D-01
    ↓
System: Generate available slots
    ↓
Members: Book via mobile app
    ↓
Trainer: Receive booking notification
    ↓
Day of session: Confirm attendance via QR
    ↓
Post-session: Record session notes
```

### Typical Flow (Mode B - Schedule Notification)

```
Trainer: Confirm monthly schedule
    ↓
Notify regular clients
    ↓
Receive client preferences
    ↓
Trainer: Finalize bookings in CRM
    ↓
Day of session: Same as Mode A
```

---

## 4. Headquarter (本部)

### Profile

- Corporate-level staff managing multiple brands/stores
- Responsible for system-wide settings and policies
- Analyzes business performance across locations
- Sets up contracts, campaigns, and master data

### Goals

- Maintain consistent service quality across all locations
- Configure and update master data (contracts, options, campaigns)
- Monitor overall business health and trends
- Ensure compliance and proper permissions

### "Happy" Definition

> **Business visibility at scale** — See the full picture and make data-driven decisions

### Main Features Used

| Feature                     | Frequency | Related Module |
| --------------------------- | --------- | -------------- |
| Analytics/Reports           | Highest   | X-01           |
| Contract management         | High      | G-01           |
| Campaign management         | High      | G-03           |
| Staff/permission management | High      | Y-01           |
| Store management            | High      | Y-02           |
| Brand configuration         | Medium    | Y-07           |
| Billing oversight           | Medium    | F-01           |
| All member data             | As needed | A-01           |

### Typical Flow (New Campaign Setup)

```
HQ: Define campaign in G-03
    ↓
Link to primary contracts
    ↓
Set recruitment/application/validity periods
    ↓
Optionally create promo codes (G-06)
    ↓
Publish to stores
    ↓
Monitor campaign performance
```

---

## 5. Member (会員)

### Profile

- Active gym member with primary contract
- Uses mobile app for daily gym activities
- Ages 15/16+ (brand-dependent)
- May have family members on same plan

### Goals

- Enter gym smoothly without hassle
- Book and manage lesson reservations
- Track workout progress
- Update personal information as needed
- Understand billing and payment status

### "Happy" Definition

> **Convenient, intuitive experience** — Everything I need in the palm of my hand

### Main Features Used (Mobile App)

| Feature            | Frequency | Related Module |
| ------------------ | --------- | -------------- |
| Entry QR code      | Highest   | B-01           |
| Lesson booking     | High      | D-01           |
| Workout tracking   | High      | Y-08, Y-09     |
| Profile management | Medium    | A-01 (via app) |
| Payment history    | Low       | F-01 (via app) |
| Locker selection   | Low       | E-01 (via app) |
| Notifications      | Passive   | I-03           |

### Typical Flow (Gym Visit)

```
Member: Open app, display QR
    ↓
Scan at entry gate
    ↓
Gate opens, entry logged
    ↓
Workout session
    ↓
(If lesson) Scan attendance QR at studio
    ↓
Exit via gate, exit logged
```

### Typical Flow (Lesson Booking)

```
Member: Browse available lessons in app
    ↓
Select preferred time slot
    ↓
Confirm booking
    ↓
Receive confirmation notification
    ↓
(Optional) Add to personal calendar
    ↓
Day of lesson: Attend and scan QR
```

---

## 6. Applicant (申請者)

### Profile

- Potential member interested in joining
- May be referral, walk-in trial, or online discovery
- Using mobile app for first time
- Needs guidance through signup process

### Goals

- Understand membership options clearly
- Complete application quickly and easily
- Start using gym as soon as possible

### "Happy" Definition

> **Seamless onboarding** — From interest to active member without confusion

### Main Features Used (Mobile App)

| Feature              | Frequency      | Related Module |
| -------------------- | -------------- | -------------- |
| Campaign selection   | Once           | G-03           |
| Personal info entry  | Once           | C-01           |
| Photo upload         | Once           | C-01           |
| Payment registration | Once           | F-01           |
| Application status   | Until approved | C-01           |

### Typical Flow (App Signup)

```
Applicant: Download app, start signup
    ↓
Select campaign (determines contract)
    ↓
Enter personal information
    ↓
Age verification
    ↓
Upload face photo
    ↓
Select options (locker, etc.)
    ↓
Register payment method
    ↓
Submit application
    ↓
Wait for staff review
    ↓
Receive approval notification
    ↓
Pay enrollment fee + prepay
    ↓
Start using gym
```

---

## Persona × Feature Matrix

| Feature Category       | Staff | Manager | Trainer | HQ  | Member | Applicant |
| ---------------------- | ----- | ------- | ------- | --- | ------ | --------- |
| Member management (A)  | ★★★   | ★★★     | ★       | ★★★ | —      | —         |
| Entry/exit (B)         | ★★★   | ★★      | —       | ★   | ★★★    | —         |
| Applications (C)       | ★★★   | ★★      | —       | ★★  | —      | ★★★       |
| Lessons (D)            | ★★    | ★★      | ★★★     | ★   | ★★★    | —         |
| Facilities (E)         | ★★★   | ★★      | —       | ★   | ★      | —         |
| Billing (F)            | ★★    | ★★      | —       | ★★★ | ★      | ★         |
| Products/Campaigns (G) | ★     | ★       | —       | ★★★ | —      | ★★        |
| Content (I)            | ★     | ★       | —       | ★★★ | ★      | ★         |
| Analytics (X)          | —     | ★★      | —       | ★★★ | —      | —         |
| System Settings (Y)    | ★     | ★★      | —       | ★★★ | —      | —         |
| Dashboard (Z)          | ★★    | ★★★     | —       | ★★★ | —      | —         |

★★★ = Heavy use, ★★ = Regular use, ★ = Occasional use, — = Not applicable

---

## Access Patterns by Role

| Role        | Store Scope                 | Data Access             |
| ----------- | --------------------------- | ----------------------- |
| System      | All                         | Full (development/ops)  |
| Headquarter | All stores, all brands      | Full read/write         |
| Manager     | Assigned stores/areas       | Full within scope       |
| Staff       | Single store                | Operations within store |
| Trainer     | Single store (lessons only) | Lesson data only        |
| Observer    | Assigned scope              | Read-only               |

---

_Last updated: April 2026_
_Sources: Requirements documents, CRM情報設計\_構造化定義書.md_
