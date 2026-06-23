# RepuRing Product Design v1

## 1. Product Definition

RepuRing is a Social-Fi Web3 app for contributor communities.

It lets Web3 contributors create an onchain social identity, join community circles, post proof-of-work, receive peer endorsements, build reputation, claim circle-based roles, and gain visible community status.

Short positioning:

> RepuRing is a Social-Fi reputation network for Web3 contributors.

Product promise:

> Turn contribution proof into community reputation and status.

RepuRing is not a task manager, DAO voting app, NFT marketplace, Discord clone, job board, or generic leaderboard. It is a Social-Fi contribution network where social activity becomes onchain reputation.

## 2. Product Pillars

### 2.1 Social Identity

Each contributor owns a profile connected to their wallet. The profile is their public contributor passport.

Profile includes:

- wallet address
- username
- bio
- avatar URL
- global reputation
- current role in the selected circle

### 2.2 Community Circles

A circle is a project or community space. It is the main social context where members post work, review others, build trust, and appear in rankings.

Circle includes:

- circle ID
- name
- description
- creator/admin address
- member list

### 2.3 Proof-of-Work Feed

A contribution is a proof-of-work post inside a circle. It is the main content type in RepuRing.

Contribution includes:

- contribution ID
- circle ID
- author address
- title
- description
- proof URL
- category
- endorsement count
- slashed status

Supported contribution categories for MVP:

- builder
- helper
- creator
- researcher
- tester
- educator

### 2.4 Peer Endorsement

An endorsement is a peer review with reputation impact. It acts like a Social-Fi comment, review, and trust signal at the same time.

Endorsement includes:

- endorsement ID
- circle ID
- reviewer address
- target contributor address
- optional contribution ID
- tag
- message
- slashed status
- slash reason

Supported MVP endorsement tags:

- builder
- helper
- creator
- leader
- trusted

### 2.5 Reputation Economy

Reputation is the MVP incentive layer. It is social capital earned from peer-endorsed work.

MVP reputation rules:

- valid contribution endorsement: +1 reputation to the contribution author
- valid legacy user endorsement: +1 reputation to the target user
- slashed endorsement: -2 reputation from the target user, floored at 0

Important MVP wording:

> Global reputation, circle-based role.

Reputation is currently profile-level. It is displayed in a selected circle context, but it is not yet project-scoped.

### 2.6 Role and Status

A role is a circle-based status claimed from current global reputation.

MVP thresholds:

- 0..4: Newbie
- 5..14: Trusted
- 15..29: Core Member
- 30+: Circle Leader

Role claim rule:

> A member claims a role inside a selected circle based on their current global reputation.

### 2.7 Moderation and Trust

The circle creator/admin can slash invalid endorsements to protect the reputation economy.

MVP moderation rules:

- only the circle creator/admin can slash
- slash requires a reason
- slash marks the endorsement as slashed
- slash subtracts 2 reputation from the target contributor, floored at 0
- if the endorsement was linked to a contribution, the contribution endorsement count decreases by 1, floored at 0

## 3. MVP Scope

The MVP must do these things well:

1. Create and update contributor profiles.
2. Create, discover, and join community circles.
3. Post proof-of-work contributions inside circles.
4. Review and endorse another member's contribution.
5. Increase reputation from valid endorsements.
6. Show leaderboard and role progression.
7. Claim a role inside the selected circle.
8. Slash invalid endorsements as the circle creator/admin.

## 4. Explicit Non-Goals for MVP

These are intentionally out of scope for MVP:

- token launch
- NFT badges
- staking
- DAO voting
- bounty marketplace
- job marketplace
- private messaging
- follow/friend graph
- Twitter-like global feed
- AI matching
- project-scoped reputation
- anti-Sybil scoring
- weighted endorsements

These can be considered later only after the MVP loop is stable.

## 5. Core Loop

Primary loop:

```text
Create Identity
→ Join Social Circle
→ Post Proof-of-Work
→ Get Peer Endorsement
→ Build Reputation
→ Claim Role / Status
→ Gain Visibility
→ Continue Contributing
```

Short loop:

```text
Identity → Circle → Proof → Endorsement → Reputation → Role
```

Every new feature must support this loop. If a feature does not make this loop clearer, stronger, safer, or more useful, it should not be in MVP.

## 6. User Types

### 6.1 Contributor

A contributor wants to prove work and build reputation.

Contributor goals:

- create an identity
- join relevant communities
- post proof-of-work
- earn endorsements
- build visible reputation
- claim a better role

### 6.2 Peer Reviewer

A reviewer validates useful work from other members.

Reviewer goals:

- browse contribution feed
- inspect proof URLs
- leave review messages
- endorse high-value work
- help the community identify useful contributors

### 6.3 Circle Creator / Admin

An admin creates and protects a community circle.

Admin goals:

- create a circle
- grow member base
- encourage useful contributions
- monitor leaderboard
- slash invalid endorsements
- keep reputation trustworthy

## 7. Product Language

The UI should use product language first and protocol language second.

| Protocol / code term | Product/UI term |
| --- | --- |
| CreateProfileTx | Create profile |
| UpdateProfileTx | Update profile |
| CreateCircleTx | Create community circle |
| JoinCircleTx | Join community |
| CreateContributionTx | Post proof-of-work |
| EndorseContributionTx | Review / endorse work |
| EndorseUserTx | Legacy member endorsement |
| ClaimRoleTx | Claim role |
| SlashEndorsementTx | Slash invalid review |
| Circle | Community circle |
| Contribution | Proof-of-work post |
| Endorsement | Peer review / endorsement |
| Reputation | Social capital / reputation |
| Role | Community status |

## 8. Main Information Architecture

### 8.1 `/repuring` — Home / Overview

Purpose:

- explain the product
- show current wallet/profile state
- show current circle context
- show reputation and role progress
- guide the user to the next step

Must include:

- selected wallet card
- profile status
- current community circle
- reputation metric
- role metric
- journey checklist
- quick actions
- optional dev/demo readiness panel

### 8.2 `/key-management` — My Account / Profile

Purpose:

- create or select local signing key
- create RepuRing profile
- update profile

Rules:

- profile is required before joining circles, posting work, reviewing work, or claiming role
- profile creation is step 1 in the app journey

### 8.3 `/repuring/circles` — Discover Circles

Purpose:

- create a circle
- discover existing circles
- join a circle
- open joined circle workspace

UX rules:

- users should not need to memorize circle IDs
- circle cards should expose name, description, members, creator/admin, and join/open action
- circle ID manual input can remain as advanced fallback

### 8.4 `/repuring/community` — Community Workspace

Purpose:

- main workspace after onboarding
- show all key circle state in one place

Must include:

- community identity
- member status
- member list
- recent proof-of-work posts
- recent peer reviews
- leaderboard preview
- role progress
- admin moderation shortcut when creator/admin

This should become the primary product surface. Other pages can remain, but they should feel like focused actions within the current community context.

### 8.5 `/repuring/contributions` — Proof Feed / Post Work

Purpose:

- post proof-of-work
- browse work in selected circle

Rules:

- only circle members can post work
- user must have profile
- contribution ID should be auto-generated in normal UI
- manual contribution ID should be hidden behind advanced/dev mode

### 8.6 `/repuring/endorse` — Review Work

Purpose:

- inspect a selected contribution
- leave peer review message
- endorse if useful

Rules:

- no self-endorsement
- only circle members can review
- duplicate endorsement should be prevented
- review message should be shown under contribution as a Social-Fi comment/review

### 8.7 `/repuring/leaderboard` — Reputation Rankings

Purpose:

- show contributors ranked by reputation in current circle context
- show role/status badges

MVP wording must clarify global reputation:

> Rankings use global profile reputation shown in the selected community context.

### 8.8 `/repuring/admin` — Moderation

Purpose:

- help creator/admin protect reputation economy

Rules:

- admin should slash from review cards, not by manually typing endorsement IDs
- slash reason is required
- non-admin users should see a read-only explanation

## 9. Transaction Mapping

| User action | Transaction |
| --- | --- |
| Create profile | createProfile |
| Update profile | updateProfile |
| Create community circle | createCircle |
| Join community | joinCircle |
| Post proof-of-work | createContribution |
| Review / endorse work | endorseContribution |
| Legacy endorse member | endorseUser |
| Claim role | claimRole |
| Slash invalid review | slashEndorsement |

## 10. Query Mapping

| Product need | Query route |
| --- | --- |
| Load profile | `/v1/query/repuring/profile` |
| Load current circle | `/v1/query/repuring/circle` |
| Discover circles | `/v1/query/repuring/circles` |
| Load circle members | `/v1/query/repuring/circle-members` |
| Load reputation | `/v1/query/repuring/reputation` |
| Load role | `/v1/query/repuring/role` |
| Load contribution | `/v1/query/repuring/contribution` |
| Load circle proof feed | `/v1/query/repuring/contributions-in-circle` |
| Load user contributions | `/v1/query/repuring/contributions-for-user` |
| Load user endorsements | `/v1/query/repuring/endorsements-for-user` |
| Load circle endorsements | `/v1/query/repuring/endorsements-in-circle` |
| Load leaderboard | `/v1/query/repuring/leaderboard` |

## 11. MVP UX Rules

1. Never show a dead-end action.
2. If a required step is missing, show the next action.
3. Use social product words in UI, not only transaction names.
4. Keep transaction names visible only as secondary technical proof.
5. Community Workspace is the center of the app.
6. Contribution is the primary content type.
7. Endorsement should feel like peer review/comment with reputation impact.
8. Admin moderation should be card-based, not ID-based.
9. Reputation must be described honestly as global profile reputation in MVP.
10. Token/NFT/DAO ideas must remain outside MVP.

## 12. Canonical Demo Story

Alice and Bob demonstrate the full Social-Fi loop:

1. Alice creates a contributor profile.
2. Bob creates a contributor profile.
3. Alice creates the `Pharos Builders` circle.
4. Bob discovers and joins the circle.
5. Bob posts proof-of-work: `Wrote Pharos testnet guide`.
6. Alice reviews and endorses Bob's contribution.
7. Bob's reputation increases.
8. Bob claims his community role.
9. Alice, as circle creator/admin, can slash an invalid endorsement.
10. Bob's reputation and contribution endorsement count update from onchain state.

Demo story in one sentence:

> Bob turns useful work into reputation and status through Alice's peer endorsement inside a Web3 community circle.

## 13. Future Roadmap

### V1 — Productized MVP

- clean up product language
- make Community Workspace the main surface
- auto-generate contribution IDs
- card-based slash flow
- clearer onboarding and empty states
- preserve current protocol

### V2 — Activity and History

- add timestamps or created heights to contributions and endorsements
- sort feeds by recent activity
- show contributor activity timeline
- improve contribution detail pages

### V3 — Circle-Scoped Reputation

- add circle-specific reputation state
- show global and circle reputation separately
- rank users by circle-specific reputation
- derive role from circle reputation

### V4 — Anti-Farming and Trust Quality

- weighted endorsements
- endorsement cooldowns
- reputation-weighted reviewer influence
- repeated ring detection
- slash history and dispute flow

### V5 — Expanded Social-Fi Economy

Only after the reputation loop is stable:

- token rewards
- NFT credentials
- sponsor rewards
- bounty integrations
- DAO role gates

## 14. Design Principle

The permanent rule for RepuRing development:

> Every feature must strengthen the path from proof-of-work to reputation and community status.

If a feature does not support Identity → Circle → Proof → Endorsement → Reputation → Role, it should not be part of the MVP.
