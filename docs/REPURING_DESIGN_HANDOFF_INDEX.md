# RepuRing Design Handoff Index

## Purpose

This folder is the product-design handoff source for RepuRing.

RepuRing is a Social-Fi Web3 app for contributor communities on the Canopy test network. The goal of these documents is to give the engineering team a stable product direction, UX structure, UI behavior, system flow, screen wireframes, and delivery plan before implementation work continues.

This is not a smart-contract rewrite request and not a mainnet tokenomics plan. The MVP should stay focused on the Canopy testnet Social-Fi loop:

```text
Identity → Circle → Proof-of-Work → Peer Endorsement → Reputation → Role / Status
```

## Document Set

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

1. Read `REPURING_PRODUCT_DESIGN_V1.md` to understand the product.
2. Read `REPURING_UX_UI_SPEC_V1.md` to understand what screens should feel like.
3. Read `REPURING_SYSTEM_FLOW_SPEC_V1.md` to understand rules, flow, and state transitions.
4. Read `REPURING_SCREEN_WIREFRAMES_V1.md` to understand layout hierarchy.
5. Use `REPURING_DELIVERY_PHASES_V1.md` to break work into issues/tasks.
6. Keep transaction names and protocol behavior stable unless a later protocol-design document explicitly changes them.

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
- full Twitter-like social feed

## Design Authority

When code and product direction conflict, the MVP product direction should follow the documents in this order:

1. `REPURING_PRODUCT_DESIGN_V1.md`
2. `REPURING_UX_UI_SPEC_V1.md`
3. `REPURING_SYSTEM_FLOW_SPEC_V1.md`
4. `REPURING_SCREEN_WIREFRAMES_V1.md`
5. `REPURING_DELIVERY_PHASES_V1.md`

Engineering may adjust implementation details, but should not change product meaning without updating the design docs.
