# Fitness CRM Business Glossary

> Business terms used in the Fitness CRM platform → technical mapping.
> A reference for AI agents to understand requirements and tie them to system components.

---

## User Types (Actors)

| Japanese     | English          | Description                     | CRM Access                     |
| ------------ | ---------------- | ------------------------------- | ------------------------------ |
| 本部         | Headquarter (HQ) | Corporate management staff      | Full access, all stores/brands |
| マネージャー | Manager          | Area/territory managers         | Multi-store access             |
| 店舗スタッフ | Store Staff      | Store employees                 | Single store operations        |
| トレーナー   | Trainer          | Instructors, personal trainers  | Lesson management only         |
| 閲覧のみ     | Observer         | Read-only users                 | View access only               |
| 会員         | Member           | Active gym member with contract | Mobile app only                |
| 申請者       | Applicant        | Person applying for membership  | Mobile app only                |
| 同伴者       | Companion        | Guest invited by premium member | Mobile app only                |
| 1Day会員     | 1Day Pass User   | Single-visit ticket holder      | Mobile app only                |

---

## Member-related Terms

| Term             | Japanese       | Description                               | Related Module |
| ---------------- | -------------- | ----------------------------------------- | -------------- |
| Member           | 会員           | Person with active primary contract       | A-01           |
| User ID          | ユーザーID     | New system identifier (auto-generated)    | A-01           |
| Legacy Member No | 旧会員No       | Old system identifier (migrated)          | A-01           |
| Regular Member   | 通常会員       | Standard membership with primary contract | A-01           |
| 1Day Pass Member | 1Day会員       | Single-visit ticket purchaser             | A-01           |
| Family Member    | 家族会員       | Dependent member (max 3 per primary)      | A-01           |
| Corporate Member | 法人会員       | Member under corporate contract           | A-01, G-01     |
| Member Status    | ステータス     | Active / Suspended / Withdrawn            | A-01           |
| Gate Stop        | ゲートストップ | Manual entry restriction by staff         | A-01, B-01     |
| Blacklist        | ブラックリスト | Forced withdrawal + unpaid debt list      | A-01, C-01     |

---

## Membership Status Terms

| Term                 | Japanese     | Description                           | Related Module |
| -------------------- | ------------ | ------------------------------------- | -------------- |
| Active               | 有効（通常） | Normal active membership              | A-01           |
| Suspended            | 休会         | Temporarily paused (still valid)      | A-03           |
| Withdrawal           | 退会         | Terminated membership (invalid)       | A-03           |
| Planned Withdrawal   | 退会予定     | Withdrawal scheduled but not executed | A-03           |
| Forced Withdrawal    | 強制退会     | Auto-withdrawal due to unpaid bills   | A-01, F-01     |
| Transfer             | 移籍         | Change of primary contract store      | A-02           |
| Emergency Suspension | 臨時休会     | Special suspension (disaster, COVID)  | A-03           |

---

## Contract-related Terms

| Term             | Japanese             | Description                                                                          | Related Module |
| ---------------- | -------------------- | ------------------------------------------------------------------------------------ | -------------- |
| Primary Contract | 主契約               | Base membership agreement                                                            | G-01           |
| Option           | オプション           | Add-on services (locker, water, etc.)                                                | G-02           |
| Campaign         | キャンペーン         | Promotional offers, discounts                                                        | G-03           |
| Contract Type    | 契約タイプ           | general / oneDay / family / kids / student / corporate / welfare / prepaid / special | G-01           |
| Parent Contract  | 親主契約             | Base contract for variations                                                         | G-01           |
| Special Contract | 特殊契約             | Store/region-specific contract                                                       | G-01           |
| Usage Start Date | 利用開始日           | Effective start date of contract                                                     | C-01           |
| Prepay Period    | 先払い期間           | Months required upfront (1-2)                                                        | G-01, C-01     |
| Cancellation Fee | 解約手数料           | Fee for early termination                                                            | A-02           |
| Enrollment Fee   | 入会金               | Initial membership fee                                                               | G-05           |
| Promo Code       | プロモーションコード | Discount code for campaigns                                                          | G-06           |

---

## Entry/Exit Terms

| Term             | Japanese     | Description                                   | Related Module |
| ---------------- | ------------ | --------------------------------------------- | -------------- |
| Entry            | 入館         | Member entering facility                      | B-01           |
| Exit             | 退館         | Member leaving facility                       | B-01           |
| Entry Log        | 入退館ログ   | Timestamped entry/exit record                 | B-01           |
| One-time QR      | ワンタイムQR | Single-use QR code from app                   | B-01           |
| NFC Card         | NFCカード    | Physical card (legacy, being phased out)      | B-01           |
| In-facility      | 在館者       | Currently inside the facility                 | B-01           |
| Visitor Monitor  | 来館モニター | Real-time occupancy display                   | B-01           |
| Badge            | バッジ       | Frequency-based label (e.g., "Working hard!") | B-01           |
| Companion Invite | 同伴招待     | Premium member invites a guest                | B-01           |

---

## Lesson-related Terms

| Term                           | Japanese               | Description                        | Related Module |
| ------------------------------ | ---------------------- | ---------------------------------- | -------------- |
| Lesson                         | レッスン               | Any trainer-led session            | D-01           |
| Studio Lesson                  | スタジオレッスン       | Group class in studio              | D-01           |
| Personal Training (PT)         | パーソナルトレーニング | 1-on-1 trainer session             | D-01           |
| Monthly Plan                   | 月次プラン             | 2/4/6/8 sessions per month package | D-01           |
| Pay-per-session                | 都度払い               | Single session payment             | D-01           |
| Mode A (Slot Publishing)       | 枠公開型               | Trainer publishes open slots       | D-01           |
| Mode B (Schedule Notification) | 通知調整型             | Trainer notifies regulars          | D-01           |
| Buffer                         | バッファ               | Time gap between sessions          | D-01           |
| Attendance QR                  | 出席確認               | QR scan for lesson attendance      | D-01           |
| No-show Penalty                | ペナルティ             | 2 no-shows in 1 week = 1 week ban  | D-01           |
| Instructor                     | 指導者                 | Trainer or instructor              | D-04           |
| Trial Slot                     | 体験枠                 | Slot for trial participants        | D-01           |

---

## Facility-related Terms

| Term               | Japanese         | Description                              | Related Module |
| ------------------ | ---------------- | ---------------------------------------- | -------------- |
| Locker             | ロッカー         | Locker cabinet unit                      | E-01           |
| Locker Slot        | ロッカースロット | Individual locker compartment            | E-01           |
| Location           | ロケーション     | Locker placement identifier (A, B, C...) | E-01           |
| Slot Status        | スロット状態     | Available / In Use / Pending Release     | E-01           |
| Pending Release    | 開放待ち         | After cancellation, awaiting cleaning    | E-01           |
| PIN Code           | 暗証番号         | Locker combination (staff changes only)  | E-01           |
| Contract Type Code | 契約形態コード   | Links locker type to pricing             | E-01           |
| Gate Device        | 接点制御装置     | Entry gate control unit                  | E-02           |
| Training Equipment | トレーニング機材 | Gym machines and equipment               | E-03           |

---

## Billing-related Terms

| Term                      | Japanese         | Description                           | Related Module |
| ------------------------- | ---------------- | ------------------------------------- | -------------- |
| SBPS                      | SBPS             | Credit card payment provider          | F-01           |
| JACCS                     | JACCS            | Bank transfer payment provider        | F-01           |
| Monthly Billing           | 月次請求         | Batch billing for subscriptions       | F-01           |
| Per-use Billing           | 都度請求         | Billing per transaction               | F-01           |
| Billing Confirmed         | 請求確定         | Billing finalized for processing      | F-01           |
| Post-confirmation Change  | 請求確定後変更   | Reverting confirmed billing           | F-01           |
| Unpaid                    | 未納金           | Outstanding payment                   | F-01           |
| Refund                    | 返金             | Return payment to member              | F-01           |
| Refund Approval           | 返金承認         | Upper role approves refund            | F-01           |
| Write-off                 | 貸倒             | Bad debt recognition                  | F-01           |
| CASHPOST                  | CASHPOST         | Convenience store cash refund service | F-01           |
| Convenience Store Payment | コンビニ決済     | Payment via convenience store         | F-01           |
| Accounting CSV            | 会計連携CSV      | Export for accounting system          | F-01           |
| Payment History           | 入出金明細       | Record of all transactions            | F-01-01        |
| Collection Management     | 請求・未回収管理 | Unpaid and retry management           | F-01-02        |

---

## Content-related Terms

| Term                | Japanese     | Description                      | Related Module |
| ------------------- | ------------ | -------------------------------- | -------------- |
| Store Page          | 店舗ページ   | Public info about store facility | I-01           |
| Announcement        | 告知         | News/blog for public audience    | I-02           |
| Notification        | 通知         | Push/SMS/email to app users      | I-03           |
| Push Notification   | プッシュ通知 | Mobile push notification         | I-03           |
| In-app Notification | アプリ通知   | Notification inside app          | I-03           |

---

## System-related Terms

| Term            | Japanese         | Description                      | Related Module |
| --------------- | ---------------- | -------------------------------- | -------------- |
| Role            | ロール           | Fixed permission level (6 types) | Y-01           |
| Position Master | 職位マスター     | Customizable job titles          | Y-01           |
| Store           | 店舗             | Physical gym location            | Y-02           |
| FC Company      | FC企業           | Franchise company                | Y-03           |
| Brand           | ブランド         | JOYFIT or FIT365                 | Y-07           |
| Terms Document  | 規約文書         | Legal documents (terms, privacy) | Y-04           |
| App Version     | アプリバージョン | Mobile app version management    | Y-05           |
| Maintenance     | メンテナンス     | System maintenance window        | Y-06, Y-10     |
| Exercise        | エクササイズ     | Exercise type definition         | Y-08           |
| Routine         | ルーティン       | Exercise combination template    | Y-09           |
| Dashboard       | ダッシュボード   | Real-time summary view           | Z-01           |
| Analytics       | 分析・レポート   | Historical data analysis         | X-01           |

---

## Brand-specific Differences

| Setting                   | JOYFIT                       | FIT365                |
| ------------------------- | ---------------------------- | --------------------- |
| Minimum Age               | 15 years                     | 16 years              |
| Transfer                  | Auto (origin approves)       | Manual (both approve) |
| Cross-use                 | Primary contract (free)      | Option (¥500)         |
| Enrollment Fee            | ¥2,000 + ¥3,000 registration | ¥5,000 card fee       |
| Prepay Period             | 1-2 months (configurable)    | 2 months fixed        |
| New Lockers               | Various types                | Dial-type only        |
| Forced Withdrawal (SBPS)  | 2 months unpaid              | 2 months unpaid       |
| Forced Withdrawal (JACCS) | 1 month unpaid               | 3 months grace        |

---

## Abbreviations

| Abbr  | Full Form                        | Description                        |
| ----- | -------------------------------- | ---------------------------------- |
| HQ    | Headquarter                      | Corporate management               |
| PT    | Personal Training                | 1-on-1 training session            |
| SBPS  | SoftBank Payment Service         | Credit card provider               |
| JACCS | Japan Consumer Credit Service    | Bank transfer provider             |
| QR    | Quick Response (code)            | Entry/attendance verification      |
| NFC   | Near Field Communication         | Physical card technology           |
| eKYC  | Electronic Know Your Customer    | Digital identity verification      |
| CRM   | Customer Relationship Management | This management system             |
| OOUI  | Object-Oriented UI               | UI design pattern (person-centric) |

---

_Last updated: April 2026_
_Sources: Requirements documents (A-01 through Y-11), CRM情報設計\_構造化定義書.md_
