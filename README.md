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
http://127.0.0.1:5173/
```

The RepuRing page signs custom plugin transactions in the browser, submits them to `/v1/tx`, and refreshes profile, circle, role, endorsement, and leaderboard state from the RepuRing query routes. It does not use a mocked transaction path.

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
3. Show wallet at `/`.
4. Select or create wallet accounts.
5. Submit profile/circle/join/endorse/claim/slash transactions.
6. Show returned transaction hashes from `/v1/tx`.
7. Refresh the dashboard and show Bob reputation, role, endorsement record, and leaderboard.
8. Run the admin slash step and show Bob reputation decrease through `/v1/query/repuring/reputation`.

## Verification Performed

```bash
cd plugin/typescript && npm run build:all
cd plugin/typescript && npm test
cd cmd/rpc/web/wallet && npm run build
node --check scripts/demo/repuring-demo.mjs
Invoke-WebRequest http://127.0.0.1:5173/repuring
```

`/` and `/repuring` return the RepuRing SPA. The local Canopy RPC was not running in this environment, so the demo script correctly fails at live RPC connection instead of using mock data unless the chain is started first.
