# RepuRing Delivery Phases v1

## 0. Scope

This document translates the RepuRing product design, UX/UI spec, and system flow spec into delivery phases for the engineering team.

RepuRing MVP is a Social-Fi Web3 app for contributor communities on Canopy testnet/local Canopy environment.

This is a product/design delivery plan, not a requirement to rewrite the protocol from scratch.

## 1. Delivery Strategy

The delivery strategy is:

```text
Stabilize the product meaning first.
Then improve UX clarity.
Then strengthen system flow.
Then enforce shared UI design system.
Then enforce implementation governance.
Then add future protocol features only after MVP loop works.
```

Engineering should avoid building new large features until the MVP loop is smooth:

```text
Identity → Circle → Proof → Endorsement → Reputation → Role
```

## 2. Non-Negotiable MVP Product Laws

- RepuRing is a Social-Fi contribution reputation product, not a raw transaction demo.
- UI must use product language first and protocol language second.
- Circle-scoped pages must use the current community context.
- Normal users must not manually type technical IDs in normal flow.
- The UI must not show fake actions unsupported by protocol.
- Contribution posting must verify visible feed state.
- Endorsement is an onchain attestation, not a like/unlike toggle.
- Reviewer self-cancel endorsement is not supported in MVP.
- Reputation is global profile reputation displayed in selected community context.

## 3. Implementation Governance

Before coding any RepuRing UI change, engineering must identify:

- owning page
- reused shared component
- current community context behavior
- required user state/preconditions
- disabled/locked state
- empty state
- loading state
- success state
- error/recovery state
- refresh behavior after transaction
- acceptance criteria from docs

### 3.1 Page ownership rule

Every page must have a clear owner.

Community Workspace owns:

- dashboard
- overview
- navigation

Post Work owns:

- contribution feed
- contribution posting
- post visibility state

Review Work owns:

- contribution selection for review
- own/already/slashed state
- endorsement confirmation
- already-endorsed state

Admin owns:

- moderation queue
- review card selection
- slash confirmation
- reason entry

If a page shows data owned by another page, it must be preview-only and link to the owner page.

### 3.2 Shared component rule

If a UI block appears on more than one page, it should become or reuse a shared component.

Required reusable patterns include:

- `ContributionCard`
- `ReviewCard`
- `CommunityContextCard`
- `ActiveWalletBanner`
- `ActionGate`
- `TxStatusCard`
- `ConfirmationPanel`
- `PostVisibilityNotice`
- `GeneratedRecordIdBlock`

Do not write separate page-specific versions unless behavior is materially different.

### 3.3 Design-doc traceability rule

Every implementation task must map to the design docs.

Before coding a feature, engineering should identify:

- which page owns it
- which component owns it
- which state controls it
- which protocol action supports it
- which acceptance criteria validate it

Every task should be traceable back to one or more of:

- `REPURING_PRODUCT_DESIGN_V1.md`
- `REPURING_UX_UI_SPEC_V1.md`
- `REPURING_SYSTEM_FLOW_SPEC_V1.md`
- `REPURING_SCREEN_WIREFRAMES_V1.md`
- `REPURING_DELIVERY_PHASES_V1.md`

### 3.4 State-definition rule

No new UI flow should be implemented unless its product meaning, state behavior, and protocol support are already defined.

A new action must define:

- precondition
- disabled state
- locked state, if applicable
- empty state
- loading state
- success state
- error/recovery state
- refresh behavior after transaction or query

The user should never experience an undefined state transition.

### 3.5 Preview-only rule

Preview pages cannot own full workflows.

Examples:

Community Workspace may show:

- recent contributions
- recent reviews
- leaderboard preview
- role preview
- admin shortcut

But it must route users to:

- Post Work for contribution posting and full feed
- Review Work for endorsement workflow
- Leaderboard for full ranking
- Admin for moderation workflow

### 3.6 Protocol-support rule

No new UI action should be implemented unless:

- product meaning is defined
- state behavior is defined
- protocol support exists

The UI must not advertise protocol capabilities that do not exist.

### 3.7 Pull request governance checklist

A pull request should not be considered complete unless:

- page ownership is respected
- shared components are reused
- state transitions are defined
- current community context behavior is clear
- disabled, empty, success, error, and refresh states are handled
- acceptance criteria are satisfied
- UX/UI Specification remains consistent
- System Flow remains consistent
- MVP product laws remain intact

## 4. UI Design System Delivery Requirements

The MVP UI must use a shared design system. Devs should not recreate the same component logic separately on every page.

### 4.1 Typography requirements

| Text type | Size | Weight | Required use |
| --- | --- | --- | --- |
| Page title | Desktop: 32-40px; Mobile: 28-32px | 700/800 | Main page header title |
| Section title | 20-24px | 700 | Major panels and sections |
| Card title | 16-18px | 600/700 | Contribution title, community name, review title |
| Body text | 14-16px | 400/500 | Descriptions and helper text |
| Small metadata | 12-13px | 400/500 | Wallet address, Circle ID, onchain record ID, tx badge |
| Button text | 14px | 600 | Button labels |

Acceptance criteria:

- Page headers use page title typography.
- Panel headings use section title typography.
- Contribution/community/review titles use card title typography.
- Technical IDs, addresses, and tx hashes use small metadata typography.
- Technical IDs, addresses, and tx hashes are never more visually prominent than contribution/community/review titles.

### 4.2 Layout requirements

Default page layout order:

```text
Page Header
→ Current Context / Active Wallet Banner
→ Primary page action
→ Supporting panels
→ Technical status
```

Spacing requirements:

| Layout token | Value |
| --- | --- |
| Page vertical gap | 24-32px |
| Panel padding | Desktop: 20-24px; Mobile: 16px |
| Card gap | 12-16px |
| Grid gap | 16-20px |
| Button group gap | 8-12px |

Responsive requirements:

Mobile:

- 1 column
- buttons full width when inside form/action blocks
- metadata wraps or uses break-all
- no horizontal scroll

Desktop:

- 2 column layout where useful
- primary action left/top
- supporting info right/bottom

Acceptance criteria:

- Product context and primary actions appear before technical status.
- TxStatusCard is not placed above the primary product action.
- Mobile has no horizontal overflow from metadata or tables.
- Buttons in mobile forms/action blocks are full width where appropriate.

### 4.3 Shared component requirements

Required shared components:

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

Acceptance criteria:

- Contribution previews, feed items, and Review Work selector use `ContributionCard` variants instead of separate card implementations.
- Community recent reviews, contribution reviews, and admin moderation queue use `ReviewCard` variants instead of separate card implementations.
- Every circle-scoped page uses `CommunityContextCard`.
- Transaction/RPC status uses `TxStatusCard` and remains secondary.
- Missing preconditions are handled through consistent `ActionGate` behavior.
- Endorse and slash confirmations use `ConfirmationPanel`.
- Post Work uses `GeneratedRecordIdBlock` and `PostVisibilityNotice`.

### 4.4 Page responsibility requirements

Community Workspace role:

```text
Dashboard / overview / navigation hub
```

Community Workspace may include:

- recent contributions
- recent reviews
- leaderboard preview
- role preview
- admin shortcut
- joined communities switcher

Community Workspace should not include:

- full contribution management
- full review flow
- full moderation flow
- full leaderboard table

Specialist page ownership:

- Post proof-of-work → `/repuring/contributions`
- Review work → `/repuring/endorse`
- View leaderboard → `/repuring/leaderboard`
- Open moderation → `/repuring/admin`

Acceptance criteria:

- Community Workspace uses preview cards and route buttons, not full workflows.
- Post Work owns posting, filtering, full contribution list, post visibility, and review CTA.
- Review Work owns contribution selection, own/already/slashed state, review writing, confirmation, and already-endorsed state.
- Admin owns review selection, slash confirmation, reason entry, and moderation queue.

## 5. Priority Levels

### P0 — Must-have MVP corrections

P0 items make the current app coherent as a Social-Fi product.

If P0 is not done, RepuRing may work technically but still feel confusing or demo-like.

### P1 — Product polish

P1 items improve usability, reduce friction, and make RepuRing feel more production-ready on testnet.

### P2 — Future enhancements

P2 items should wait until the MVP loop is stable.

## 6. Phase 1 — Product Language, Navigation, and Design System Setup

### Goal

Make the app read like a Social-Fi Web3 product instead of a raw transaction demo, and establish reusable UI primitives before deeper page work.

### Scope

- update navigation labels
- update page headers
- update CTA text
- preserve protocol transaction badges as secondary details
- keep Canopy testnet wording clear
- create or standardize shared components from the UI Design System

### Required changes

Use these labels:

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

Use product CTAs:

| Current/protocol language | Product CTA |
| --- | --- |
| CreateProfileTx | Create profile |
| CreateCircleTx | Create community circle |
| JoinCircleTx | Join community |
| CreateContributionTx | Post proof-of-work |
| EndorseContributionTx | Submit peer review |
| ClaimRoleTx | Claim role |
| SlashEndorsementTx | Slash invalid review |

### Acceptance criteria

- Every main route has product-first title and description.
- Transaction names are not the primary CTA.
- Canopy testnet/local RPC is mentioned where relevant.
- User can understand the app from the Overview page without reading README.
- PageHeader, CommunityContextCard, ContributionCard, ReviewCard, TxStatusCard, ConfirmationPanel, PostVisibilityNotice, and GeneratedRecordIdBlock are available or explicitly mapped to existing components.
- Typography hierarchy is applied consistently enough that content titles visually dominate technical metadata.
- Implementation tasks identify owner page, reused component, state behavior, and acceptance criteria before code begins.

## 7. Phase 2 — Overview and Journey Checklist

### Goal

Make `/repuring` the user's orientation page.

### Required checklist steps

1. Select wallet
2. Create profile
3. Create or join community circle
4. Open community workspace
5. Post proof-of-work
6. Review another member's work
7. Build reputation
8. Claim role/status
9. Moderate invalid reviews, admin optional

### Acceptance criteria

- User can see their current state.
- User can see the next required action.
- Missing wallet/profile/circle/member state is handled with clear CTAs.
- Dev/testnet readiness is visible but secondary.
- Technical status appears after product context and journey actions.

## 8. Phase 3 — Circles and Community Context

### Goal

Make community circles feel like real Social-Fi spaces.

### Required changes

- improve circle discovery cards
- reduce need to memorize IDs
- make selected community context visible across pages
- make Community Workspace the center of the app
- treat Circle ID as readonly metadata in normal flow

### Acceptance criteria

- User can discover and join circles from cards.
- User does not need to manually remember circle ID in normal flow.
- Switching circle refreshes feed, reviews, leaderboard, and role context.
- Community Workspace is reachable from every circle card.
- Every circle-scoped route uses a consistent CommunityContextCard.

## 9. Phase 4 — Community Workspace Productization

### Goal

Make `/repuring/community` the main product workspace without turning it into a duplicate of every specialist page.

### Required sections

1. Community identity header
2. Active wallet/member status banner
3. Readonly current community context
4. Metrics row
5. Member list
6. Recent proof-of-work posts
7. Recent peer reviews
8. Leaderboard preview
9. Role progress
10. Admin moderation shortcut if creator/admin
11. Joined communities switcher

### Page responsibility

Community Workspace is a dashboard / overview / navigation hub.

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

### Acceptance criteria

- A member can understand community activity from this page alone.
- A non-member sees join guidance.
- A creator/admin sees moderation entry points.
- Recent contributions and reviews are visible in the same community context.
- Leaderboard and role context match selected circle.
- Community Workspace routes users to specialist pages for full workflows.

## 10. Phase 5 — Proof-of-Work Feed Improvements

### Goal

Make contribution posting feel like a Social-Fi content action, not manual transaction construction.

### Required form fields

Required normal fields:

- title
- description
- proof URL
- category

Generated metadata:

- contribution ID / onchain record ID

Advanced/debug-only:

- custom contribution ID

### Required behavior

- Provider/default form state must not ship with fixed contribution IDs such as `pharos-guide`.
- Contribution ID is generated per post after title/community are available.
- Normal form does not require manual contribution ID.
- Post flow tracks submitted contribution ID.
- UI verifies submitted contribution appears in selected circle feed.
- UI shows submitted/checking, visible, or not-visible-yet state.
- block submit if no wallet/profile/circle/membership
- show proof URL helper text
- show contribution card after refresh

### Component requirements

- Use `GeneratedRecordIdBlock` for generated contribution ID.
- Use `PostVisibilityNotice` for submitted/checking/visible/not-visible-yet/failed states.
- Use `ContributionCard` for feed items.
- Use `TxStatusCard` only in the secondary technical status area.

### Acceptance criteria

- Member can post without typing contribution ID.
- After post, user sees visible feedback near composer/feed.
- If post does not appear after refresh, user sees recoverable notice.
- Duplicate generated/custom ID failure keeps composer open and shows clear error.
- Contribution appears in selected circle feed after Canopy refresh.
- Contribution card shows title, category, author, proof URL, endorsement count, and review CTA.
- Contribution title is visually stronger than onchain record ID.

## 11. Phase 6 — Review / Endorse Work Improvements

### Goal

Make endorsement feel like peer review/comment with reputation impact.

### Required sections

1. Readonly current community context
2. Selected contribution preview
3. Contribution picker/feed
4. Current reviewer endorsement state
5. Review form
6. Confirmation panel
7. Existing reviews
8. Reputation impact explanation

### Required behavior

- no self-review
- no duplicate review
- only circle members can review
- slashed contributions cannot be reviewed
- successful review increases author reputation after state refresh
- current reviewer state becomes Already endorsed after successful review

### Endorsement finality

`EndorseContributionTx` is an onchain peer review / attestation.

Rules:

- A reviewer can endorse a contribution once.
- MVP does not support reviewer self-cancel or withdraw.
- UI must detect Already endorsed.
- UI must not show fake Cancel endorsement.
- Invalid endorsements are handled by creator/admin `SlashEndorsementTx`.

### Component requirements

- Use `CommunityContextCard` at the top.
- Use `ContributionCard` for selector entries and selected contribution preview.
- Use `ReviewCard` for existing reviews.
- Use `ConfirmationPanel` before submitting the endorsement.
- Use `ActionGate` for no wallet/no profile/not member/own/already/slashed states.

### Copy requirements

Use:

```text
Submit peer review
```

Explain:

```text
A valid peer endorsement gives +1 global reputation to the contribution author.
```

Confirmation warning:

```text
This endorsement is an onchain attestation. After confirmation, you cannot self-cancel it in the current MVP protocol. Only the circle creator/admin can moderate invalid endorsements.
```

### Acceptance criteria

- Alice can review Bob's contribution once.
- Alice cannot review Bob's same contribution twice.
- UI shows Already endorsed before duplicate submit.
- Alice's existing review is visible under the contribution.
- Confirmation warns endorsement cannot be self-cancelled.
- Bob cannot review his own contribution.
- Slashed contribution cannot be reviewed.
- Legacy direct user endorsement remains clearly marked as legacy.
- Contribution title and review message are visually stronger than technical IDs.

## 12. Phase 7 — Leaderboard and Role Progression

### Goal

Make reputation and role feel like visible Social-Fi status.

### Required leaderboard columns

- rank
- contributor username/address
- reputation
- derived role
- claimed role status if available

### Required notice

```text
MVP leaderboard uses global profile reputation displayed in the selected community context. Circle-specific reputation is planned for a later version.
```

### Component requirements

- Use `CommunityContextCard` at the top.
- Use `RoleProgressCard` for role thresholds/progress.
- Use `Badge`/`StatusPill` consistently for role/status indicators.

### Acceptance criteria

- User can see current reputation and role.
- User can understand how many points are needed for next role.
- Role threshold display matches protocol rules.
- UI does not imply circle-specific reputation exists yet.

## 13. Phase 8 — Admin Moderation Productization

### Goal

Make slashing an understandable moderation action instead of manual ID operation.

### Required sections

1. Admin eligibility card
2. Role claim card
3. Moderation queue
4. Slashed review status/history
5. Transaction status

### Required behavior

- Slash invalid review is the MVP correction path for bad endorsements.
- Reviewer withdrawal is future protocol work, not MVP.
- Moderation must be card-based.
- Manual endorsement ID input is advanced/debug only.
- creator/admin can slash
- non-admin can read but not slash
- slash reason required
- admin selects review card to slash
- already slashed reviews cannot be slashed again

### Component requirements

- Use `CommunityContextCard` at the top.
- Use `ReviewCard` for moderation queue items.
- Use `ConfirmationPanel` for slash confirmation/reason.
- Use `ActionGate` for non-admin states.
- Use `TxStatusCard` as secondary technical status.

### Required confirmation copy

```text
This will mark the review as slashed and reduce the target contributor's reputation by 2, floored at 0.
```

### Acceptance criteria

- Alice as creator/admin can slash a review.
- Bob as non-admin cannot slash.
- Slash reason is required.
- Slashed review shows status and reason.
- Target reputation decreases by 2, floored at 0.
- Linked contribution endorsement count decreases by 1, floored at 0.
- Manual endorsement ID is not required in normal moderation flow.
- Review title/message is visually stronger than endorsement ID.

## 14. Phase 9 — QA and Demo Readiness

### Goal

Ensure the canonical Alice/Bob demo works end to end on Canopy testnet/local Canopy environment.

### Canonical demo

1. Start Canopy local/testnet RPC.
2. Create Alice wallet/profile.
3. Create Bob wallet/profile.
4. Alice creates `Pharos Builders` circle.
5. Bob discovers and joins the circle.
6. Bob posts `Wrote Pharos testnet guide` proof-of-work.
7. After Bob posts proof-of-work, UI confirms the contribution is visible in the feed.
8. Alice reviews Bob's contribution once.
9. Alice sees Already endorsed if selecting the same contribution again.
10. Bob cannot self-review.
11. Bob sees reputation and endorsement count update after refresh.
12. Bob claims role.
13. Alice slashes invalid endorsement if needed.
14. Bob's reputation and contribution endorsement count update.

### Acceptance criteria

- Demo can be completed without manually copying circle ID in normal flow.
- Demo can be completed without manually creating contribution ID in normal flow.
- Alice/Bob wallet switching clears stale form state.
- RPC failures show recoverable UI.
- Last transaction/status is visible.
- README demo story and UI flow match.
- Mobile layout has no horizontal scroll from metadata or tables.
- Technical IDs/addresses/tx hashes stay visually secondary across the demo.
- Demo task or PR documents owning page, reused component, state behavior, refresh behavior, and acceptance criteria.

## 15. Phase 10 — Documentation Cleanup

### Goal

Keep docs aligned with the actual product.

### Required docs to maintain

- `REPURING_DESIGN_HANDOFF_INDEX.md`
- `REPURING_PRODUCT_DESIGN_V1.md`
- `REPURING_UX_UI_SPEC_V1.md`
- `REPURING_SYSTEM_FLOW_SPEC_V1.md`
- `REPURING_SCREEN_WIREFRAMES_V1.md`
- `REPURING_DELIVERY_PHASES_V1.md`
- README demo section

### Acceptance criteria

- README does not contradict product docs.
- Product docs do not claim mainnet/token/NFT functionality.
- Product docs clearly state Canopy testnet/local environment.
- Dev-facing TODOs are separated from user-facing product claims.
- UI Design System rules stay aligned across UX/UI spec, screen wireframes, and delivery phases.
- Implementation Governance rules stay aligned across index and delivery phases.

## 16. Suggested Implementation Order

Recommended order for engineering issues:

```text
P0-1 Product language cleanup
P0-2 Shared UI design system component setup
P0-3 Implementation governance checklist in issue/PR template
P0-4 Overview next-step journey checklist
P0-5 Circle discovery/open community UX
P0-6 Community Workspace centralization
P0-7 Auto-generate contribution ID
P0-8 Post visibility verification
P0-9 Review work UX, self-review guards, already-endorsed state
P0-10 Leaderboard/role wording cleanup
P0-11 Card-based admin slash flow
P0-12 Alice/Bob demo QA
```

Then:

```text
P1-1 Better loading/error states
P1-2 Contribution detail view
P1-3 Review history polish
P1-4 Joined communities switcher polish
P1-5 Testnet status panel polish
P1-6 Responsive/mobile polish
```

Future only:

```text
P2-1 Timestamps/created height
P2-2 Circle-scoped reputation
P2-3 Weighted endorsements
P2-4 Anti-farming checks
P2-5 Reviewer endorsement withdrawal transaction
P2-6 Token/NFT/reward extensions
```

## 17. Definition of Done for MVP Productization

The MVP productization work is done when:

- RepuRing clearly reads as a Social-Fi Web3 app.
- The app explicitly runs in Canopy testnet/local context.
- The core loop is visible and usable.
- Users are guided through missing prerequisites.
- Normal users never need to manually type circle/contribution/endorsement IDs in normal flow.
- Contribution posting verifies visible feed state.
- Endorsement has confirmation, already-endorsed, and no-self-cancel states.
- Admin moderation is the only MVP path for invalid endorsement correction.
- Contribution posting and peer review feel social, not only transactional.
- Reputation and role progression are understandable.
- Admin moderation is card-based and safe.
- Shared UI components are reused consistently.
- Typography, spacing, responsive behavior, and metadata hierarchy follow the UI Design System.
- Community Workspace is a dashboard/navigation hub and does not duplicate full specialist workflows.
- Implementation tasks map to owning page, shared component, state behavior, refresh behavior, and acceptance criteria.
- The Alice/Bob demo works from UI.
- No screen implies token, NFT, mainnet reward, or project-scoped reputation functionality.

## 18. What Not To Build Yet

Do not build these until the MVP loop is stable and separately scoped:

- token reward system
- NFT credential system
- staking or slashing deposits
- DAO voting
- bounty marketplace
- job marketplace
- private messaging
- follow/friend graph
- global social feed
- AI recommendation system
- project-scoped reputation, unless protocol work is explicitly approved
- reviewer endorsement self-cancel / withdrawal, unless a real protocol transaction is explicitly approved

## 19. Final Delivery Principle

Build the smallest complete Social-Fi loop first:

```text
Alice creates a community.
Bob joins.
Bob posts useful work.
UI verifies Bob's work appears in the feed.
Alice reviews it once.
Alice sees Already endorsed on repeat selection.
Bob gains reputation.
Bob claims role.
Alice can moderate invalid reviews.
```

If this loop feels clear, RepuRing feels real.
If this loop feels confusing, adding more features will make the product worse.
