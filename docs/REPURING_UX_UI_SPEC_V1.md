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

Every RepuRing circle-scoped page must show the selected community circle.

The user should never wonder which circle their contribution, endorsement, leaderboard, or role action applies to.

Circle-scoped pages must use the current community context. Review Work, Contributions, Leaderboard, Role, and Admin pages should not maintain independent manual circle IDs in normal UI.

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

### 2.6 Never show fake protocol actions

The UI must not offer actions that the current protocol cannot execute.

Examples:

- Do not show Cancel endorsement unless a real withdraw endorsement transaction exists.
- Do not invite duplicate endorsement if the current wallet already endorsed the selected contribution.
- Do not show manual Circle ID editing on Review Work if the page is supposed to use current community context.

If a user expects an unsupported action, explain the protocol limitation and show the supported correction path.

Required unsupported-action wording:

```text
This action is not supported in the current MVP protocol.
```

For invalid endorsements, the supported MVP correction path is creator/admin moderation through `SlashEndorsementTx`.

### 2.7 Technical IDs are metadata

Normal users should not manually create or memorize technical IDs.

Rules:

- Circle ID may appear as readonly current community metadata.
- Contribution ID should be generated automatically and shown as Onchain record ID.
- Endorsement ID should appear only as moderation/technical metadata.
- Manual ID input belongs in advanced/debug sections only.

## 3. UI Design System

This section defines the reusable UI rules for RepuRing MVP. Devs should build or preserve shared components instead of rewriting UI patterns separately on each page.

### 3.1 Typography

| Text type | Size | Weight | Usage |
| --- | --- | --- | --- |
| Page title | Desktop: 32-40px; Mobile: 28-32px | 700/800 | Main page header title |
| Section title | 20-24px | 700 | Large panels and major sections |
| Card title | 16-18px | 600/700 | Contribution title, community name, review title |
| Body text | 14-16px | 400/500 | Descriptions and main helper text |
| Small metadata | 12-13px | 400/500 | Wallet address, onchain record ID, Circle ID, tx badge |
| Button text | 14px | 600 | Primary and secondary buttons |

Important hierarchy rule:

> Technical IDs, addresses, and tx hashes must not be visually larger or more prominent than the main content.

Contribution, community, and review titles must stand out more than Circle ID, Contribution ID, Endorsement ID, wallet address, tx name, or tx hash.

### 3.2 Layout System

Default page layout order:

```text
Page Header
→ Current Context / Active Wallet Banner
→ Primary page action
→ Supporting panels
→ Technical status
```

Spacing:

| Layout token | Value |
| --- | --- |
| Page vertical gap | 24-32px |
| Panel padding | Desktop: 20-24px; Mobile: 16px |
| Card gap | 12-16px |
| Grid gap | 16-20px |
| Button group gap | 8-12px |

Responsive behavior:

Mobile:

- 1 column layout
- buttons full width when inside form/action blocks
- metadata wraps or uses break-all
- avoid horizontal scroll

Desktop:

- 2 column layout where useful
- primary action left/top
- supporting info right/bottom

### 3.3 Shared Component Reuse

Devs should build or preserve these shared components:

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

Component responsibilities:

#### PageHeader

Used at the top of each page. It owns the page eyebrow, title, short explanation, and page-level action group.

#### ActiveWalletBanner

Used when user identity or signing state matters. It shows selected wallet, profile status, membership status, and the next required action.

#### CommunityContextCard

Used on every circle-scoped page. It shows readonly current community context and must not introduce manual Circle ID input in normal flow.

#### ContributionCard

Used to display proof-of-work in Community preview, Post Work feed, and Review Work selector.

The card structure should stay consistent, but actions may differ by page:

- Community preview: `View` / `Review this work`
- Post Work feed: `View proof` / `Review this work`
- Review Work selector: `Select` with status badge

#### ReviewCard

Used to display endorsements in Community recent reviews, Contribution detail/reviews, and Admin moderation queue.

The card structure should stay consistent, but admin mode adds slash actions:

- Normal version: read-only
- Admin version: `Slash invalid review`

#### RoleProgressCard

Used wherever reputation and role progression are explained. It must use global reputation wording for MVP.

#### TxStatusCard

Always secondary. It should sit near the end of the page or in a secondary area.

TxStatusCard must not be visually placed above product context or primary product action.

#### ActionGate

Used to block actions based on missing requirements, such as no wallet, no profile, not member, own contribution, already endorsed, or RPC unavailable.

#### ConfirmationPanel

Used before irreversible or important protocol actions, especially peer endorsement and slash moderation.

#### PostVisibilityNotice

Used after `CreateContributionTx` to show submitted/checking/visible/not-visible-yet/failed states.

#### GeneratedRecordIdBlock

Used in Post Work to show generated Contribution ID as readonly technical metadata, with regenerate and advanced/custom override options.

### 3.4 Page Responsibility Rules

Pages must not duplicate full workflows from other specialist pages.

#### Community Workspace

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

Should not do:

- full contribution management
- full review flow
- full moderation flow
- full leaderboard table

Buttons must route to specialist pages:

- Post proof-of-work → `/repuring/contributions`
- Review work → `/repuring/endorse`
- View leaderboard → `/repuring/leaderboard`
- Open moderation → `/repuring/admin`

#### Post Work

Role:

```text
Full proof-of-work feed + posting surface
```

This is the main page for:

- posting proof-of-work
- filtering contributions
- showing full contribution list
- showing post visibility state
- review CTA

#### Review Work

Role:

```text
Full endorsement workflow
```

This is the main page for:

- selecting a contribution
- checking own/already/slashed state
- writing a review
- confirming endorsement
- showing already-endorsed state

#### Admin

Role:

```text
Full moderation workflow
```

This is the main page for:

- selecting a review card
- confirming slash impact
- entering slash reason
- showing moderation queue

## 4. Global Navigation

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

## 5. Global Layout Requirements

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

## 6. Shared UI Components

### 6.1 Page Header

Purpose:

- tell the user where they are
- explain what the page does
- show page-level actions

### 6.2 Active Wallet Banner

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

### 6.3 Community Context Card

Purpose:

- show selected circle
- show member count
- show whether user is member/admin
- expose Circle ID as readonly metadata only

### 6.4 Proof-of-Work Card

Required fields:

- title
- category badge
- author username/address
- description
- proof URL
- endorsement count
- slashed/active status
- generated onchain record ID as readonly metadata
- review CTA

Disabled states:

- Own work → `Own work - switch wallet to review`
- Already endorsed → `Already endorsed`
- Not member → `Join to review`
- Slashed → `Review disabled`

### 6.5 Peer Review Card

Required fields:

- reviewer address/username if available
- target contributor
- linked contribution title/ID if available
- tag
- message
- status active/slashed
- slash reason if slashed
- endorsement ID as collapsed technical metadata

Admin action:

- Slash review

Non-admin behavior:

- show read-only review status
- do not show reviewer self-cancel

### 6.6 Reputation / Role Progress Card

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

### 6.7 Transaction Status Card

Content:

- current RPC status
- last transaction response or hash/string
- refresh button
- warning if local/testnet RPC is unavailable

Do not show raw technical errors as the only explanation. Pair them with user-friendly text.

## 7. Page-by-Page UX

## 7.1 `/repuring` — Overview

### Page goal

Introduce RepuRing, summarize user status, and guide the next action.

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

## 7.2 `/key-management` — My Account / Profile

### Page goal

Let the user create/select local signing keys and create/update their RepuRing profile.

### Required sections

1. Local Wallet Selection
2. Current Wallet Details
3. Create Profile Form
4. Update Profile Form
5. RepuRing Profile Preview

### UX rules

- If wallet is not selected, profile form should be disabled or hidden behind guidance.
- If profile already exists, show update form instead of create form.
- Username should be treated as permanent in MVP if protocol does not support changing it.
- Bio/avatar can be editable.

## 7.3 `/repuring/circles` — Discover Circles

### Page goal

Let users create, discover, join, and open community circles.

### Required sections

1. Selected Community Context
2. Create Community Circle
3. Discover Circles
4. Joined / Created Circles
5. Advanced Manual Circle ID Input

### Create circle UX

The UI should generate a suggested community ID from the name.

Example:

```text
Community name: Pharos Builders
Suggested ID: pharos-builders
```

The user can edit the ID only in advanced/debug mode.

### Circle card actions

| User state | Action |
| --- | --- |
| No wallet | Select wallet |
| No profile | Create profile |
| Not joined | Join community |
| Joined | Open community |
| Creator | Open admin / Open community |

## 7.4 `/repuring/community` — Community Workspace

### Page goal

This is the main product workspace for a selected circle.

### Role

```text
Dashboard / overview / navigation hub
```

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

### Allowed content

- recent contributions
- recent reviews
- leaderboard preview
- role preview
- admin shortcut
- joined communities switcher

### Not allowed as full workflows

- full contribution management
- full review flow
- full moderation flow
- full leaderboard table

### Required routing buttons

- Post proof-of-work → `/repuring/contributions`
- Review work → `/repuring/endorse`
- View leaderboard → `/repuring/leaderboard`
- Open moderation → `/repuring/admin`

### Community switching

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

## 7.5 `/repuring/contributions` — Proof Feed / Post Work

### Page goal

Let members post proof-of-work and browse existing contributions.

### Role

```text
Full proof-of-work feed + posting surface
```

This is the main page for:

- posting proof-of-work
- filtering contributions
- showing full contribution list
- showing post visibility state
- review CTA

### Required sections

1. Current Community Context
2. Post Proof-of-Work Form
3. Generated Record ID block
4. Post Visibility Notice
5. Contribution Feed
6. My Contributions Filter or Section
7. Reviews Under Contribution, if available

### Form fields

Required:

- title
- description
- proof URL
- category

Generated metadata:

- contribution ID / onchain record ID

Advanced/debug-only:

- custom contribution ID

### Generated record ID block

```text
Label: Onchain record ID
Value: <generated contribution id>
Helper: This ID is generated for the onchain contribution record.
Action: Regenerate ID
Advanced: custom contribution ID
```

### Post submit feedback

After submit, the page must show visible post feedback near the composer or feed.

Required states:

```text
Contribution submitted. Checking feed...
Contribution posted and visible in the feed.
Contribution submitted but not visible yet. Refresh again or check transaction status.
Failed: <friendly error>
```

The composer must not silently disappear without feedback. If submit fails, keep the composer open and show a friendly error.

### Feed behavior

If the feed can contain many contributions, show a visible count and progressive display:

```text
Showing X of Y contributions
[Show more]
```

Filter empty state must be different from a truly empty feed.

### Submit CTA

```text
Post proof-of-work
```

Secondary technical badge:

```text
CreateContributionTx
```

## 7.6 `/repuring/endorse` — Review Work

### Page goal

Let members review and endorse useful work from other members.

### Role

```text
Full endorsement workflow
```

This is the main page for:

- selecting a contribution
- checking own/already/slashed state
- writing a review
- confirming endorsement
- showing already-endorsed state

### Required sections

1. Readonly Community Context
2. Selected Contribution Preview
3. Contribution Picker / Feed
4. Current Reviewer Endorsement State
5. Review Form
6. Confirmation Panel
7. Existing Reviews
8. Reputation Impact Explanation

### Readonly community context

Review Work must use the current selected community context. It should not ask normal users to type a circle ID.

Show:

- community name
- Circle ID as readonly metadata
- member count
- current wallet/member status
- Change community action

### Contribution selector status badges

Each contribution selector card should show one status badge:

- Slashed
- Own work
- Already endorsed
- Ready to review

### Already endorsed behavior

Review Work must detect whether the current wallet already endorsed the selected contribution.

Behavior:

- show `Already endorsed`
- show the current wallet's existing review
- disable `Review and continue`
- do not show `Cancel endorsement`
- explain that endorsements cannot be self-cancelled in the MVP protocol

Required copy:

```text
You already endorsed this work. Your review is visible below. Endorsements cannot be self-cancelled in the MVP protocol.
```

### Confirmation panel

The confirmation panel must warn:

```text
This endorsement is an onchain attestation. After confirmation, you cannot self-cancel it in the current MVP protocol. Only the circle creator/admin can moderate invalid endorsements.
```

Confirmation content:

- contribution title
- onchain record ID
- author
- community
- tag
- reviewer wallet
- review message
- reputation impact: +1 global reputation to author
- warning: this endorsement cannot be self-cancelled in the current MVP protocol

Actions:

```text
[Confirm endorsement]
[Cancel]
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
| Already reviewed | You already endorsed this contribution. | View review |
| Slashed contribution | Review is disabled for slashed work. | None |

## 7.7 `/repuring/leaderboard` — Reputation Rankings

### Page goal

Show social capital and role/status visibility.

### Required sections

1. Current Community Context
2. Leaderboard Table
3. Role Threshold Explanation
4. Current User Rank Card, if available
5. Global Reputation Notice

### Required notice

```text
MVP leaderboard uses global profile reputation displayed in the selected community context. Circle-specific reputation is planned for a later version.
```

## 7.8 `/repuring/admin` — Admin / Moderation

### Page goal

Let circle creator/admin protect the reputation economy by slashing invalid reviews.

### Role

```text
Full moderation workflow
```

This is the main page for:

- selecting a review card
- confirming slash impact
- entering slash reason
- showing moderation queue

### Required sections

1. Admin Eligibility Card
2. Role Claim Card
3. Moderation Queue
4. Slashed Review History or Status
5. Last Transaction / Status

### Moderation rule

Admin moderation is the MVP correction path for invalid endorsements.

Normal moderation must be card-based:

- select review card
- inspect reviewer, target, contribution, tag, message
- enter slash reason
- confirm reputation impact
- submit `SlashEndorsementTx`

Manual endorsement ID input is advanced/debug only.

### Eligibility states

| State | UI behavior |
| --- | --- |
| No wallet | Ask user to select wallet |
| No profile | Ask user to create profile |
| Not member | Ask user to join community before role claim |
| Member, not creator | Can claim role, cannot slash |
| Creator/admin | Can claim role and moderate reviews |

### Slash confirmation

Before submit:

```text
This will mark the review as slashed and reduce the target contributor's reputation by 2, floored at 0.
```

## 8. Loading, Error, and Refresh Behavior

### 8.1 Loading state

Use skeleton cards or simple placeholders. Avoid blank screens.

Example:

```text
Loading Canopy state...
```

### 8.2 RPC unavailable

Show:

```text
Canopy RPC is not reachable. Start the local/testnet RPC services and refresh.
```

### 8.3 Transaction pending

Show:

```text
Transaction submitted. Waiting for Canopy state refresh...
```

### 8.4 Transaction failed

Show product-level explanation first, raw error second.

Example:

```text
Could not post proof-of-work. Make sure you are a member of the selected community and your wallet password is correct.
Technical detail: <error>
```

## 9. Visual Design Direction

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

## 10. Copy Style

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
- onchain attestation

Avoid overusing:

- transaction
- raw state
- custom plugin
- protobuf
- RPC
- hash

These can appear in technical notes only.

## 11. UX Acceptance Checklist

Before considering the UX implementation done, verify:

- User can understand RepuRing from the overview page.
- User can see the next required action at every step.
- User never has to memorize a circle ID for normal flow.
- User never has to manually create a contribution ID in normal flow.
- User can post proof-of-work from a joined circle.
- After posting, user sees submitted/checking, visible, or not-visible-yet state.
- User can review another member's work.
- User cannot review their own contribution.
- User sees Already endorsed before duplicate review submit.
- UI does not show Cancel endorsement or Withdraw endorsement in MVP.
- User can see reputation and role progress.
- Admin can slash from a review card.
- Non-admin can understand why moderation is disabled.
- Canopy testnet/RPC status is visible but not the product focus.
- Product language is used before protocol language.
- Page title, section title, card title, body text, metadata, and button text follow the typography hierarchy.
- Technical IDs, addresses, and tx hashes never overpower content titles.
- Shared components are reused instead of each page recreating similar UI.
- Community Workspace acts as a dashboard/navigation hub, not the full workflow page for every feature.
