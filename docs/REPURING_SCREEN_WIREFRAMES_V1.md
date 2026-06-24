# RepuRing Screen Wireframes v1

## 0. Purpose

This document gives text-based wireframes for the RepuRing MVP screens.

It is meant for engineering handoff. The goal is not pixel-perfect design. The goal is to make layout hierarchy, component order, page intent, state behavior, and primary actions clear before implementation.

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

[Readonly current community context]
- community name
- Circle ID as readonly metadata
- member count
- current wallet status
- change community action where needed

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

Circle-scoped screens must include readonly current community context near the top of the page.

Technical IDs appear as metadata, not primary inputs.

Technical status appears after product context and main action areas.

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
│ CANOPY TESTNET READINESS                                     │
│ Query/Tx RPC status / Admin RPC status / Last transaction    │
│ [Refresh]                                                    │
└──────────────────────────────────────────────────────────────┘
```

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
│ If no profile: username / bio / avatar / [Create profile]    │
│ If profile: preview / bio / avatar / [Update profile]        │
└──────────────────────────────────────────────────────────────┘
```

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
│ Suggested ID        │ │ - name / description                │
│ Description         │ │ - ID as metadata                    │
│ [Create community]  │ │ - creator / member count            │
│ Advanced: manual ID │ │ - status badge                      │
│                     │ │ - [Join] / [Open community]         │
└─────────────────────┘ └─────────────────────────────────────┘
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
│ READONLY COMMUNITY CONTEXT                                   │
│ Community name / Circle ID / member count / current status   │
│ [Change community]                                           │
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
│ Joined communities  │ │ Recent proof-of-work cards           │
│ Member list         │ │ Recent peer review cards             │
│ Role progress       │ │ Leaderboard preview                  │
└─────────────────────┘ └─────────────────────────────────────┘
```

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
│ READONLY COMMUNITY CONTEXT                                   │
│ Community name / Circle ID / member count / wallet status    │
│ [Change community]                                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ POST PROOF FORM     │ │ CONTRIBUTION FEED                   │
│ Title               │ │ [Feed Count]                        │
│ Description         │ │ Showing X of Y contributions        │
│ Proof URL           │ │ [Show more]                         │
│ Category            │ │                                     │
│                     │ │ Card:                               │
│ [Generated ID]      │ │ - category badge                    │
│ Onchain record ID   │ │ - title / author                    │
│ <generated id>      │ │ - description / proof URL           │
│ [Regenerate ID]     │ │ - endorsement count                 │
│ Advanced custom ID  │ │ - status badge                      │
│                     │ │ - onchain record ID metadata        │
│ [Post proof]        │ │ - [Review this work]                │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ POST VISIBILITY NOTICE                                       │
│ Possible states:                                             │
│ - Contribution submitted. Checking feed...                   │
│ - Contribution posted and visible in feed.                   │
│ - Submitted but not visible yet. Refresh again.              │
│ - Failed: <friendly error>                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ EXISTING REVIEWS / COMMENTS FOR SELECTED CONTRIBUTION        │
└──────────────────────────────────────────────────────────────┘
```

### Generated Record ID block

```text
[Generated Record ID]
- Label: Onchain record ID
- Value: <generated contribution id>
- Helper: This ID is generated for the onchain contribution record.
- Action: [Regenerate ID]
- Advanced: custom contribution ID
```

### Feed Count block

```text
[Feed Count]
Showing X of Y contributions
[Show more]
```

Filter empty state must be different from a truly empty feed.

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
│ READONLY COMMUNITY CONTEXT                                   │
│ Community name                                               │
│ Circle ID                                                    │
│ Member count                                                 │
│ Current wallet status                                        │
│ [Change community]                                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CONTRIBUTION PICKER │ │ SELECTED CONTRIBUTION               │
│ List/cards          │ │ Title                               │
│ - author            │ │ Author                              │
│ - title             │ │ Description                         │
│ - category          │ │ Proof URL                           │
│ - status badge:     │ │ Endorsement count                   │
│   Slashed / Own     │ │ Status                              │
│   work / Already    │ │ Onchain record ID                   │
│   endorsed / Ready  │ │                                     │
│ [Select]            │ │                                     │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ALREADY ENDORSED NOTICE, conditional                         │
│ You already endorsed this work.                              │
│ Your review is visible below.                                │
│ Endorsements cannot be self-cancelled in MVP.                │
│ If this review is invalid, creator/admin can moderate it.    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ REVIEW FORM                                                  │
│ Tag selector                                                 │
│ Message textarea                                             │
│ Reputation impact note: +1 global reputation to author       │
│ [Review and continue]                                        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CONFIRM PEER REVIEW                                          │
│ Contribution title                                           │
│ Onchain record ID                                            │
│ Author                                                       │
│ Community                                                    │
│ Tag                                                          │
│ Reviewer wallet                                              │
│ Review message                                               │
│ Reputation impact: +1 global reputation to author            │
│ Warning: this endorsement cannot be self-cancelled in MVP    │
│ [Confirm endorsement] [Cancel]                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ EXISTING REVIEWS                                             │
│ Review cards, active/slashed status, messages                │
└──────────────────────────────────────────────────────────────┘
```

### Already Endorsed Notice

```text
[Already Endorsed Notice]
You already endorsed this work.
Your review is visible below.
Endorsements cannot be self-cancelled in MVP.
If this review is invalid, creator/admin can moderate it.
```

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
│ READONLY COMMUNITY CONTEXT + GLOBAL REPUTATION NOTICE        │
│ MVP uses global profile reputation shown in this community.  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ LEADERBOARD TABLE                                            │
│ Rank | Contributor | Reputation | Role | Claimed?            │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ YOUR STATUS         │ │ ROLE THRESHOLDS                     │
│ Rank                │ │ Newbie: 0..4                        │
│ Reputation          │ │ Trusted: 5..14                      │
│ Current role        │ │ Core Member: 15..29                 │
│ Next role           │ │ Circle Leader: 30+                  │
└─────────────────────┘ └─────────────────────────────────────┘
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
│ READONLY COMMUNITY CONTEXT                                   │
│ Community name / Circle ID / member count / wallet status    │
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
│ Review cards                                                 │
│ - linked contribution                                        │
│ - reviewer                                                   │
│ - target                                                     │
│ - tag/message                                                │
│ - active/slashed status                                      │
│ - slash reason if slashed                                    │
│ - [Slash invalid review], admin only                         │
│ Manual endorsement ID input is advanced/debug only           │
│ No reviewer self-cancel in MVP                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SLASH CONFIRMATION / REASON                                  │
│ Reason textarea                                              │
│ Impact warning: target reputation -2, floor 0                │
│ [Confirm slash]                                              │
└──────────────────────────────────────────────────────────────┘
```

## 10. Mobile Layout Notes

On smaller screens:

- collapse multi-column layouts into one column
- keep page header first
- show readonly community context before forms
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
2. Readonly Community Context Card
3. Proof-of-Work Card
4. Post Visibility Notice
5. Peer Review Card
6. Already Endorsed Notice
7. Confirm Peer Review Panel
8. Journey Checklist
9. Reputation / Role Progress Card
10. Transaction Status Card
11. Leaderboard Table
12. Admin Moderation Queue
13. Joined Communities Switcher

## 12. Wireframe Acceptance Checklist

The screen structure is acceptable when:

- each page has one clear purpose
- current wallet/profile state is visible where needed
- current community context is visible on circle-scoped pages
- technical IDs are metadata, not primary inputs
- the primary CTA changes based on user state
- empty states guide users to the next step
- proof-of-work cards and review cards feel social
- post submit has visible submitted/checking/visible/not-visible/failed states
- Review Work has Already endorsed and confirmation states
- Review Work never shows fake Cancel endorsement
- admin moderation is card-driven
- technical/testnet state is visible but visually secondary
