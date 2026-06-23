# RepuRing Screen Wireframes v1

## 0. Purpose

This document gives text-based wireframes for the RepuRing MVP screens.

It is meant for engineering handoff. The goal is not pixel-perfect design. The goal is to make layout hierarchy, component order, page intent, and primary actions clear before implementation.

RepuRing is a Social-Fi Web3 app for contributor communities on Canopy testnet/local Canopy environment.

Core loop:

```text
Identity → Circle → Proof-of-Work → Peer Endorsement → Reputation → Role / Status
```

## 1. Global Layout Pattern

Each RepuRing screen should follow this structure where possible:

```text
[Top navigation]

[Page header]
- eyebrow
- title
- short product explanation
- primary page actions

[Context banner]
- selected wallet/profile
- selected community circle
- membership/admin status

[Main content]
- page-specific form/feed/table/cards

[Supporting content]
- reputation/role/help/secondary data

[Testnet status]
- RPC state
- last transaction
- refresh action
```

Product information should come before technical status.

## 2. `/repuring` — Overview Wireframe

### Intent

Orient the user and show the next step in the Social-Fi journey.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ HERO                                                         │
│ Eyebrow: RepuRing / Social-Fi on Canopy                     │
│ Title: Onchain Social-Fi for Web3 contributors              │
│ Copy: Create identity, join circles, post proof, get         │
│       reviewed, build reputation, claim role.                │
│ Badges: Social-Fi / Contribution Network / Canopy Testnet    │
│ CTAs: [Open Community] [Create Profile] [Discover Circles]   │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ CURRENT PROFILE     │ │ CURRENT COMMUNITY   │
│ Avatar              │ │ Circle name         │
│ Username/address    │ │ Member count        │
│ Status badge        │ │ Member/admin status │
└─────────────────────┘ └─────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Wallet     │ │ Reputation │ │ Role       │ │ Reviews    │
│ selected?  │ │ global rep │ │ current    │ │ count      │
└────────────┘ └────────────┘ └────────────┘ └────────────┘

┌──────────────────────────────────────────────────────────────┐
│ JOURNEY CHECKLIST                                            │
│ [Done] 1 Select wallet                                      │
│ [Next] 2 Create profile                                     │
│ [Lock] 3 Join community                                     │
│ [Lock] 4 Post proof-of-work                                 │
│ [Lock] 5 Review work                                        │
│ [Lock] 6 Build reputation                                   │
│ [Lock] 7 Claim role                                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ QUICK ACTIONS                                                │
│ [My Account] [Discover Circles] [Community] [Post Work]      │
│ [Review Work] [Leaderboard] [Admin]                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CANOPY TESTNET READINESS                                     │
│ Query/Tx RPC status / Admin RPC status / Last transaction    │
│ [Refresh]                                                    │
└──────────────────────────────────────────────────────────────┘
```

### Primary CTA logic

| State | Primary CTA |
| --- | --- |
| No wallet | Select wallet |
| Wallet, no profile | Create profile |
| Profile, no circle | Discover circles |
| Profile, circle, not member | Join community |
| Member, no contribution | Post proof-of-work |
| Member, contribution from another user exists | Review work |
| Reputation gained | Claim role |

## 3. `/key-management` — My Account Wireframe

### Intent

Create/select wallet and create/update contributor profile.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ Title: My Account                                            │
│ Copy: Select a local signing wallet and manage your          │
│       RepuRing contributor profile.                          │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ LOCAL WALLETS       │ │ SELECTED WALLET                     │
│ - Wallet list       │ │ Address                             │
│ - Create key        │ │ Status: selected / not selected     │
│ - Select key        │ │ Password input for signing          │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CONTRIBUTOR PROFILE                                          │
│ If no profile:                                               │
│   Username input                                             │
│   Bio textarea                                               │
│   Avatar URL input                                           │
│   [Create profile]                                           │
│ If profile exists:                                           │
│   Profile preview                                            │
│   Bio textarea                                               │
│   Avatar URL input                                           │
│   [Update profile]                                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STATUS                                                       │
│ Last profile transaction / error / refresh state             │
└──────────────────────────────────────────────────────────────┘
```

### Notes

- Username should be immutable in MVP if protocol does not support username update.
- Password field should be cleared on wallet switch.
- Profile creation is the first required product step after wallet selection.

## 4. `/repuring/circles` — Discover Circles Wireframe

### Intent

Create, discover, join, and open community circles.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ Title: Community Circles                                     │
│ Copy: Create or join Web3 contributor communities where      │
│       proof-of-work becomes reputation.                      │
│ CTAs: [Create circle] [Refresh circles]                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CURRENT CONTEXT                                              │
│ Wallet/profile status / selected circle / membership status  │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CREATE CIRCLE       │ │ DISCOVER CIRCLES                    │
│ Name                │ │ Circle Card                         │
│ Suggested ID        │ │ - name                              │
│ Description         │ │ - description                       │
│ [Create community]  │ │ - ID                                │
│ Advanced: manual ID │ │ - creator                           │
│                     │ │ - member count                      │
│                     │ │ - status badge                      │
│                     │ │ - [Join] / [Open community]         │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ JOINED COMMUNITIES                                           │
│ Cards for circles the current wallet has joined or created   │
└──────────────────────────────────────────────────────────────┘
```

### Empty states

No profile:

```text
Create a profile before creating or joining community circles.
```

No circles:

```text
No community circles found yet. Create the first one.
```

## 5. `/repuring/community` — Community Workspace Wireframe

### Intent

Main product workspace for a selected community.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ COMMUNITY HEADER                                             │
│ Title: <circle name>                                         │
│ Copy: <circle description>                                   │
│ Status: Creator / Joined / Not joined / No profile           │
│ CTAs: [Refresh] [Post Work] [Review Work] [Leaderboard]      │
│      [Admin], if creator                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ACTIVE WALLET BANNER                                         │
│ Avatar / username / address / member status / next action    │
└──────────────────────────────────────────────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ Members    │ │ Proofs     │ │ Reviews    │ │ Your Rep   │ │ Your Role  │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ LEFT COLUMN         │ │ RIGHT COLUMN                        │
│                     │ │                                     │
│ Joined communities  │ │ Recent proof-of-work                 │
│ Member list         │ │ - contribution cards                 │
│ Role progress       │ │ - review CTAs                       │
│                     │ │                                     │
│                     │ │ Recent peer reviews                  │
│                     │ │ - review cards                       │
│                     │ │                                     │
│                     │ │ Leaderboard preview                  │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TESTNET STATUS / LAST TRANSACTION                            │
└──────────────────────────────────────────────────────────────┘
```

### Primary behavior

- If user is not member, show join guidance before contribution/review actions.
- If no contribution exists, show `Post first proof-of-work` CTA.
- If user is creator/admin, show moderation shortcut.
- If multiple joined communities exist, allow switching community.

## 6. `/repuring/contributions` — Proof Feed Wireframe

### Intent

Post and browse proof-of-work in selected circle.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ Title: Proof-of-Work Feed                                    │
│ Copy: Post useful work so peers can review it and help       │
│       you build reputation.                                  │
│ CTA: [Refresh feed]                                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ COMMUNITY CONTEXT                                            │
│ Selected circle / member status / posting eligibility        │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ POST PROOF FORM     │ │ CONTRIBUTION FEED                   │
│ Title               │ │ Card:                               │
│ Description         │ │ - category badge                    │
│ Proof URL           │ │ - title                             │
│ Category            │ │ - author                            │
│ Advanced ID         │ │ - description                       │
│ [Post proof]        │ │ - proof URL                         │
│                     │ │ - endorsement count                 │
│                     │ │ - status                            │
│                     │ │ - [Review this work]                │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ EXISTING REVIEWS / COMMENTS FOR SELECTED CONTRIBUTION        │
└──────────────────────────────────────────────────────────────┘
```

### Form gating

| State | Form behavior |
| --- | --- |
| No wallet | Disabled, show select wallet CTA |
| No profile | Disabled, show create profile CTA |
| Not member | Disabled, show join community CTA |
| Member | Enabled |

## 7. `/repuring/endorse` — Review Work Wireframe

### Intent

Review another member's contribution and create a reputation-impacting endorsement.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ Title: Review Work                                           │
│ Copy: Review useful proof-of-work from other members.        │
│      Valid peer reviews increase the author's reputation.    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ COMMUNITY CONTEXT                                            │
│ Selected circle / member status / review eligibility         │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CONTRIBUTION PICKER │ │ SELECTED CONTRIBUTION               │
│ List/cards          │ │ Title                               │
│ - author            │ │ Author                              │
│ - title             │ │ Description                         │
│ - category          │ │ Proof URL                           │
│ - status            │ │ Endorsement count                   │
│ [Select]            │ │ Status                              │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ REVIEW FORM                                                  │
│ Tag selector                                                 │
│ Message textarea                                             │
│ Reputation impact note: +1 global reputation to author       │
│ [Submit peer review]                                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ EXISTING REVIEWS                                             │
│ Review cards, active/slashed status, messages                │
└──────────────────────────────────────────────────────────────┘
```

### Disabled review cases

- no wallet
- no profile
- not member
- own contribution
- duplicate review
- slashed contribution

## 8. `/repuring/leaderboard` — Leaderboard Wireframe

### Intent

Show visible social capital and role/status rankings.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ Title: Reputation Leaderboard                                │
│ Copy: See contributors ranked by reputation in the selected  │
│       community context.                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ COMMUNITY CONTEXT + GLOBAL REPUTATION NOTICE                 │
│ MVP uses global profile reputation shown in this community.  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ LEADERBOARD TABLE                                            │
│ Rank | Contributor | Reputation | Role | Claimed?            │
│ 1    | Alice       | 15         | Core Member | Yes          │
│ 2    | Bob         | 5          | Trusted     | No           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ YOUR STATUS         │ │ ROLE THRESHOLDS                     │
│ Rank                │ │ Newbie: 0..4                        │
│ Reputation          │ │ Trusted: 5..14                      │
│ Current role        │ │ Core Member: 15..29                 │
│ Next role           │ │ Circle Leader: 30+                  │
└─────────────────────┘ └─────────────────────────────────────┘
```

### Empty state

```text
No ranked contributors yet. Members will appear after profiles and endorsements are loaded.
```

## 9. `/repuring/admin` — Admin Wireframe

### Intent

Allow role claiming and admin moderation of invalid reviews.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PAGE HEADER                                                  │
│ Title: Admin & Role                                          │
│ Copy: Claim your community role and moderate invalid reviews │
│       if you are the circle creator/admin.                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ADMIN ELIGIBILITY CARD                                       │
│ Status: Creator/Admin OR Member only OR Not member           │
│ Explanation and next action                                  │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CLAIM ROLE          │ │ ROLE PROGRESS                       │
│ Current reputation  │ │ Threshold cards                     │
│ Derived role        │ │ Next role needed points             │
│ [Claim role]        │ │                                     │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ MODERATION QUEUE                                             │
│ Review Card                                                  │
│ - linked contribution                                        │
│ - reviewer                                                   │
│ - target                                                     │
│ - tag/message                                                │
│ - active/slashed status                                      │
│ - [Slash invalid review], admin only                         │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SLASH CONFIRMATION / REASON                                  │
│ Reason textarea                                              │
│ Impact warning: target reputation -2, floor 0                │
│ [Confirm slash]                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STATUS / LAST TRANSACTION                                    │
└──────────────────────────────────────────────────────────────┘
```

### Non-admin behavior

Non-admin users should still understand the page:

```text
You can claim your role, but only the community creator/admin can slash invalid reviews.
```

### Admin behavior

Creator/admin sees active moderation queue and slash actions.

## 10. Mobile Layout Notes

On smaller screens:

- collapse multi-column layouts into one column
- keep page header first
- show active wallet/community context before forms
- show primary CTA near the top and again near relevant form
- contribution/review cards should be full width
- tables should become stacked cards if needed

Mobile priority order:

```text
Context
→ Primary action
→ Feed/data
→ Supporting metrics
→ Testnet status
```

## 11. Component Priority

If implementation time is limited, prioritize components in this order:

1. Active Wallet Banner
2. Community Context Card
3. Proof-of-Work Card
4. Peer Review Card
5. Journey Checklist
6. Reputation / Role Progress Card
7. Transaction Status Card
8. Leaderboard Table
9. Admin Moderation Queue
10. Joined Communities Switcher

## 12. Wireframe Acceptance Checklist

The screen structure is acceptable when:

- each page has one clear purpose
- current wallet/profile state is visible where needed
- current community context is visible on circle-scoped pages
- the primary CTA changes based on user state
- empty states guide users to the next step
- proof-of-work cards and review cards feel social
- admin moderation is card-driven
- technical/testnet state is visible but visually secondary
