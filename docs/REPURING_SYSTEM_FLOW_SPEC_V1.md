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
Endorsements
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

Rules:

- Only active contributions can be reviewed.
- Contribution author cannot review their own contribution.
- Contribution feed should be scoped to selected circle.
- In MVP, contribution ID should be auto-generated in normal UI.

### 2.6 Endorsements

Endorsements are peer reviews with reputation impact.

Possible endorsement states:

```text
ACTIVE
SLASHED
```

Rules:

- A contribution endorsement adds +1 reputation to the contribution author.
- Duplicate endorsement from the same reviewer to the same contribution is not allowed.
- Self-endorsement is not allowed.
- Slashed endorsement reduces target contributor reputation by 2, floored at 0.
- If endorsement is linked to a contribution, slashing decrements endorsement count by 1, floored at 0.

### 2.7 Leaderboard

Leaderboard shows contributors ranked in selected community context.

MVP rule:

```text
Leaderboard uses global profile reputation displayed within selected circle context.
```

Do not claim circle-specific reputation until the protocol supports it.

### 2.8 Role

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

### 2.9 CanopyRpcStatus

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

### 3.1 NEED_WALLET

Condition:

```text
selected wallet is missing
```

User message:

```text
Select a local signing wallet to start using RepuRing.
```

Primary action:

```text
Select wallet
```

### 3.2 NEED_PROFILE

Condition:

```text
wallet selected AND profile missing
```

User message:

```text
Create your contributor profile before joining communities or posting work.
```

Primary action:

```text
Create profile
```

### 3.3 NEED_CIRCLE

Condition:

```text
profile exists AND no circle selected or selected circle not found
```

User message:

```text
Create or join a community circle to start the Social-Fi loop.
```

Primary action:

```text
Discover circles
```

### 3.4 NEED_MEMBERSHIP

Condition:

```text
profile exists AND circle loaded AND current wallet is not member
```

User message:

```text
Join this community before posting proof-of-work or reviewing contributions.
```

Primary action:

```text
Join community
```

### 3.5 READY_TO_POST

Condition:

```text
profile exists AND circle loaded AND member AND no contribution posted by current user or circle feed is empty
```

User message:

```text
Post proof-of-work to start building reputation.
```

Primary action:

```text
Post proof-of-work
```

### 3.6 READY_TO_REVIEW

Condition:

```text
profile exists AND circle loaded AND member AND contribution exists from another member
```

User message:

```text
Review useful work from another member to help validate community contributions.
```

Primary action:

```text
Review work
```

### 3.7 HAS_REPUTATION

Condition:

```text
profile.reputation > 0
```

User message:

```text
Your peer-reviewed work is building reputation.
```

Primary action:

```text
View leaderboard
```

### 3.8 READY_TO_CLAIM_ROLE

Condition:

```text
profile exists AND circle loaded AND member
```

User message:

```text
Claim your community role from your current reputation.
```

Primary action:

```text
Claim role
```

### 3.9 ROLE_CLAIMED

Condition:

```text
role exists for selected circle and current address
```

User message:

```text
Your role is claimed for this community.
```

Primary action:

```text
Continue contributing
```

### 3.10 ADMIN_MODERATION_AVAILABLE

Condition:

```text
current address equals selected circle creator/admin address
```

User message:

```text
You can moderate invalid reviews in this community.
```

Primary action:

```text
Open moderation
```

## 4. Transaction Preconditions

## 4.1 Create Profile

User action:

```text
Create profile
```

Transaction:

```text
createProfile
```

Required state:

- wallet selected
- username not empty
- wallet has no profile
- username not already taken
- valid signing password

Fields:

- senderAddress from selected wallet
- username
- bio
- avatarUrl

Success result:

- profile stored
- reputation initialized at 0

Failure handling:

- show clear message for missing username
- show clear message for duplicate profile or username
- show clear message for signing failure

## 4.2 Update Profile

User action:

```text
Update profile
```

Transaction:

```text
updateProfile
```

Required state:

- wallet selected
- profile exists
- valid signing password

Fields:

- senderAddress
- bio
- avatarUrl

Success result:

- profile bio/avatar update
- username unchanged
- reputation unchanged

## 4.3 Create Community Circle

User action:

```text
Create community circle
```

Transaction:

```text
createCircle
```

Required state:

- wallet selected
- profile exists
- circle ID not empty
- circle name not empty
- circle ID not already used
- valid signing password

Fields:

- senderAddress
- circleId
- name
- description

Success result:

- circle stored
- creator set to sender
- creator added as first member
- selected circle should switch to created circle

UX expectation:

- normal UI suggests/generated circle ID from name
- manual ID may be advanced option

## 4.4 Join Community

User action:

```text
Join community
```

Transaction:

```text
joinCircle
```

Required state:

- wallet selected
- profile exists
- circle exists
- sender is not already member
- valid signing password

Fields:

- senderAddress
- circleId

Success result:

- member index stored
- circle member list updated
- community workspace becomes available

## 4.5 Post Proof-of-Work

User action:

```text
Post proof-of-work
```

Transaction:

```text
createContribution
```

Required state:

- wallet selected
- profile exists
- circle exists
- sender is member
- contribution ID not empty
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

Success result:

- contribution stored
- contribution indexed by circle
- contribution indexed by author
- endorsement count initialized at 0

UX expectation:

- normal UI auto-generates contribution ID
- proof URL should be treated as evidence link
- contribution appears in selected circle feed after refresh

## 4.6 Review / Endorse Work

User action:

```text
Review / endorse work
```

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

Success result:

- endorsement stored
- endorsement indexed by circle
- endorsement indexed by target user
- endorsement indexed by contribution
- author reputation +1
- contribution endorsement count +1

UX expectation:

- review message appears as a peer review/comment under the contribution
- author reputation refreshes after Canopy state update

## 4.7 Legacy Member Endorsement

User action:

```text
Legacy endorse member
```

Transaction:

```text
endorseUser
```

Required state:

- wallet selected
- profile exists
- target profile exists
- sender and target are both circle members
- sender is not target
- pair endorsement not already present in circle
- tag allowed
- valid signing password

MVP UX recommendation:

- keep this path secondary or advanced
- primary review flow should be contribution-based endorsement

## 4.8 Claim Role

User action:

```text
Claim role
```

Transaction:

```text
claimRole
```

Required state:

- wallet selected
- profile exists
- sender is member of selected circle
- valid signing password

Fields:

- senderAddress
- circleId

Success result:

- role stored for circle + sender
- role derived from current global reputation

UX expectation:

- role card updates after refresh
- show next role threshold even after claim

## 4.9 Slash Invalid Review

User action:

```text
Slash invalid review
```

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

Fields:

- senderAddress
- endorsementId
- reason

Success result:

- endorsement marked slashed
- slash reason stored
- target reputation reduced by 2, floored at 0
- linked contribution endorsement count reduced by 1, floored at 0

UX expectation:

- admin selects endorsement from review card
- manual endorsement ID entry is not primary UX
- show impact confirmation before submit

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
→ Wait for peer review
→ Gain reputation
→ Claim role
```

Success condition:

- user has profile
- user is member of a circle
- user has at least one contribution
- user can see reputation/role progress

## 6.2 Circle Creator Flow

```text
Open /repuring
→ Select wallet
→ Create profile
→ Create community circle
→ Open Community Workspace
→ Invite/demo another member to join
→ Review member contribution
→ Monitor leaderboard
→ Slash invalid review if needed
```

Success condition:

- creator is first member
- creator can see admin controls
- creator can review others but not own work
- creator can slash valid endorsement IDs from review cards

## 6.3 Peer Reviewer Flow

```text
Join a community
→ Browse proof-of-work feed
→ Select another member's contribution
→ Inspect proof URL
→ Write review message
→ Submit peer endorsement
→ See author reputation update after refresh
```

Success condition:

- reviewer cannot endorse own work
- duplicate endorsement is blocked
- author reputation increases after valid review

## 6.4 Role Claim Flow

```text
Have profile
→ Join selected circle
→ Gain reputation through endorsements
→ Open role progress
→ Submit claim role
→ Role stored and displayed in selected circle context
```

Success condition:

- role matches current reputation threshold
- role remains scoped to selected circle

## 6.5 Moderation Flow

```text
Creator/admin opens Admin page
→ Sees review queue
→ Selects invalid review
→ Enters slash reason
→ Confirms reputation impact
→ Submits slash transaction
→ Review marked slashed
→ Target reputation decreases
→ Contribution endorsement count updates if linked
```

Success condition:

- non-admin cannot slash
- already slashed review cannot be slashed again
- reason is required

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

Condition:

```text
circleId exists in UI but query returns not found
```

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

## 8. State Integrity Rules

1. Never show user as member unless membership is loaded or creator/admin relation confirms it.
2. Never allow self-review submission.
3. Never allow normal users to slash reviews.
4. Never present global reputation as circle-specific reputation.
5. Never claim token/financial reward exists in MVP.
6. Never require users to memorize IDs in normal UX.
7. Never make manual endorsement ID entry the primary admin flow.
8. Always show selected community context before circle-scoped actions.
9. Always refresh after transaction submit.
10. Always preserve Canopy testnet/local environment wording.

## 9. System Flow Acceptance Checklist

The system flow is correct when:

- New user can move from no wallet to profile to community to contribution.
- Two-account demo can run with Alice and Bob.
- Bob can post work and Alice can review it.
- Bob's reputation increases after Alice's review.
- Bob can claim role from reputation.
- Alice can slash invalid review as creator/admin.
- Non-admin cannot slash.
- Bob cannot review Bob's own work.
- Duplicate review is prevented.
- Selected circle controls feed, reviews, leaderboard, and role context.
- RPC errors are recoverable with refresh.
