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
Then add future protocol features only after MVP loop works.
```

Engineering should avoid building new large features until the MVP loop is smooth:

```text
Identity → Circle → Proof → Endorsement → Reputation → Role
```

## 2. Priority Levels

### P0 — Must-have MVP corrections

P0 items make the current app coherent as a Social-Fi product.

If P0 is not done, RepuRing may work technically but still feel confusing or demo-like.

### P1 — Product polish

P1 items improve usability, reduce friction, and make RepuRing feel more production-ready on testnet.

### P2 — Future enhancements

P2 items should wait until the MVP loop is stable.

## 3. Phase 1 — Product Language and Navigation Cleanup

### Goal

Make the app read like a Social-Fi Web3 product instead of a raw transaction demo.

### Scope

- update navigation labels
- update page headers
- update CTA text
- preserve protocol transaction badges as secondary details
- keep Canopy testnet wording clear

### Required changes

#### 3.1 Navigation labels

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

#### 3.2 CTA language

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

#### 3.3 Page copy

All major pages should describe the user benefit before technical action.

Good:

```text
Post proof-of-work so peers can review your contribution and help you build reputation.
```

Avoid:

```text
Submit CreateContributionTx to the plugin.
```

### Acceptance criteria

- Every main route has product-first title and description.
- Transaction names are not the primary CTA.
- Canopy testnet/local RPC is mentioned where relevant.
- User can understand the app from the Overview page without reading README.

## 4. Phase 2 — Overview and Journey Checklist

### Goal

Make `/repuring` the user's orientation page.

### Scope

- improve hero copy
- show wallet/profile/circle/reputation/role summary
- show next-step journey checklist
- show quick actions
- show testnet readiness without dominating UI

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

### Status labels

Use:

```text
Done
Next
Locked
Optional
```

### Acceptance criteria

- User can see their current state.
- User can see the next required action.
- Missing wallet/profile/circle/member state is handled with clear CTAs.
- Dev/testnet readiness is visible but secondary.

## 5. Phase 3 — Circles and Community Context

### Goal

Make community circles feel like real Social-Fi spaces.

### Scope

- improve circle discovery cards
- reduce need to memorize IDs
- make selected community context visible across pages
- make Community Workspace the center of the app

### Required changes

#### 5.1 Create circle UX

Form fields:

- community name
- community ID
- description

Recommended behavior:

- auto-suggest community ID from name
- allow editing in advanced mode

#### 5.2 Circle cards

Each card must show:

- name
- ID
- description
- creator/admin
- member count
- status: Creator / Joined / Not joined
- action: Join / Open community / Open admin

#### 5.3 Community context

On all circle-scoped pages, show:

- selected circle name or ID
- member status
- shortcut to Community Workspace

### Acceptance criteria

- User can discover and join circles from cards.
- User does not need to manually remember circle ID in normal flow.
- Switching circle refreshes feed, reviews, leaderboard, and role context.
- Community Workspace is reachable from every circle card.

## 6. Phase 4 — Community Workspace Productization

### Goal

Make `/repuring/community` the main product workspace.

### Required sections

1. Community identity header
2. Active wallet/member status banner
3. Metrics row
4. Member list
5. Recent proof-of-work posts
6. Recent peer reviews
7. Leaderboard preview
8. Role progress
9. Admin moderation shortcut if creator/admin
10. Joined communities switcher

### Required metrics

- Members
- Contributions
- Reviews
- Your reputation
- Your role

### Required actions

- Refresh community
- Post proof-of-work
- Review work
- View leaderboard
- Claim role
- Open moderation, admin only

### Acceptance criteria

- A member can understand community activity from this page alone.
- A non-member sees join guidance.
- A creator/admin sees moderation entry points.
- Recent contributions and reviews are visible in the same community context.
- Leaderboard and role context match selected circle.

## 7. Phase 5 — Proof-of-Work Feed Improvements

### Goal

Make contribution posting feel like a Social-Fi content action, not manual transaction construction.

### Required form fields

Required normal fields:

- title
- description
- proof URL
- category

Advanced/dev-only:

- contribution ID

### Required behavior

- auto-generate contribution ID in normal UI
- block submit if no wallet/profile/circle/membership
- show proof URL helper text
- show contribution card after refresh

### Category helper text

- builder: code, integrations, technical work
- helper: community support or onboarding
- creator: content, visuals, media
- researcher: analysis, reports, ecosystem research
- tester: bug reports, QA, testnet testing
- educator: guides, tutorials, learning resources

### Acceptance criteria

- Member can post proof-of-work without manually creating contribution ID.
- Non-member cannot post and sees join CTA.
- Contribution appears in selected circle feed after Canopy refresh.
- Contribution card shows title, category, author, proof URL, endorsement count, and review CTA.

## 8. Phase 6 — Review / Endorse Work Improvements

### Goal

Make endorsement feel like peer review/comment with reputation impact.

### Required sections

1. Selected contribution preview
2. Contribution picker/feed
3. Review form
4. Existing reviews
5. Reputation impact explanation

### Required behavior

- no self-review
- no duplicate review
- only circle members can review
- slashed contributions cannot be reviewed
- successful review increases author reputation after state refresh

### Copy requirements

Use:

```text
Submit peer review
```

Explain:

```text
A valid peer endorsement gives +1 global reputation to the contribution author.
```

### Acceptance criteria

- Alice can review Bob's contribution.
- Bob cannot review his own contribution.
- Alice cannot review the same contribution twice.
- Bob's reputation increases after Alice's review.
- Review message appears under or near the contribution as Social-Fi review/comment.

## 9. Phase 7 — Leaderboard and Role Progression

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

### Role progress card

Must show:

- current global reputation
- current derived role
- next role
- points needed for next role
- thresholds

### Acceptance criteria

- User can see current reputation and role.
- User can understand how many points are needed for next role.
- Role threshold display matches protocol rules.
- UI does not imply circle-specific reputation exists yet.

## 10. Phase 8 — Admin Moderation Productization

### Goal

Make slashing an understandable moderation action instead of manual ID operation.

### Required sections

1. Admin eligibility card
2. Role claim card
3. Moderation queue
4. Slashed review status/history
5. Transaction status

### Required behavior

- creator/admin can slash
- non-admin can read but not slash
- slash reason required
- admin selects review card to slash
- manual endorsement ID input is secondary/advanced only
- already slashed reviews cannot be slashed again

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

## 11. Phase 9 — QA and Demo Readiness

### Goal

Ensure the canonical Alice/Bob demo works end to end on Canopy testnet/local Canopy environment.

### Canonical demo

1. Start Canopy local/testnet RPC.
2. Create Alice wallet/profile.
3. Create Bob wallet/profile.
4. Alice creates `Pharos Builders` circle.
5. Bob discovers and joins the circle.
6. Bob posts `Wrote Pharos testnet guide` proof-of-work.
7. Alice reviews Bob's contribution.
8. Bob's reputation increases.
9. Bob claims role.
10. Alice slashes invalid endorsement if needed.
11. Bob's reputation and contribution endorsement count update.

### Acceptance criteria

- Demo can be completed without manually copying circle ID in normal flow.
- Demo can be completed without manually creating contribution ID in normal flow.
- Alice/Bob wallet switching clears stale form state.
- RPC failures show recoverable UI.
- Last transaction/status is visible.
- README demo story and UI flow match.

## 12. Phase 10 — Documentation Cleanup

### Goal

Keep docs aligned with the actual product.

### Required docs to maintain

- `REPURING_PRODUCT_DESIGN_V1.md`
- `REPURING_UX_UI_SPEC_V1.md`
- `REPURING_SYSTEM_FLOW_SPEC_V1.md`
- `REPURING_DELIVERY_PHASES_V1.md`
- README demo section

### Acceptance criteria

- README does not contradict product docs.
- Product docs do not claim mainnet/token/NFT functionality.
- Product docs clearly state Canopy testnet/local environment.
- Dev-facing TODOs are separated from user-facing product claims.

## 13. Suggested Implementation Order

Recommended order for engineering issues:

```text
P0-1 Product language cleanup
P0-2 Overview next-step journey checklist
P0-3 Circle discovery/open community UX
P0-4 Community Workspace centralization
P0-5 Auto-generate contribution ID
P0-6 Review work UX and self-review guards
P0-7 Leaderboard/role wording cleanup
P0-8 Card-based admin slash flow
P0-9 Alice/Bob demo QA
```

Then:

```text
P1-1 Better loading/error states
P1-2 Contribution detail view
P1-3 Review history polish
P1-4 Joined communities switcher polish
P1-5 Testnet status panel polish
```

Future only:

```text
P2-1 Timestamps/created height
P2-2 Circle-scoped reputation
P2-3 Weighted endorsements
P2-4 Anti-farming checks
P2-5 Token/NFT/reward extensions
```

## 14. Definition of Done for MVP Productization

The MVP productization work is done when:

- RepuRing clearly reads as a Social-Fi Web3 app.
- The app explicitly runs in Canopy testnet/local context.
- The core loop is visible and usable.
- Users are guided through missing prerequisites.
- Normal users do not need to memorize or manually create technical IDs.
- Contribution posting and peer review feel social, not only transactional.
- Reputation and role progression are understandable.
- Admin moderation is card-based and safe.
- The Alice/Bob demo works from UI.
- No MVP screen implies token, NFT, staking, or mainnet reward mechanics.

## 15. What Not To Build Yet

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

## 16. Final Delivery Principle

Build the smallest complete Social-Fi loop first:

```text
Alice creates a community.
Bob joins.
Bob posts useful work.
Alice reviews it.
Bob gains reputation.
Bob claims role.
Alice can moderate invalid reviews.
```

If this loop feels clear, RepuRing feels real.
If this loop feels confusing, adding more features will make the product worse.
