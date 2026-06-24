# RepuRing System Flow Specification v1

## 0. Scope

This document defines the product-level system flows, state rules, transaction preconditions, query refresh behavior, and edge cases for RepuRing MVP.

RepuRing MVP is a Social-Fi Web3 app for contributor communities on Canopy testnet/local Canopy test environment.

This document is not a protocol rewrite. It describes how the existing RepuRing product should behave from the user's perspective and how the UI should coordinate with Canopy state.

## 1. Core Product State

The RepuRing UI should always reason about these state objects:

```text
SelectedWallet
Profile
SelectedCircle
CircleMembership
Contributions
ContributionPostFlow
Endorsements
CurrentReviewerEndorsement
Leaderboard
Role
CanopyRpcStatus
LastTransaction
```

## 2. Core State Definitions

### 2.1 SelectedWallet

A wallet is selected when the app has a current local signing account address.

Possible states:

```text
NO_WALLET
WALLET_SELECTED
```

Rules:

- No transaction can be submitted without a selected wallet.
- The selected wallet determines the sender address.
- Switching wallet must clear stale password and action-specific form state.

### 2.2 Profile

A profile is the onchain contributor identity linked to the selected wallet.

Possible states:

```text
NO_PROFILE
PROFILE_ACTIVE
PROFILE_QUERY_ERROR
```

Rules:

- Profile is required before joining circles, creating circles, posting proof-of-work, reviewing work, or claiming role.
- Profile username is treated as permanent in MVP.
- Bio and avatar can be updated.
- Reputation belongs to profile-level/global state in MVP.

### 2.3 SelectedCircle

A selected circle is the current community context used by contributions, reviews, leaderboard, role, and admin actions.

Possible states:

```text
NO_CIRCLE_SELECTED
CIRCLE_SELECTED_NOT_FOUND
CIRCLE_LOADED
```

Rules:

- A selected circle ID can exist even if the circle has not loaded yet.
- If the selected circle is not found, the user should be guided to discover or create a circle.
- Switching selected circle should refresh contributions, endorsements, leaderboard, role, and membership state.
- SelectedCircle is the single context source for contribution feed, review work, leaderboard, role, and admin pages.
- Normal UI must not maintain independent manual circle IDs on those pages.

### 2.4 CircleMembership

Membership describes whether the selected wallet/profile belongs to the selected circle.

Possible states:

```text
NO_WALLET
NO_PROFILE
NOT_MEMBER
MEMBER
CREATOR_ADMIN
```

Rules:

- Creator/admin is also treated as a member.
- Only members can post proof-of-work.
- Only members can review/endorse contribution work.
- Only members can claim a role in the selected circle.
- Only creator/admin can slash endorsements.

### 2.5 Contributions

Contributions are proof-of-work posts inside the selected circle.

Possible contribution states:

```text
ACTIVE
SLASHED
```

UI-derived post states:

```text
DRAFT
READY_TO_SUBMIT
SUBMITTED_CHECKING_FEED
VISIBLE_IN_FEED
SUBMITTED_NOT_VISIBLE_YET
FAILED
```

Rules:

- Only active contributions can be reviewed.
- Contribution author cannot review their own contribution.
- Contribution feed should be scoped to selected circle.
- In MVP, contribution ID should be auto-generated in normal UI.
- `CreateContributionTx` success is not considered product-visible until the submitted contribution ID appears in `contributions-in-circle` for the selected circle.
- If the contribution is not visible after refresh, show a recoverable notice.
- Provider/default form state must not include a fixed contribution ID such as `pharos-guide`.
- Contribution ID is generated per post in normal UI.

### 2.6 ContributionPostFlow

ContributionPostFlow tracks the product-level result of posting proof-of-work.

State machine:

```text
DRAFT
→ READY_TO_SUBMIT
→ SUBMITTED_CHECKING_FEED
→ VISIBLE_IN_FEED
```

Recoverable branch:

```text
SUBMITTED_CHECKING_FEED
→ SUBMITTED_NOT_VISIBLE_YET
→ user refreshes
→ VISIBLE_IN_FEED or SUBMITTED_NOT_VISIBLE_YET
```

Failure branch:

```text
READY_TO_SUBMIT
→ FAILED
→ user corrects input/signing/RPC issue
→ READY_TO_SUBMIT
```

Required stored values:

- submitted contribution ID
- selected circle ID at submission time
- transaction response / last tx
- visibility check status
- friendly error if failed

Rules:

- Keep composer open on failure.
- Show visible state near composer/feed after submit.
- Do not call the post flow complete until the submitted ID appears in selected circle feed.
- If selected circle changes before visibility check finishes, the UI should either finish the check against the original submission circle or clearly mark the check as stale.

### 2.7 Endorsements

Endorsements are peer reviews with reputation impact.

Possible endorsement states:

```text
ACTIVE
SLASHED
```

UI-derived review states:

```text
NOT_SELECTED
READY_TO_REVIEW
OWN_CONTRIBUTION
SLASHED_CONTRIBUTION
ALREADY_REVIEWED_BY_CURRENT_WALLET
CONFIRMING_REVIEW
SUBMITTED_REVIEW
ACTIVE
SLASHED
```

CurrentReviewerEndorsement is detected by matching:

- selected contribution ID
- selected/current circle ID
- current wallet address equals `endorsement.fromAddress`
- endorsement is not slashed

Rules:

- A contribution endorsement adds +1 reputation to the contribution author.
- Duplicate endorsement from the same reviewer to the same contribution is not allowed.
- Self-endorsement is not allowed.
- Slashed endorsement reduces target contributor reputation by 2, floored at 0.
- If endorsement is linked to a contribution, slashing decrements endorsement count by 1, floored at 0.
- Duplicate endorsement is rejected by protocol and must also be blocked by UI before submit.
- If already reviewed, show the existing review, disable Review and continue, and do not show Cancel endorsement.
- Reviewer self-cancel is unsupported in MVP.
- Creator/admin `SlashEndorsementTx` is the only MVP correction path.

### 2.8 CurrentReviewerEndorsement

CurrentReviewerEndorsement is the UI's view of whether the selected wallet has already endorsed the selected contribution.

Possible states:

```text
NONE
ACTIVE_REVIEW_FOUND
SLASHED_REVIEW_FOUND
UNKNOWN_QUERY_PENDING
```

Rules:

- `ACTIVE_REVIEW_FOUND` blocks duplicate review submission.
- `ACTIVE_REVIEW_FOUND` shows Already endorsed notice and the existing review.
- `SLASHED_REVIEW_FOUND` should show history if available, but must not imply the user can self-cancel.
- If query is pending, disable final submission until duplicate status is known or show clear loading state.

### 2.9 Leaderboard

Leaderboard shows contributors ranked in selected community context.

MVP rule:

```text
Leaderboard uses global profile reputation displayed within selected circle context.
```

Do not claim circle-specific reputation until the protocol supports it.

### 2.10 Role

Role is a circle-based status claimed from current global reputation.

Role thresholds:

```text
0..4   Newbie
5..14  Trusted
15..29 Core Member
30+    Circle Leader
```

Rules:

- User must have profile.
- User must be a member of selected circle.
- Role is stored for selected circle.
- Role is derived from current global reputation.

### 2.11 CanopyRpcStatus

Canopy RPC status describes whether local/testnet services are reachable.

Possible states:

```text
UNKNOWN
READY
QUERY_FAILED
TX_FAILED
ADMIN_RPC_FAILED
```

Rules:

- Query/tx RPC should be shown as Canopy testnet/local RPC.
- Admin/keystore RPC should be shown only where signing/local wallet is relevant.
- RPC errors should be paired with user-friendly recovery steps.

## 3. Global App State Machine

The main user journey can be represented as:

```text
START
→ NEED_WALLET
→ NEED_PROFILE
→ NEED_CIRCLE
→ NEED_MEMBERSHIP
→ READY_TO_POST
→ READY_TO_REVIEW
→ HAS_REPUTATION
→ READY_TO_CLAIM_ROLE
→ ROLE_CLAIMED
→ ADMIN_MODERATION_AVAILABLE, if creator/admin
```

## 4. Transaction Preconditions

## 4.1 Create Profile

Required state:

- wallet selected
- username not empty
- wallet has no profile
- username not already taken
- valid signing password

Success result:

- profile stored
- reputation initialized at 0

## 4.2 Update Profile

Required state:

- wallet selected
- profile exists
- valid signing password

Success result:

- profile bio/avatar update
- username unchanged
- reputation unchanged

## 4.3 Create Community Circle

Required state:

- wallet selected
- profile exists
- circle ID not empty
- circle name not empty
- circle ID not already used
- valid signing password

Success result:

- circle stored
- creator set to sender
- creator added as first member
- selected circle should switch to created circle

UX expectation:

- normal UI suggests/generated circle ID from name
- manual ID may be advanced option

## 4.4 Join Community

Required state:

- wallet selected
- profile exists
- circle exists
- sender is not already member
- valid signing password

Success result:

- member index stored
- circle member list updated
- community workspace becomes available

## 4.5 Post Proof-of-Work

Transaction:

```text
createContribution
```

Required state:

- wallet selected
- profile exists
- circle exists
- sender is member
- generated contribution ID exists
- contribution title not empty
- contribution category allowed
- contribution ID not already used
- valid signing password

Fields:

- senderAddress
- contributionId
- circleId
- title
- description
- proofUrl
- category

Success result at protocol level:

- contribution stored
- contribution indexed by circle
- contribution indexed by author
- endorsement count initialized at 0

Success result at product level:

- submitted contribution ID appears in `contributions-in-circle` for selected circle
- UI shows `Contribution posted and visible in the feed.`

UX expectation:

- normal UI auto-generates contribution ID
- provider/default form state must not ship with fixed contribution IDs such as `pharos-guide`
- proof URL should be treated as evidence link
- contribution appears in selected circle feed after refresh
- if not visible after refresh, show recoverable notice instead of silent failure

## 4.6 Review / Endorse Work

Transaction:

```text
endorseContribution
```

Required state:

- wallet selected
- profile exists
- contribution exists
- contribution not slashed
- sender is not contribution author
- sender is member of contribution circle
- sender has not already endorsed this contribution
- tag allowed
- valid signing password

Fields:

- senderAddress
- contributionId
- tag
- message

Success result at protocol level:

- endorsement stored
- endorsement indexed by circle
- endorsement indexed by target user
- endorsement indexed by contribution
- author reputation +1
- contribution endorsement count +1

Success result at product level:

- review appears under contribution
- author reputation refreshes
- contribution endorsement count refreshes
- current reviewer state becomes Already endorsed

UX expectation:

- review message appears as a peer review/comment under the contribution
- author reputation refreshes after Canopy state update
- confirmation warns that endorsement cannot be self-cancelled in MVP

## 4.7 Legacy Member Endorsement

Transaction:

```text
endorseUser
```

MVP UX recommendation:

- keep this path secondary or advanced
- primary review flow should be contribution-based endorsement
- label it clearly as legacy direct user endorsement

## 4.8 Claim Role

Required state:

- wallet selected
- profile exists
- sender is member of selected circle
- valid signing password

Success result:

- role stored for circle + sender
- role derived from current global reputation

## 4.9 Slash Invalid Review

Transaction:

```text
slashEndorsement
```

Required state:

- wallet selected
- profile exists
- endorsement exists
- endorsement not already slashed
- selected wallet is creator/admin of endorsement circle
- slash reason not empty
- valid signing password

Success result:

- endorsement marked slashed
- slash reason stored
- target reputation reduced by 2, floored at 0
- linked contribution endorsement count reduced by 1, floored at 0

UX expectation:

- admin selects endorsement from review card
- manual endorsement ID entry is not primary UX
- show impact confirmation before submit
- reviewer withdrawal is not part of MVP

## 5. Query and Refresh Flow

## 5.1 Initial load

On app load or route entry:

```text
load selected wallet
→ query profile if wallet exists
→ query list circles
→ query selected circle if circleId exists
→ query role if wallet and circle exist
→ query contributions if circle exists
→ query endorsements if wallet/circle exists
→ query leaderboard if circle exists
```

## 5.2 After wallet switch

When selected wallet changes:

Clear:

- password
- target address
- selected endorsement ID
- stale slash reason if needed
- profile form draft if tied to old wallet
- selected contribution if it is now own work and cannot be reviewed
- current reviewer endorsement state

Refresh:

- profile
- role
- membership
- joined communities
- current circle context
- endorsements relevant to current wallet/circle

Do not clear selected circle automatically unless the selected circle becomes invalid.

## 5.3 After circle switch

When selected circle changes:

Refresh:

- circle
- membership
- role
- contributions in circle
- endorsements in circle
- leaderboard
- current reviewer endorsement state

Show context notice:

```text
Community switched. Contributions, reviews, leaderboard, and role actions now use this community.
```

## 5.4 After transaction submit

After any transaction:

```text
show pending/submitted status
→ wait for commit/state update
→ refresh relevant queries
→ show success or updated state
```

Recommended UX:

- do not assume state changed instantly
- show `submitted` first
- refresh at least twice if local Canopy state has commit delay

### After CreateContributionTx

1. Store submitted contribution ID.
2. Refresh `contributions-in-circle` for selected circle.
3. Verify submitted ID appears.
4. Show visible success if found.
5. Show submitted-not-visible-yet notice if not found after refresh.

### After EndorseContributionTx

1. Refresh contribution endorsements.
2. Verify review appears under the contribution.
3. Refresh author reputation.
4. Refresh contribution endorsement count.
5. Show Already endorsed state for the current reviewer.

### After SlashEndorsementTx

1. Verify endorsement slashed status.
2. Verify slash reason.
3. Verify target reputation decrement.
4. Verify linked contribution endorsement count decrement if applicable.

## 5.5 Query failure

If query fails:

- keep existing UI structure
- show clear RPC failure message
- allow manual refresh
- do not wipe all user input unless required

Example:

```text
Canopy state query failed. Start or check local/testnet RPC and refresh.
```

## 6. User Journey Flows

## 6.1 New Contributor Flow

```text
Open /repuring
→ Select wallet in My Account
→ Create profile
→ Discover circles
→ Join a community circle
→ Open Community Workspace
→ Post proof-of-work
→ UI verifies contribution appears in feed
→ Wait for peer review
→ Gain reputation
→ Claim role
```

## 6.2 Circle Creator Flow

```text
Open /repuring
→ Select wallet
→ Create profile
→ Create community circle
→ Open Community Workspace
→ Invite/demo another member to join
→ Review member contribution
→ Already endorsed state blocks duplicate review
→ Monitor leaderboard
→ Slash invalid review if needed
```

## 6.3 Peer Reviewer Flow

```text
Join a community
→ Browse proof-of-work feed
→ Select another member's contribution
→ Inspect proof URL
→ Confirm peer review with finality warning
→ Write review message
→ Submit peer endorsement
→ See author reputation update after refresh
→ See Already endorsed if selecting the same contribution again
```

## 6.4 Role Claim Flow

```text
Have profile
→ Join selected circle
→ Gain reputation through endorsements
→ Open role progress
→ Submit claim role
→ Role stored and displayed in selected circle context
```

## 6.5 Moderation Flow

```text
Creator/admin opens Admin page
→ Sees review queue
→ Selects invalid review card
→ Enters slash reason
→ Confirms reputation impact
→ Submits slash transaction
→ Review marked slashed
→ Target reputation decreases
→ Contribution endorsement count updates if linked
```

## 7. Edge Cases

## 7.1 User has wallet but no profile

Block:

- create circle
- join circle
- post contribution
- review work
- claim role

Allow:

- create profile
- read public circle/contribution data if available

## 7.2 User selected stale circle ID

Behavior:

- show selected community not found
- offer discover/create circles
- do not submit circle-scoped actions

## 7.3 User tries to post before joining

Behavior:

- disable submit
- show `Join this community before posting proof-of-work`
- provide join CTA

## 7.4 User tries to review own contribution

Behavior:

- disable review submit
- show `You cannot review your own work. Switch to another member account.`

## 7.5 Duplicate endorsement

Behavior:

- if known in UI, disable submit and show already reviewed
- show existing review
- do not show Cancel endorsement
- if returned from contract, show friendly error and refresh endorsements

## 7.6 Slashed endorsement

Behavior:

- show slashed badge
- show slash reason
- hide/disable slash action
- keep review visible for auditability

## 7.7 Wrong wallet password

Behavior:

- transaction should not submit
- show signing-specific error
- do not clear the whole form

## 7.8 RPC offline

Behavior:

- show RPC setup warning
- preserve user form input
- allow refresh
- technical ports may be displayed in testnet readiness panel

## 7.9 Submitted contribution not visible yet

Behavior:

- show `Contribution submitted but not visible yet. Refresh again or check transaction status.`
- keep submitted ID visible as onchain record ID
- provide Refresh feed action
- do not mark flow complete until visible or user leaves knowingly

## 8. State Integrity Rules

1. Never show user as member unless membership is loaded or creator/admin relation confirms it.
2. Never allow self-review submission.
3. Never allow duplicate endorsement submission when already-endorsed state is known.
4. Never show fake Cancel endorsement / Withdraw endorsement in MVP.
5. Never allow normal users to slash reviews.
6. Never present global reputation as circle-specific reputation.
7. Never claim token/financial reward exists in MVP.
8. Never require users to memorize IDs in normal UX.
9. Never make manual endorsement ID entry the primary admin flow.
10. Always show selected community context before circle-scoped actions.
11. Always refresh after transaction submit.
12. Always verify posted contribution feed visibility.
13. Always preserve Canopy testnet/local environment wording.

## 9. System Flow Acceptance Checklist

The system flow is correct when:

- New user can move from no wallet to profile to community to contribution.
- Two-account demo can run with Alice and Bob.
- Bob can post work without manually typing contribution ID.
- UI confirms Bob's post is visible in selected community feed.
- Alice can review Bob's contribution once.
- Alice sees Already endorsed if selecting Bob's same contribution again.
- UI does not show Cancel endorsement.
- Bob cannot review Bob's own work.
- Bob's reputation increases after Alice's review.
- Bob can claim role from reputation.
- Alice can slash invalid review as creator/admin.
- Non-admin cannot slash.
- Duplicate review is prevented.
- Selected circle controls feed, reviews, leaderboard, and role context.
- RPC errors are recoverable with refresh.
