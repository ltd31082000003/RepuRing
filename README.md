# RepuRing

RepuRing is an onchain Social-Fi contribution network where Web3 contributors post proof-of-work, receive peer endorsements, earn reputation, and claim community roles.

## What It Does

RepuRing extends the Canopy template with custom plugin transactions for an onchain contribution graph:

- create a social profile,
- create and join Web3 community circles,
- post contribution proofs inside a circle,
- endorse useful contribution proofs,
- increase reputation from endorsed work,
- slash invalid endorsements as the circle creator/admin,
- claim a role from the current reputation score.

It is Social-Fi because contributor identity, community membership, contribution proofs, endorsements, reputation, and roles are signed transactions committed to Canopy plugin state rather than frontend-only metadata.

## Why It Is Social-Fi

RepuRing turns contribution activity into verifiable social capital:

- **Profile** is an onchain contributor identity.
- **Circle** is a Web3 contributor community hub.
- **Contribution** is a proof-of-work post linked to that community.
- **Endorsement** is peer validation from another circle member.
- **Reputation** is earned social capital from endorsed contribution proofs.
- **Role** is community status derived from current profile reputation.
- **Slashing** is creator/admin moderation against invalid endorsements.

## Contest Theme Fit

RepuRing matches the Social-Fi theme through four connected onchain graphs and state transitions:

- a social graph formed by contributor profiles and circle memberships,
- a contribution graph formed by proof-of-work posts,
- a reputation economy driven by peer endorsements,
- role progression stored onchain through ClaimRoleTx.

The current score is profile-level reputation displayed in selected community context. Circle-scoped scoring and anti-Sybil controls are outside the current implementation.

## What Is Stored In Plugin State

The TypeScript plugin deterministically stores:

- profiles and the unique username index,
- community circles and memberships,
- contribution proofs and circle/author indexes,
- endorsement records and duplicate-prevention indexes,
- profile reputation updated by endorsements and slashing,
- claimed roles for a circle,
- slashed endorsement status and reason.
## Implementation

The working implementation is in the TypeScript plugin template:

- `plugin/typescript/proto/tx.proto`
- `plugin/typescript/src/contract/contract.ts`
- `plugin/typescript/src/contract/plugin.ts`

This follows `plugin/typescript/AGENTS.md`: protobuf messages are registered in `ContractConfig`, decoded in `FromAny()`, statelessly validated in `CheckTx`, and applied deterministically in `DeliverTx` through `StateRead` / `StateWrite`.

## Custom Transactions

| Transaction | State transition |
| --- | --- |
| `createProfile` | Stores profile under signer address and initializes reputation to `0`. |
| `updateProfile` | Updates the profile bio and avatar URL while preserving username and reputation. |
| `createCircle` | Stores a unique circle, sets creator/admin, and adds creator as first member. |
| `joinCircle` | Adds signer to an existing circle member list. |
| `createContribution` | Stores a contribution proof, indexes it by circle and author, and initializes endorsement count to `0`. |
| `endorseContribution` | Stores one endorsement per sender/contribution, increments contribution endorsement count, and adds `+1` reputation to the author. |
| `endorseUser` | Backward-compatible member endorsement that adds `+1` reputation to a target member. |
| `slashEndorsement` | Marks an endorsement slashed, subtracts `2` reputation floored at `0`, and decrements linked contribution endorsement count when applicable. |
| `claimRole` | Stores/updates the signer role for a circle. |

Allowed tags: `builder`, `helper`, `creator`, `leader`, `trusted`.

Contribution categories: `builder`, `helper`, `creator`, `researcher`, `tester`, `educator`.

Role thresholds:

- `0..4`: `Newbie`
- `5..14`: `Trusted`
- `15..29`: `Core Member`
- `30+`: `Circle Leader`

## RPC Ports

- `50002`: Canopy query and transaction RPC.
- `50003`: Canopy admin / keystore RPC.

`.env.example` contains the same defaults for scripts.

## Build

Build the RepuRing TypeScript plugin:

```bash
cd plugin/typescript
npm install
npm run build:all
```

Build the wallet frontend:

```bash
cd cmd/rpc/web/wallet
npm install
npm run build
```

## Run Local Chain

RepuRing uses one supported local runtime for development and contest demos. Prerequisites are Go, npm, and Node.js 20.19+ or 22.12+ (Node 22 LTS recommended):

- Windows
- Go native Canopy node (canopy.exe)
- TypeScript RepuRing plugin started by Canopy
- query/transaction RPC on port 50002
- admin/keystore RPC on port 50003

Docker, Ubuntu, and WSL are not part of the RepuRing run path.

Build all native runtime components from PowerShell:

~~~powershell
cd C:\Users\Admin\Downloads\RepuRing
powershell -ExecutionPolicy Bypass -File .\scripts\windows-native\build.ps1
~~~

Start the local chain:

~~~powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows-native\start.ps1
~~~

The start script preserves the existing %USERPROFILE%\.canopy\config.json, sets plugin to typescript, verifies that ports 50002 and 50003 are available, and then runs canopy.exe start from the repository root.

Verify both RPC listeners in another PowerShell window:

~~~powershell
Test-NetConnection 127.0.0.1 -Port 50002
Test-NetConnection 127.0.0.1 -Port 50003
~~~

Both commands must report TcpTestSucceeded : True. If Windows reports that either port is reserved, close software that owns Hyper-V/HNS networking and resolve the Windows port reservation before starting Canopy. Do not change the RepuRing RPC ports.

The equivalent manual commands are:

~~~powershell
cd C:\Users\Admin\Downloads\RepuRing\plugin\typescript
npm install
npm run build:all

cd C:\Users\Admin\Downloads\RepuRing\cmd\rpc\web\wallet
npm install
npm run build

cd C:\Users\Admin\Downloads\RepuRing\cmd\rpc\web\explorer
npm install
npm run build

cd C:\Users\Admin\Downloads\RepuRing
$env:GOTELEMETRY = "off"
go build -o .\canopy.exe .\cmd\main
.\canopy.exe start
~~~

## Run Web UI

```bash
cd cmd/rpc/web/wallet
npm run dev -- --host 127.0.0.1 --port 5173
```

Open:

```text
http://127.0.0.1:5173/repuring
```

The RepuRing UI is a route-based Social-Fi dApp:

| Route | Purpose |
| --- | --- |
| `/repuring` | Overview dashboard, product story, RPC status, current profile/reputation/role. |
| `/repuring/circles` | Create, discover, join, and open community circles. |
| `/repuring/contributions` | Post proof-of-work and browse the selected community feed. |
| `/repuring/endorse` | Review another member's contribution and submit a peer endorsement; `EndorseUserTx` remains advanced/legacy compatibility. |
| `/repuring/leaderboard` | View global profile reputation rankings in the selected community context. |
| `/repuring/admin` | Claim role and slash invalid reviews as the creator/admin. |
| `/key-management` | My Account: create/select local signing keys, submit `CreateProfileTx`, and submit `UpdateProfileTx`. |

The RepuRing pages sign custom plugin transactions in the browser, submit them to `http://localhost:50002/v1/tx`, and refresh profile, circle, contribution, endorsement, role, and leaderboard state from the RepuRing query routes. They do not use a mocked transaction path for the main flow.

## Technical Demo Path

This is the real browser demo flow used for multi-account (Alice/Bob) testing:

1. Start the Go node so query/transaction RPC (50002) and admin/keystore RPC (50003) are listening.
2. Open `http://127.0.0.1:5173/repuring`, then open **My Account**.
3. Create Alice and Bob local signing wallets and create an onchain profile for each.
4. Create a community circle as Alice (`/repuring/circles`).
5. Switch to Bob and use **Discover circles** to select and join Alice's circle from its card — no need to remember the circle ID.
6. Post a contribution proof as Bob (`/repuring/contributions`).
7. Switch to Alice.
8. As Alice, select Bob's contribution on `/repuring/endorse` and write an endorsement review/comment message.
9. Confirm the review appears under the contribution (the "Reviews / comments" section on both the Endorse and Contributions pages).
10. Confirm Bob's profile reputation increases on `/repuring/leaderboard`.
11. Switch to Bob and claim his role on `/repuring/admin`.
12. Switch to Alice (circle creator/admin) and slash the endorsement if needed; reputation decreases.

Notes for the browser demo:

- **Circle discovery:** every created circle is listed from `/v1/query/repuring/circles` in the **Discover circles** section, so members join by clicking a card instead of memorizing circle IDs. A manual circle-ID input remains as an advanced fallback.
- **Comments / reviews:** endorsement messages are shown as peer review comments under each contribution. They are the `message` field of `EndorseContributionTx`, matched by `contribution_id` — there is **no separate CommentTx** in this version.
- **Multi-account safety:** switching Alice/Bob clears stale password/target/endorsement/profile-form state, keeps the selected circle, and avoids leaving an author's own contribution selected for endorsement. Impossible actions (self-endorsement, posting/joining without membership, slashing as a non-creator) are disabled in the UI before submit, with helper text explaining why.

## Demo Script

With the local chain running on ports `50002` and `50003`:

```bash
node scripts/demo/repuring-demo.mjs
```

The script:

1. Creates Alice and Bob keys through admin RPC.
2. Submits `createProfile` for Alice.
3. Submits `createProfile` for Bob.
4. Alice creates a `Pharos Builders` circle.
5. Bob joins.
6. Bob posts a contribution proof: `Wrote Pharos testnet guide`.
7. Alice endorses Bob's contribution with tag `builder`.
8. Queries Bob reputation and shows it increased.
9. Bob claims a role.
10. Queries the leaderboard.
11. Alice slashes the endorsement.
12. Queries Bob reputation again and shows it decreased.

Expected reputation transition for Bob in plugin state: `0 -> 1 -> 0`.

## Query Surface

The contract stores deterministic keys for:

- profile by address,
- username index,
- circle by `circle_id`,
- membership by `circle_id + address`,
- role by `circle_id + address`,
- contribution by `contribution_id`,
- contribution indexes by `circle_id` and author address,
- endorsement by deterministic `endorsement_id`,
- circle/user/contribution endorsement indexes.

The requested logical queries are exposed as HTTP POST routes on port `50002`:

| Logical query | RPC route | Body |
| --- | --- | --- |
| `getProfile(address)` | `/v1/query/repuring/profile` | `{ "address": "<hex>" }` |
| `getCircle(circle_id)` | `/v1/query/repuring/circle` | `{ "circleId": "pharos-builders" }` |
| `listCircles()` | `/v1/query/repuring/circles` | `{}` (read-only discovery of every circle) |
| `getCircleMembers(circle_id)` | `/v1/query/repuring/circle-members` | `{ "circleId": "pharos-builders" }` |
| `getReputation(address)` | `/v1/query/repuring/reputation` | `{ "address": "<hex>" }` |
| `getRole(circle_id, address)` | `/v1/query/repuring/role` | `{ "circleId": "pharos-builders", "address": "<hex>" }` |
| `getContribution(contribution_id)` | `/v1/query/repuring/contribution` | `{ "contributionId": "pharos-guide" }` |
| `getContributionsInCircle(circle_id)` | `/v1/query/repuring/contributions-in-circle` | `{ "circleId": "pharos-builders" }` |
| `getContributionsForUser(address)` | `/v1/query/repuring/contributions-for-user` | `{ "address": "<hex>" }` |
| `getEndorsementsForUser(address)` | `/v1/query/repuring/endorsements-for-user` | `{ "address": "<hex>" }` |
| `getEndorsementsInCircle(circle_id)` | `/v1/query/repuring/endorsements-in-circle` | `{ "circleId": "pharos-builders" }` |
| `getLeaderboard(circle_id)` | `/v1/query/repuring/leaderboard` | `{ "circleId": "pharos-builders" }` |

Each query also accepts optional `{ "height": 123 }` to read historical state through the Canopy time-machine path.

## Pre-submission Checklist

- [x] Custom plugin transactions are implemented and listed.
- [x] Contribution-based Social-Fi flow is explained.
- [x] RepuRing query routes are implemented and listed.
- [x] Demo script submits real RPC transactions.
- [x] Manual browser demo path is documented.
- [x] Current limitations are stated honestly.
- [x] No protocol-breaking changes were introduced during final freeze.
- [ ] Run `cd plugin/typescript && npm run build:all`.
- [ ] Run `cd plugin/typescript && npm test`.
- [ ] Run `cd cmd/rpc/web/wallet && npm run build`.
- [ ] Run `node --check scripts/demo/repuring-demo.mjs`.

## Verification Checklist

```bash
cd plugin/typescript && npm run build:all
cd plugin/typescript && npm test
cd cmd/rpc/web/wallet && npm run build
node --check scripts/demo/repuring-demo.mjs
```

Manual route flow:

- `/` redirects to `/repuring`.
- `/repuring` shows the RepuRing overview.
- `/key-management` opens My Account with local signing keys and RepuRing profile creation.
- `/repuring/circles` opens community discovery and creation.
- `/repuring/contributions` opens Post Work for proof-of-work posting and feed browsing.
- `/repuring/endorse` opens Review Work for peer endorsement.
- `/repuring/leaderboard` opens reputation rankings in the selected community context.
- `/repuring/admin` opens role claim and moderation.
- `/key-management` remains available for My Account, local signing keys, and RepuRing profile creation.

Live flow checklist:

- Start local Canopy RPC on ports `50002` and `50003`.
- Create/select an account and enter the signing password.
- Submit `CreateProfileTx`, `CreateCircleTx`, `JoinCircleTx`, `CreateContributionTx`, `EndorseContributionTx`, `ClaimRoleTx`, and `SlashEndorsementTx`.
- Confirm leaderboard and reputation changes come from RepuRing RPC query state.

## Manual QA Checklist

### Happy Path

- Create or select a local signing wallet and confirm it remains selected across RepuRing routes.
- Create a profile and verify username, bio, avatar, and initial reputation 0.
- Create a community circle as Alice.
- Switch to Bob, create Bob's profile, and join the same circle.
- Post a contribution proof as Bob and confirm it appears in the selected circle feed.
- Switch to Alice and endorse Bob's contribution with EndorseContributionTx.
- Confirm Bob's profile reputation increases and the contribution endorsement count increases.
- Confirm the selected circle leaderboard returns Bob with the updated reputation and derived role.
- Switch to Bob and submit ClaimRoleTx; confirm the stored role matches the thresholds.
- Switch to Alice as circle creator/admin and slash the endorsement.
- Confirm the endorsement is slashed, Bob's reputation decreases by 2 floored at 0, and the linked contribution endorsement count decreases.

### Failure And Edge Cases

- Submit without a selected wallet.
- Submit with a missing or incorrect signing password.
- Create a profile without a username.
- Reuse an existing username from another wallet.
- Reuse an existing circle ID.
- Join the same circle twice.
- Post a contribution before joining the selected circle.
- Reuse an existing contribution ID.
- Endorse the current wallet's own contribution.
- Endorse the same contribution twice from the same wallet.
- Attempt to slash as a non-admin member.
- Attempt to slash an already-slashed endorsement.
- Update a profile and confirm username and reputation remain unchanged while bio/avatar update.
## Intentional Scope And Future Work

RepuRing keeps the contest implementation focused and transparent:

- Reputation is currently profile-level and shown in the selected circle leaderboard context.
- Circle-scoped reputation is a future extension, not a current claim.
- Contribution timestamps and richer activity chronology are future work.
- Anti-Sybil controls and weighted endorsements are future work.
- Circle discovery is now available in the UI (the **Discover circles** section, backed by `/v1/query/repuring/circles`); richer community browsing and search are future work.
