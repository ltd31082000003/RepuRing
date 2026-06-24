# RepuRing Screen Wireframes v1

## 0. Purpose

This document gives text-based wireframes for the RepuRing MVP screens.

It is meant for engineering handoff. The goal is not pixel-perfect design. The goal is to make layout hierarchy, component order, page intent, state behavior, and primary actions clear before implementation.

RepuRing is a Social-Fi Web3 app for contributor communities on Canopy testnet/local Canopy environment.

Core loop:

```text
Identity → Circle → Proof-of-Work → Peer Endorsement → Reputation → Role / Status
```

## 1. UI Design System Notes

These wireframes must follow the shared UI design system.

### Typography hierarchy

| Text type | Size | Weight | Wireframe meaning |
| --- | --- | --- | --- |
| Page title | Desktop: 32-40px; Mobile: 28-32px | 700/800 | Main title in Page Header |
| Section title | 20-24px | 700 | Panel or major section title |
| Card title | 16-18px | 600/700 | Contribution title, community name, review title |
| Body text | 14-16px | 400/500 | Descriptions and helper copy |
| Small metadata | 12-13px | 400/500 | Wallet address, Circle ID, onchain record ID, tx badge |
| Button text | 14px | 600 | Button labels |

Technical metadata must stay visually secondary. Circle ID, Contribution ID, Endorsement ID, wallet address, tx hash, and tx name must not be larger or more prominent than contribution/community/review titles.

### Layout order

Default screen order:

```text
Page Header
→ Current Context / Active Wallet Banner
→ Primary page action
→ Supporting panels
→ Technical status
```

Technical status should sit near the end of the page or in a secondary area, not above the primary product action.

### Spacing

| Layout token | Value |
| --- | --- |
| Page vertical gap | 24-32px |
| Panel padding | Desktop: 20-24px; Mobile: 16px |
| Card gap | 12-16px |
| Grid gap | 16-20px |
| Button group gap | 8-12px |

### Responsive

Mobile:

- 1 column
- buttons full width when inside form/action blocks
- metadata wraps or break-all
- avoid horizontal scroll

Desktop:

- use 2-column layouts where useful
- primary action left/top
- supporting info right/bottom

### Shared components used by wireframes

- `PageHeader`
- `ActiveWalletBanner`
- `CommunityContextCard`
- `MetricCard`
- `StatusPill`
- `Badge`
- `SocialCard`
- `ContributionCard`
- `ReviewCard`
- `RoleProgressCard`
- `EmptyState`
- `TxStatusCard`
- `ActionGate`
- `ConfirmationPanel`
- `PostVisibilityNotice`
- `GeneratedRecordIdBlock`

## 2. Global Layout Pattern

Each RepuRing screen should follow this structure where possible:

```text
[Top navigation]

[PageHeader]
- eyebrow
- page title
- short product explanation
- primary page actions

[CommunityContextCard / ActiveWalletBanner]
- community name
- Circle ID as readonly metadata
- member count
- current wallet status
- next action when needed

[Primary page action]
- page-specific form/feed/table/cards

[Supporting panels]
- reputation/role/help/secondary data

[TxStatusCard]
- RPC state
- last transaction
- refresh action
```

Product information should come before technical status.

Circle-scoped screens must include readonly current community context near the top of the page.

Technical IDs appear as metadata, not primary inputs.

Technical status appears after product context and main action areas.

## 3. Page Responsibility Map

### Community Workspace

Role:

```text
Dashboard / overview / navigation hub
```

Allowed:

- recent contributions
- recent reviews
- leaderboard preview
- role preview
- admin shortcut
- joined communities switcher

Not allowed as full workflows:

- full contribution management
- full review flow
- full moderation flow
- full leaderboard table

Buttons must route to specialist pages:

- Post proof-of-work → `/repuring/contributions`
- Review work → `/repuring/endorse`
- View leaderboard → `/repuring/leaderboard`
- Open moderation → `/repuring/admin`

### Post Work

Role:

```text
Full proof-of-work feed + posting surface
```

Main page for:

- posting proof-of-work
- filtering contributions
- showing full contribution list
- showing post visibility state
- review CTA

### Review Work

Role:

```text
Full endorsement workflow
```

Main page for:

- selecting a contribution
- checking own/already/slashed state
- writing a review
- confirming endorsement
- showing already-endorsed state

### Admin

Role:

```text
Full moderation workflow
```

Main page for:

- selecting a review card
- confirming slash impact
- entering slash reason
- showing moderation queue

## 4. `/repuring` — Overview Wireframe

### Intent

Orient the user and show the next step in the Social-Fi journey.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Eyebrow: RepuRing / Social-Fi on Canopy                     │
│ Page title: Onchain Social-Fi for Web3 contributors          │
│ Body: Create identity, join circles, post proof, get         │
│       reviewed, build reputation, claim role.                │
│ Badges: Social-Fi / Contribution Network / Canopy Testnet    │
│ CTAs: [Open Community] [Create Profile] [Discover Circles]   │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────┐
│ SocialCard          │ │ CommunityContextCard│
│ CURRENT PROFILE     │ │ CURRENT COMMUNITY   │
│ Avatar              │ │ Card title: name    │
│ Card title: user    │ │ Small metadata: ID  │
│ Status badge        │ │ Member/admin status │
└─────────────────────┘ └─────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ MetricCard │ │ MetricCard │ │ MetricCard │ │ MetricCard │
│ Wallet     │ │ Reputation │ │ Role       │ │ Reviews    │
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
│ TxStatusCard                                                 │
│ Canopy testnet readiness / RPC status / Last transaction     │
│ [Refresh]                                                    │
└──────────────────────────────────────────────────────────────┘
```

## 5. `/key-management` — My Account Wireframe

### Intent

Create/select wallet and create/update contributor profile.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: My Account                                      │
│ Body: Select a local signing wallet and manage your          │
│       RepuRing contributor profile.                          │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ LOCAL WALLETS       │ │ ActiveWalletBanner                  │
│ - Wallet list       │ │ Address as small metadata           │
│ - Create key        │ │ Status: selected / not selected     │
│ - Select key        │ │ Password input for signing          │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CONTRIBUTOR PROFILE                                          │
│ If no profile: username / bio / avatar / [Create profile]    │
│ If profile: preview / bio / avatar / [Update profile]        │
└──────────────────────────────────────────────────────────────┘
```

## 6. `/repuring/circles` — Discover Circles Wireframe

### Intent

Create, discover, join, and open community circles.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: Community Circles                               │
│ Body: Create or join Web3 contributor communities where      │
│       proof-of-work becomes reputation.                      │
│ CTAs: [Create circle] [Refresh circles]                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ActiveWalletBanner / CommunityContextCard                    │
│ Wallet/profile status / selected circle / membership status  │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CREATE CIRCLE       │ │ DISCOVER CIRCLES                    │
│ Name                │ │ SocialCard / Community card         │
│ Suggested ID        │ │ - card title: community name        │
│ Description         │ │ - body: description                 │
│ [Create community]  │ │ - small metadata: Circle ID         │
│ Advanced: manual ID │ │ - creator / member count            │
│                     │ │ - status badge                      │
│                     │ │ - [Join] / [Open community]         │
└─────────────────────┘ └─────────────────────────────────────┘
```

## 7. `/repuring/community` — Community Workspace Wireframe

### Intent

Dashboard / overview / navigation hub for a selected community.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: <circle name>                                   │
│ Body: <circle description>                                  │
│ Status: Creator / Joined / Not joined / No profile           │
│ CTAs: [Refresh] [Post Work] [Review Work] [Leaderboard]      │
│      [Admin], if creator                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CommunityContextCard                                         │
│ Community name / Circle ID / member count / current status   │
│ [Change community]                                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ActiveWalletBanner                                           │
│ Avatar / username / address / member status / next action    │
└──────────────────────────────────────────────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ MetricCard │ │ MetricCard │ │ MetricCard │ │ MetricCard │ │ MetricCard │
│ Members    │ │ Proofs     │ │ Reviews    │ │ Your Rep   │ │ Your Role  │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ Supporting panels   │ │ Preview panels                      │
│ Joined communities  │ │ Recent ContributionCard list         │
│ Member list         │ │ Recent ReviewCard list               │
│ RoleProgressCard    │ │ Leaderboard preview                  │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TxStatusCard                                                 │
└──────────────────────────────────────────────────────────────┘
```

### Responsibility reminder

Community Workspace shows previews and routes users to specialist pages. It should not contain the full contribution form, full endorsement confirmation, full moderation queue, or full leaderboard table.

## 8. `/repuring/contributions` — Proof Feed Wireframe

### Intent

Full proof-of-work feed + posting surface.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: Proof-of-Work Feed                              │
│ Body: Post useful work so peers can review it and help       │
│       you build reputation.                                  │
│ CTA: [Refresh feed]                                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CommunityContextCard                                         │
│ Community name / Circle ID / member count / wallet status    │
│ [Change community]                                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ POST PROOF FORM     │ │ CONTRIBUTION FEED                   │
│ Title               │ │ [Feed Count]                        │
│ Description         │ │ Showing X of Y contributions        │
│ Proof URL           │ │ [Show more]                         │
│ Category            │ │                                     │
│                     │ │ ContributionCard:                   │
│ GeneratedRecordId   │ │ - card title: contribution title    │
│ Block               │ │ - category badge                    │
│ - Onchain record ID │ │ - body: description                 │
│ - <generated id>    │ │ - proof URL                         │
│ - [Regenerate ID]   │ │ - endorsement count                 │
│ - Advanced custom ID│ │ - status badge                      │
│                     │ │ - small metadata: record ID         │
│ [Post proof]        │ │ - [Review this work]                │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ PostVisibilityNotice                                         │
│ Possible states:                                             │
│ - Contribution submitted. Checking feed...                   │
│ - Contribution posted and visible in feed.                   │
│ - Submitted but not visible yet. Refresh again.              │
│ - Failed: <friendly error>                                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ EXISTING REVIEWS / COMMENTS FOR SELECTED CONTRIBUTION        │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TxStatusCard                                                 │
└──────────────────────────────────────────────────────────────┘
```

## 9. `/repuring/endorse` — Review Work Wireframe

### Intent

Full endorsement workflow.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: Review Work                                     │
│ Body: Review useful proof-of-work from other members.        │
│      Valid peer reviews increase the author's reputation.    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CommunityContextCard                                         │
│ Community name                                               │
│ Circle ID as small metadata                                  │
│ Member count                                                 │
│ Current wallet status                                        │
│ [Change community]                                           │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CONTRIBUTION PICKER │ │ SELECTED CONTRIBUTION               │
│ ContributionCard    │ │ Card title: contribution title      │
│ - author            │ │ Author                              │
│ - title             │ │ Body: description                   │
│ - category          │ │ Proof URL                           │
│ - status badge:     │ │ Endorsement count                   │
│   Slashed / Own     │ │ Status                              │
│   work / Already    │ │ Small metadata: Onchain record ID   │
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
│ ConfirmationPanel                                            │
│ Section title: Confirm Peer Review                           │
│ Contribution title                                           │
│ Small metadata: Onchain record ID                            │
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
│ ReviewCard list, active/slashed status, messages             │
└──────────────────────────────────────────────────────────────┘
```

## 10. `/repuring/leaderboard` — Leaderboard Wireframe

### Intent

Show visible social capital and role/status rankings.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: Reputation Leaderboard                          │
│ Body: See contributors ranked by reputation in the selected  │
│       community context.                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CommunityContextCard + global reputation notice              │
│ MVP uses global profile reputation shown in this community.  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ LEADERBOARD TABLE                                            │
│ Rank | Contributor | Reputation | Role | Claimed?            │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ YOUR STATUS         │ │ RoleProgressCard / thresholds        │
│ Rank                │ │ Newbie: 0..4                        │
│ Reputation          │ │ Trusted: 5..14                      │
│ Current role        │ │ Core Member: 15..29                 │
│ Next role           │ │ Circle Leader: 30+                  │
└─────────────────────┘ └─────────────────────────────────────┘
```

## 11. `/repuring/admin` — Admin Wireframe

### Intent

Full moderation workflow.

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│ Page title: Admin & Role                                    │
│ Body: Claim your community role and moderate invalid reviews │
│       if you are the circle creator/admin.                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ CommunityContextCard                                         │
│ Community name / Circle ID / member count / wallet status    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ ADMIN ELIGIBILITY CARD                                       │
│ Status: Creator/Admin OR Member only OR Not member           │
│ Explanation and next action                                  │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐ ┌─────────────────────────────────────┐
│ CLAIM ROLE          │ │ RoleProgressCard                    │
│ Current reputation  │ │ Threshold cards                     │
│ Derived role        │ │ Next role needed points             │
│ [Claim role]        │ │                                     │
└─────────────────────┘ └─────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ MODERATION QUEUE                                             │
│ ReviewCard list                                              │
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
│ ConfirmationPanel                                            │
│ Reason textarea                                              │
│ Impact warning: target reputation -2, floor 0                │
│ [Confirm slash]                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ TxStatusCard                                                 │
└──────────────────────────────────────────────────────────────┘
```

## 12. Mobile Layout Notes

On smaller screens:

- collapse multi-column layouts into one column
- keep page header first
- show readonly community context before forms
- show active wallet/community context before forms
- show primary CTA near the top and again near relevant form
- buttons inside forms/action blocks should be full width
- contribution/review cards should be full width
- metadata should wrap or use break-all
- tables should become stacked cards if needed
- avoid horizontal scroll

Mobile priority order:

```text
Context
→ Primary action
→ Feed/data
→ Supporting metrics
→ Testnet status
```

## 13. Component Priority

If implementation time is limited, prioritize components in this order:

1. PageHeader
2. ActiveWalletBanner
3. CommunityContextCard
4. ContributionCard
5. PostVisibilityNotice
6. GeneratedRecordIdBlock
7. ReviewCard
8. Already Endorsed Notice
9. ConfirmationPanel
10. Journey Checklist
11. RoleProgressCard
12. MetricCard
13. StatusPill / Badge
14. EmptyState
15. TxStatusCard
16. Admin Moderation Queue
17. Joined Communities Switcher

## 14. Wireframe Acceptance Checklist

The screen structure is acceptable when:

- each page has one clear purpose
- current wallet/profile state is visible where needed
- current community context is visible on circle-scoped pages
- technical IDs are metadata, not primary inputs
- page title, section title, card title, body text, metadata, and button text follow the typography hierarchy
- technical IDs/addresses/tx hashes are never visually stronger than content titles
- the primary CTA changes based on user state
- empty states guide users to the next step
- proof-of-work cards and review cards feel social
- post submit has visible submitted/checking/visible/not-visible/failed states
- Review Work has Already endorsed and confirmation states
- Review Work never shows fake Cancel endorsement
- admin moderation is card-driven
- Community Workspace remains a dashboard/navigation hub, not a duplicate full workflow page
- technical/testnet state is visible but visually secondary
