# RepuRing Design Handoff Index

## Purpose

This folder is the product-design handoff source for RepuRing.

RepuRing is a Social-Fi Web3 app for contributor communities on the Canopy test network. The goal of these documents is to give the engineering team a stable product direction, UX structure, UI behavior, system flow, screen wireframes, and delivery plan before implementation work continues.

This is not a smart-contract rewrite request and not a mainnet tokenomics plan. The MVP should stay focused on the Canopy testnet Social-Fi loop:

```text
Identity → Circle → Proof-of-Work → Peer Endorsement → Reputation → Role / Status
```

## Global MVP Product Laws

These laws apply across all RepuRing MVP documents and screens.

1. Product-first, protocol-second. User-facing UI must describe product actions first. Transaction names may appear only as secondary technical badges, status logs, or advanced details.
2. Current community context is mandatory. Circle-scoped pages must operate inside the selected community context. Contributions, reviews, leaderboard, role, and admin moderation must refresh when the selected community changes.
3. Technical IDs are metadata. Normal users should not manually type circle IDs, contribution IDs, or endorsement IDs. IDs may appear as readonly technical metadata. Manual overrides belong only in advanced/debug sections.
4. No fake protocol actions. The UI must not show actions that the current protocol cannot perform. Do not show Cancel endorsement or Withdraw endorsement in MVP unless a real withdraw transaction exists.
5. Post visibility must be verified. After posting proof-of-work, the UI must verify that the new contribution appears in the selected community feed.
6. Endorsement is an onchain attestation. A peer endorsement is not a like/unlike toggle. A reviewer can endorse a contribution once. Reviewers cannot self-cancel endorsements in MVP.
7. Reputation wording must be honest. MVP reputation is global profile reputation displayed in selected community context. Do not imply circle-scoped reputation exists yet.
8. MVP boundaries are strict. Token rewards, NFT badges, staking, DAO voting, marketplace features, private messaging, global social feed, project-scoped reputation, and reviewer endorsement withdrawal are not MVP features.
9. Shared UI system is mandatory. RepuRing pages must reuse the shared typography, layout, spacing, cards, badges, banners, empty states, confirmation panels, and status components. Pages should feel like one product, not separate transaction forms.

## Implementation Governance

These governance rules apply before coding any RepuRing UI change.

### 1. Every page must have a clear owner

Community Workspace owns:

- dashboard
- overview
- navigation

Post Work owns:

- contribution feed
- contribution posting

Review Work owns:

- endorsement workflow

Admin owns:

- moderation workflow

Pages may preview information owned by another page, but should not duplicate the full workflow.

### 2. Repeated UI must become a shared component

If a UI block appears on more than one page, it should become or reuse a shared component.

Examples:

- `ContributionCard`
- `ReviewCard`
- `CommunityContextCard`
- `ActiveWalletBanner`
- `ActionGate`
- `TxStatusCard`
- `ConfirmationPanel`
- `PostVisibilityNotice`

Do not create page-specific versions unless behavior is materially different.

### 3. Every implementation task must map to the design docs

Before coding any feature, engineering should identify:

- owning page
- reused shared component
- user state
- protocol action
- acceptance criteria

Every task should be traceable back to:

- Product Design
- UX/UI Specification
- System Flow
- Wireframes
- Delivery Phases

### 4. No UI flow without defined states

A new action should not be implemented unless the following are defined:

- preconditions
- disabled state
- locked state
- empty state
- loading state
- success state
- error state
- refresh behavior

The user should never experience an undefined state transition.

### 5. Preview pages cannot own full workflows

If a page displays data owned by another page, it should remain preview-only.

Examples:

Community Workspace may show:

- recent contributions
- recent reviews
- leaderboard preview

But must route users to:

- Post Work
- Review Work
- Leaderboard
- Admin

for full workflows.

### 6. Protocol support must exist before UI support

No new UI action should be implemented unless:

- product meaning is defined
- state behavior is defined
- protocol support exists

The UI must not advertise protocol capabilities that do not exist.

## Document Set

### 0. Design Handoff Index

File:

```text
docs/REPURING_DESIGN_HANDOFF_INDEX.md
```

Use this to understand:

- document order
- design authority
- global MVP product laws
- implementation governance
- MVP boundaries
- how engineering should use the handoff docs

### 1. Product Design

File:

```text
docs/REPURING_PRODUCT_DESIGN_V1.md
```

Use this to understand:

- product definition
- Social-Fi positioning
- MVP scope
- non-goals
- product pillars
- transaction/query mapping
- roadmap direction

### 2. UX/UI Specification

File:

```text
docs/REPURING_UX_UI_SPEC_V1.md
```

Use this to implement:

- page-by-page UX
- route responsibilities
- UI components
- empty/loading/error states
- user-facing copy rules
- visual hierarchy
- action gating
- navigation behavior
- shared UI design system
- typography and spacing rules
- component reuse rules
- page responsibility boundaries

### 3. System Flow Specification

File:

```text
docs/REPURING_SYSTEM_FLOW_SPEC_V1.md
```

Use this to implement:

- user journeys
- state machine behavior
- transaction preconditions
- query refresh behavior
- role and reputation rules
- moderation rules
- edge cases

### 4. Delivery Phases and Acceptance Criteria

File:

```text
docs/REPURING_DELIVERY_PHASES_V1.md
```

Use this to plan engineering work:

- delivery phases
- implementation priorities
- acceptance criteria
- implementation governance
- QA checklist
- release readiness
- what should not be built in MVP

### 5. Screen Wireframes

File:

```text
docs/REPURING_SCREEN_WIREFRAMES_V1.md
```

Use this to understand:

- screen layout hierarchy
- text-based wireframes
- page component order
- primary and secondary CTAs
- responsive/mobile layout priorities
- which sections belong on each route

## How Devs Should Use These Docs

The recommended implementation order is:

1. Read `REPURING_DESIGN_HANDOFF_INDEX.md` first to understand the global MVP laws, implementation governance, and authority order.
2. Read `REPURING_PRODUCT_DESIGN_V1.md` to understand the product meaning.
3. Read `REPURING_UX_UI_SPEC_V1.md` to understand what screens should feel like.
4. Read `REPURING_SYSTEM_FLOW_SPEC_V1.md` to understand rules, flow, and state transitions.
5. Read `REPURING_SCREEN_WIREFRAMES_V1.md` to understand layout hierarchy.
6. Use `REPURING_DELIVERY_PHASES_V1.md` to break work into issues/tasks.
7. Keep transaction names and protocol behavior stable unless a later protocol-design document explicitly changes them.

## Development Principle

Every feature must strengthen this loop:

```text
Identity → Circle → Proof → Endorsement → Reputation → Role
```

If a proposed feature does not make that loop clearer, safer, or more useful, it should be postponed.

## MVP Boundaries

MVP includes:

- contributor profile
- community circle
- proof-of-work feed
- peer review / endorsement
- reputation
- role/status
- leaderboard
- admin slash/moderation
- Canopy testnet/local RPC readiness

MVP excludes:

- token rewards
- NFT badges
- staking
- mainnet financial mechanics
- DAO governance
- job marketplace
- private messaging
- follow/friend system
- AI matching
- full Twitter-like global social feed
- project-scoped reputation
- reviewer self-cancel / withdraw endorsement

## Design Authority

When code and product direction conflict, the MVP product direction should follow the documents in this order:

1. `REPURING_DESIGN_HANDOFF_INDEX.md`
2. `REPURING_PRODUCT_DESIGN_V1.md`
3. `REPURING_UX_UI_SPEC_V1.md`
4. `REPURING_SYSTEM_FLOW_SPEC_V1.md`
5. `REPURING_SCREEN_WIREFRAMES_V1.md`
6. `REPURING_DELIVERY_PHASES_V1.md`

Engineering may adjust implementation details, but should not change product meaning without updating the design docs.
