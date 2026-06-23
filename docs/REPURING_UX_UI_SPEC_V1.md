# RepuRing UX/UI Specification v1

## 0. Scope

This document defines the user experience and interface behavior for RepuRing MVP.

RepuRing is a Social-Fi Web3 app for contributor communities on the Canopy test network. The UX must make the product feel like a real Social-Fi contribution network, not only a blockchain transaction demo.

The implementation team should preserve the existing protocol concepts while improving product clarity, flow, and usability.

## 1. UX North Star

The user should always understand three things:

1. Who am I in RepuRing?
2. Which community circle am I acting inside?
3. What is the next action that moves me toward reputation and role/status?

The UX should guide users through this loop:

```text
Create profile
→ Join or create community circle
→ Post proof-of-work
→ Receive peer review / endorsement
→ Build reputation
→ Claim role/status
```

## 2. UX Principles

### 2.1 Product language first

Use user-facing product language first. Keep transaction/protocol language secondary.

Good:

- Create profile
- Join community
- Post proof-of-work
- Review work
- Claim role
- Slash invalid review

Avoid making transaction names the primary CTA:

- Submit CreateProfileTx
- Send EndorseContributionTx
- Execute SlashEndorsementTx

Transaction names can appear as small technical badges, status logs, or advanced details.

### 2.2 Never show a dead-end

If the user cannot do something, explain why and show the next valid action.

Examples:

- No wallet selected → show `Select wallet`.
- Wallet selected but no profile → show `Create profile`.
- Profile exists but user is not a member → show `Join community`.
- User tries to review own work → show `Switch wallet to review this contribution`.

### 2.3 Community context must be visible

Every RepuRing page must show or imply the selected community circle.

The user should never wonder which circle their contribution, endorsement, leaderboard, or role action applies to.

### 2.4 The Community Workspace is the product center

`/repuring/community` should become the main post-onboarding surface.

Other pages can exist as focused action routes, but the user should feel like they are acting inside a single community context.

### 2.5 Keep Canopy testnet visible but not dominant

The app runs on Canopy testnet/local Canopy environment. The UX can show RPC readiness and transaction status, but this should not overpower the product journey.

Developer/testnet details should live in:

- status cards
- collapsible panels
- technical badges
- last transaction details

The main product surfaces should emphasize identity, community, proof, review, reputation, and role.

## 3. Global Navigation

Recommended top-level navigation:

```text
Overview
My Account
Circles
Community
Post Work
Review Work
Leaderboard
Admin
```

Route mapping:

| Navigation label | Route | Purpose |
| --- | --- | --- |
| Overview | `/repuring` | Product status and next step |
| My Account | `/key-management` | Wallet/profile setup |
| Circles | `/repuring/circles` | Discover/create/join communities |
| Community | `/repuring/community` | Main workspace |
| Post Work | `/repuring/contributions` | Create/browse proof-of-work |
| Review Work | `/repuring/endorse` | Review/endorse contributions |
| Leaderboard | `/repuring/leaderboard` | Reputation ranking and role status |
| Admin | `/repuring/admin` | Moderation and role claim actions |

The navigation should visually mark the active route.

## 4. Global Layout Requirements

Each RepuRing page should include:

1. Page header with clear title and short explanation.
2. Current wallet/profile context when relevant.
3. Current circle context when relevant.
4. Primary action area.
5. State/status area.
6. Empty-state fallback if data is missing.

Recommended layout order:

```text
Page Header
→ Context Banner
→ Main Action / Main Data
→ Supporting Panels
→ Technical Status / Last Transaction
```

## 5. Shared UI Components

### 5.1 Page Header

Purpose:

- tell the user where they are
- explain what the page does
- show page-level actions

Content:

- eyebrow label
- title
- short copy
- one to three action buttons

Example:

```text
Eyebrow: Community Workspace
Title: Pharos Builders
Copy: View members, proof-of-work, peer reviews, leaderboard, and role status for this community.
Actions: Refresh community / Post work / Review work / View leaderboard
```

### 5.2 Active Wallet Banner

Purpose:

- show current wallet/profile state
- prevent users from submitting actions with the wrong wallet

States:

| State | UI message | Primary action |
| --- | --- | --- |
| No wallet | Select a wallet to start using RepuRing. | Select wallet |
| Wallet, no profile | Create your contributor profile before joining communities. | Create profile |
| Profile, not member | Join this community before posting or reviewing work. | Join community |
| Member | You are active in this community. | Continue |
| Creator/admin | You are the creator/admin of this community. | Open moderation |

### 5.3 Community Context Card

Purpose:

- show selected circle
- show member count
- show whether user is member/admin

Content:

- circle name
- circle ID
- description
- creator/admin address
- member count
- current user status

### 5.4 Proof-of-Work Card

Purpose:

- display contribution content in feed

Required fields:

- title
- category badge
- author username/address
- description
- proof URL
- endorsement count
- slashed/active status
- review CTA

Primary actions:

- View proof
- Review this work

Disabled states:

- Own work → `Own work - switch wallet to review`
- Not member → `Join to review`
- Slashed → `Review disabled`

### 5.5 Peer Review Card

Purpose:

- display endorsement as social review/comment

Required fields:

- reviewer address/username if available
- target contributor
- linked contribution title/ID if available
- tag
- message
- status active/slashed
- slash reason if slashed

Admin action:

- Slash review

Non-admin behavior:

- show read-only review status

### 5.6 Reputation / Role Progress Card

Purpose:

- make reputation feel like progression, not just a number

Required fields:

- current global reputation
- current derived role
- next role threshold
- points needed to next role
- role thresholds

Important wording:

```text
Global reputation is used to claim a role in the selected community.
```

### 5.7 Transaction Status Card

Purpose:

- show Canopy testnet transaction/query state without dominating the UX

Content:

- current RPC status
- last transaction response or hash/string
- refresh button
- warning if local/testnet RPC is unavailable

Do not show raw technical errors as the only explanation. Pair them with user-friendly text.

## 6. Page-by-Page UX

## 6.1 `/repuring` — Overview

### Page goal

Introduce RepuRing, summarize user status, and guide the next action.

### Primary user questions

- What is RepuRing?
- Am I connected/selected?
- Do I have a profile?
- Which community am I using?
- What should I do next?

### Required sections

1. Hero / Product Summary
2. Current Profile Summary
3. Current Community Summary
4. Reputation / Role Summary
5. Demo/Testnet Readiness
6. Journey Checklist
7. Quick Actions

### Hero copy direction

Suggested title:

```text
Onchain Social-Fi for Web3 contributors.
```

Suggested description:

```text
Create a contributor identity, join a community circle, post proof-of-work, get peer-reviewed, build reputation, and claim community status on Canopy testnet.
```

### Journey checklist

Steps:

1. Select wallet
2. Create profile
3. Create or join community circle
4. Open community workspace
5. Post proof-of-work
6. Review another member's work
7. Build reputation
8. Claim role/status
9. Moderate invalid reviews if admin

Each step has status:

- Done
- Next
- Locked
- Optional

### Empty states

No wallet:

```text
Select a local signing wallet to start your RepuRing journey.
```

No profile:

```text
Create your contributor profile before joining communities or posting proof-of-work.
```

No circle:

```text
Create or join a community circle to start building reputation.
```

## 6.2 `/key-management` — My Account / Profile

### Page goal

Let the user create/select local signing keys and create/update their RepuRing profile.

### Required sections

1. Local Wallet Selection
2. Current Wallet Details
3. Create Profile Form
4. Update Profile Form
5. RepuRing Profile Preview

### Profile form fields

- username
- bio
- avatar URL

### UX rules

- If wallet is not selected, profile form should be disabled or hidden behind guidance.
- If profile already exists, show update form instead of create form.
- Username should be treated as permanent in MVP if protocol does not support changing it.
- Bio/avatar can be editable.

### Success message

```text
Profile submitted. Your contributor identity will appear after Canopy state refresh.
```

### Error message examples

- Username is required.
- This wallet already has a profile.
- Username is already taken.
- Signing failed. Check wallet password.

## 6.3 `/repuring/circles` — Discover Circles

### Page goal

Let users create, discover, join, and open community circles.

### Required sections

1. Selected Community Context
2. Create Community Circle
3. Discover Circles
4. Joined / Created Circles
5. Advanced Manual Circle ID Input

### Create circle form fields

- community name
- community ID
- description

### UX recommendation

The UI should generate a suggested community ID from the name.

Example:

```text
Community name: Pharos Builders
Suggested ID: pharos-builders
```

The user can edit the ID in advanced mode.

### Circle card fields

- name
- circle ID
- description
- creator/admin
- member count
- current status: Creator / Joined / Not joined

### Circle card actions

| User state | Action |
| --- | --- |
| No wallet | Select wallet |
| No profile | Create profile |
| Not joined | Join community |
| Joined | Open community |
| Creator | Open admin / Open community |

### Empty state

```text
No community circles found yet. Create the first circle to start the Social-Fi loop.
```

## 6.4 `/repuring/community` — Community Workspace

### Page goal

This is the main product workspace for a selected circle.

### Required sections

1. Community Identity Header
2. Active Wallet / Member Status Banner
3. Metrics Row
4. Member List
5. Recent Proof-of-Work Feed
6. Recent Peer Reviews
7. Leaderboard Preview
8. Reputation / Role Progress
9. Admin Moderation Shortcut
10. Joined Communities Switcher

### Metrics row

Recommended metrics:

- Members
- Contributions
- Reviews
- Your reputation
- Your role

### Primary actions

- Refresh community
- Post proof-of-work
- Review work
- View leaderboard
- Claim role
- Open moderation, admin only

### Community switching

If the user belongs to multiple circles, show a joined communities panel.

Switching a community should update:

- selected circle ID
- contribution feed
- reviews
- leaderboard
- role context
- admin state

Show confirmation:

```text
Community switched. Contributions, reviews, leaderboard, and role actions now use this community.
```

### Empty state: selected community not found

```text
Selected community not found. Discover or create a community circle to continue.
```

### Empty state: no contributions

```text
No proof-of-work has been posted yet. Be the first member to contribute.
```

### Empty state: not a member

```text
Join this community before posting proof-of-work or reviewing contributions.
```

## 6.5 `/repuring/contributions` — Proof Feed / Post Work

### Page goal

Let members post proof-of-work and browse existing contributions.

### Required sections

1. Current Community Context
2. Post Proof-of-Work Form
3. Contribution Feed
4. My Contributions Filter or Section
5. Reviews Under Contribution, if available

### Form fields

Required:

- title
- description
- proof URL
- category

Advanced/dev-only:

- contribution ID

### UX recommendation

Auto-generate contribution ID in normal UI.

Suggested algorithm behavior for design handoff:

```text
slug(title) + short timestamp or random suffix
```

Example:

```text
wrote-pharos-testnet-guide-8472
```

This avoids making users manually invent IDs.

### Category selector

Use a select/dropdown or segmented control:

- builder
- helper
- creator
- researcher
- tester
- educator

Each category should include helper text:

- builder: code, integrations, technical work
- helper: community support or onboarding
- creator: content, visuals, media
- researcher: analysis, reports, ecosystem research
- tester: bug reports, QA, testnet testing
- educator: guides, tutorials, learning resources

### Proof URL behavior

Proof URL should be clearly described:

```text
Link to GitHub PR, article, guide, tweet, issue, demo, test report, or other proof.
```

### Submit CTA

```text
Post proof-of-work
```

Secondary technical badge:

```text
CreateContributionTx
```

### Disabled states

| State | Message | Action |
| --- | --- | --- |
| No wallet | Select a wallet before posting work. | Select wallet |
| No profile | Create a profile before posting work. | Create profile |
| Not member | Join this community before posting work. | Join community |
| No circle | Select or create a community circle first. | Discover circles |

### Success message

```text
Proof-of-work submitted. It will appear in the feed after Canopy state refresh.
```

## 6.6 `/repuring/endorse` — Review Work

### Page goal

Let members review and endorse useful work from other members.

### Required sections

1. Current Community Context
2. Selected Contribution Preview
3. Contribution Picker / Feed
4. Review Form
5. Existing Reviews
6. Reputation Impact Explanation

### Review form fields

- tag
- review message

### Review tag selector

MVP uses existing tags:

- builder
- helper
- creator
- leader
- trusted

UI helper text should explain them as review intent, not protocol internals.

Suggested labels:

- builder: strong technical contribution
- helper: useful community help
- creator: valuable creative/content work
- leader: high-impact contribution
- trusted: verified useful work

### Reputation impact copy

```text
A valid peer endorsement gives +1 global reputation to the contribution author.
```

### Submit CTA

```text
Submit peer review
```

Secondary technical badge:

```text
EndorseContributionTx
```

### Disabled states

| State | Message | Action |
| --- | --- | --- |
| No wallet | Select a wallet before reviewing work. | Select wallet |
| No profile | Create a profile before reviewing work. | Create profile |
| Not member | Join this community before reviewing work. | Join community |
| Own contribution | You cannot review your own work. Switch to another member account. | Switch wallet |
| Already reviewed | You already endorsed this contribution. | View reviews |
| Slashed contribution | Review is disabled for slashed work. | None |

### Success message

```text
Review submitted. The author gains reputation after Canopy state refresh.
```

## 6.7 `/repuring/leaderboard` — Reputation Rankings

### Page goal

Show social capital and role/status visibility.

### Required sections

1. Current Community Context
2. Leaderboard Table
3. Role Threshold Explanation
4. Current User Rank Card, if available
5. Global Reputation Notice

### Leaderboard columns

- rank
- contributor username/address
- reputation
- derived role
- claimed role status if available

### Required notice

```text
MVP leaderboard uses global profile reputation displayed in the selected community context. Circle-specific reputation is planned for a later version.
```

### Empty state

```text
No ranked contributors yet. Members will appear after profiles and endorsements are loaded.
```

## 6.8 `/repuring/admin` — Admin / Moderation

### Page goal

Let circle creator/admin protect the reputation economy by slashing invalid reviews.

### Required sections

1. Admin Eligibility Card
2. Role Claim Card
3. Moderation Queue
4. Slashed Review History or Status
5. Last Transaction / Status

### Eligibility states

| State | UI behavior |
| --- | --- |
| No wallet | Ask user to select wallet |
| No profile | Ask user to create profile |
| Not member | Ask user to join community before role claim |
| Member, not creator | Can claim role, cannot slash |
| Creator/admin | Can claim role and moderate reviews |

### Moderation queue card fields

- endorsement ID, technical but can be collapsed
- linked contribution
- reviewer
- target contributor
- tag
- message
- current status
- slash reason, if already slashed

### Slash action

The admin should click a review card and enter a reason.

Do not make manual endorsement ID entry the primary moderation experience.

CTA:

```text
Slash invalid review
```

Reason placeholder:

```text
Explain why this endorsement is invalid, spam, or abusive.
```

### Slash confirmation

Before submit:

```text
This will mark the review as slashed and reduce the target contributor's reputation by 2, floored at 0.
```

### Success message

```text
Review slashed. Reputation and endorsement count will update after Canopy state refresh.
```

## 7. Loading, Error, and Refresh Behavior

### 7.1 Loading state

Use skeleton cards or simple placeholders. Avoid blank screens.

Example:

```text
Loading Canopy state...
```

### 7.2 RPC unavailable

Show:

```text
Canopy RPC is not reachable. Start the local/testnet RPC services and refresh.
```

Include technical ports only in detail:

```text
Query/tx RPC: 50002
Admin/keystore RPC: 50003
```

### 7.3 Transaction pending

Show:

```text
Transaction submitted. Waiting for Canopy state refresh...
```

### 7.4 Transaction failed

Show product-level explanation first, raw error second.

Example:

```text
Could not post proof-of-work. Make sure you are a member of the selected community and your wallet password is correct.
Technical detail: <error>
```

## 8. Visual Design Direction

The current dark Social-Fi style can be preserved.

Recommended mood:

- dark Web3 dashboard
- neon/gradient accents
- glass panels
- badge-heavy social proof
- clear cards for contributions/reviews
- strong active state for selected community

Visual hierarchy:

1. Current identity and community context
2. Primary action
3. Social feed/reviews/leaderboard
4. Technical status

Avoid letting technical RPC and transaction details dominate the page.

## 9. Copy Style

Tone:

- clear
- direct
- Web3-native but not overly technical
- product-first
- honest about testnet/MVP limits

Preferred words:

- community
- contributor
- proof-of-work
- peer review
- endorsement
- reputation
- role
- status
- Canopy testnet

Avoid overusing:

- transaction
- raw state
- custom plugin
- protobuf
- RPC
- hash

These can appear in technical notes only.

## 10. UX Acceptance Checklist

Before considering the UX implementation done, verify:

- User can understand RepuRing from the overview page.
- User can see the next required action at every step.
- User never has to memorize a circle ID for normal flow.
- User never has to manually create a contribution ID in normal flow.
- User can post proof-of-work from a joined circle.
- User can review another member's work.
- User cannot review their own contribution.
- User can see reputation and role progress.
- Admin can slash from a review card.
- Non-admin can understand why moderation is disabled.
- Canopy testnet/RPC status is visible but not the product focus.
- Product language is used before protocol language.
