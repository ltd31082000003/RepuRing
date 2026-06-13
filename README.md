# RepuRing

RepuRing is an onchain Social-Fi app where users create social circles, endorse each other, earn reputation points, and unlock community roles based on verifiable onchain trust.

## What It Does

RepuRing extends the Canopy template with custom plugin transactions for an onchain reputation graph:

- create a social profile,
- create and join circles,
- endorse another circle member,
- increase reputation from endorsements,
- slash invalid endorsements as the circle creator/admin,
- claim a role from the current reputation score.

It is Social-Fi because social identity, endorsements, reputation, and roles are signed transactions committed to Canopy plugin state rather than frontend-only metadata.

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
| `createCircle` | Stores a unique circle, sets creator/admin, and adds creator as first member. |
| `joinCircle` | Adds signer to an existing circle member list. |
| `endorseUser` | Stores a deterministic endorsement and adds `+1` reputation to target. |
| `slashEndorsement` | Marks an endorsement slashed and subtracts `2` reputation, floored at `0`. |
| `claimRole` | Stores/updates the signer role for a circle. |

Allowed tags: `builder`, `helper`, `creator`, `leader`, `trusted`.

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

Docker path from the Canopy template:

```bash
make docker/plugin PLUGIN=typescript
docker run -p 50002:50002 -p 50003:50003 -v ~/.canopy:/root/.canopy canopy-typescript
```

Manual path:

1. Build Canopy with the normal template instructions.
2. Set `"plugin": "typescript"` in `~/.canopy/config.json`.
3. Start the node:

```bash
canopy start
```

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
| `/repuring/circles` | Create profile, create circle, join circle, and inspect members. |
| `/repuring/endorse` | Submit `EndorseUserTx` and review recent endorsements. |
| `/repuring/leaderboard` | View circle reputation rankings and role badges. |
| `/repuring/admin` | Submit `ClaimRoleTx` and `SlashEndorsementTx`. |
| `/key-management` | Create/select local signing keys from the Canopy template wallet. |

The RepuRing pages sign custom plugin transactions in the browser, submit them to `http://localhost:50002/v1/tx`, and refresh profile, circle, role, endorsement, and leaderboard state from the RepuRing query routes. They do not use a mocked transaction path for the main flow.

## Demo UI Flow

1. Open `http://127.0.0.1:5173/repuring`.
2. Create a signing key on `/key-management` if needed.
3. Create a profile on `/repuring/circles`.
4. Create or join a circle on `/repuring/circles`.
5. Endorse another member on `/repuring/endorse`.
6. Check rankings on `/repuring/leaderboard`.
7. Claim a role or slash an endorsement on `/repuring/admin`.

## Demo Script

With the local chain running on ports `50002` and `50003`:

```bash
node scripts/demo/repuring-demo.mjs
```

The script:

1. Creates Alice and Bob keys through admin RPC.
2. Submits `createProfile` for Alice.
3. Submits `createProfile` for Bob.
4. Alice creates a `Canopy Builders` circle.
5. Bob joins.
6. Alice endorses Bob with tag `builder`.
7. Queries Bob reputation and shows it increased.
8. Bob claims a role.
9. Queries the leaderboard.
10. Alice slashes the endorsement.
11. Queries Bob reputation again and shows it decreased.

Expected reputation transition for Bob in plugin state: `0 -> 1 -> 0`.

## Query Surface

The contract stores deterministic keys for:

- profile by address,
- username index,
- circle by `circle_id`,
- membership by `circle_id + address`,
- role by `circle_id + address`,
- endorsement by deterministic `endorsement_id`,
- circle/user endorsement indexes.

The requested logical queries are exposed as HTTP POST routes on port `50002`:

| Logical query | RPC route | Body |
| --- | --- | --- |
| `getProfile(address)` | `/v1/query/repuring/profile` | `{ "address": "<hex>" }` |
| `getCircle(circle_id)` | `/v1/query/repuring/circle` | `{ "circleId": "canopy-builders" }` |
| `getCircleMembers(circle_id)` | `/v1/query/repuring/circle-members` | `{ "circleId": "canopy-builders" }` |
| `getReputation(address)` | `/v1/query/repuring/reputation` | `{ "address": "<hex>" }` |
| `getRole(circle_id, address)` | `/v1/query/repuring/role` | `{ "circleId": "canopy-builders", "address": "<hex>" }` |
| `getEndorsementsForUser(address)` | `/v1/query/repuring/endorsements-for-user` | `{ "address": "<hex>" }` |
| `getEndorsementsInCircle(circle_id)` | `/v1/query/repuring/endorsements-in-circle` | `{ "circleId": "canopy-builders" }` |
| `getLeaderboard(circle_id)` | `/v1/query/repuring/leaderboard` | `{ "circleId": "canopy-builders" }` |

Each query also accepts optional `{ "height": 123 }` to read historical state through the Canopy time-machine path.

## Demo Video Script

1. Show local Canopy running with plugin `typescript`, ports `50002/50003`.
2. Show `npm run build:all` passing in `plugin/typescript`.
3. Show the overview at `/repuring`.
4. Create/select wallet accounts in `/key-management`.
5. Submit profile and circle transactions on `/repuring/circles`.
6. Submit an endorsement on `/repuring/endorse`.
7. Show returned transaction hashes from `/v1/tx`.
8. Show reputation, role, and rankings on `/repuring/leaderboard`.
9. Run the admin slash step on `/repuring/admin` and show Bob reputation decrease through `/v1/query/repuring/reputation`.

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
- `/repuring/circles` opens profile/circle membership UI.
- `/repuring/endorse` opens endorsement UI.
- `/repuring/leaderboard` opens the leaderboard UI.
- `/repuring/admin` opens role claim and moderation UI.
- `/key-management` remains available for local signing keys.

Live flow checklist:

- Start local Canopy RPC on ports `50002` and `50003`.
- Create/select an account and enter the signing password.
- Submit `CreateProfileTx`, `CreateCircleTx`, `JoinCircleTx`, `EndorseUserTx`, `ClaimRoleTx`, and `SlashEndorsementTx`.
- Confirm leaderboard and reputation changes come from RepuRing RPC query state.
