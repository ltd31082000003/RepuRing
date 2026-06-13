# RepuRing Demo Script

This folder documents the exact demo flow for judges.

The demo is intentionally RPC-first: every action should be submitted to a local Canopy node on `50002` / `50003`; do not use mocked frontend data for the recording.

## Flow

1. Start Canopy with the TypeScript plugin enabled.
2. Create Alice and Bob keys through admin RPC.
3. Submit `createProfile` for Alice.
4. Submit `createProfile` for Bob.
5. Submit `createCircle` from Alice with `circle_id = pharos-builders-*`.
6. Submit `joinCircle` from Bob.
7. Submit `createContribution` from Bob for `Wrote Pharos testnet guide`.
8. Submit `endorseContribution` from Alice with tag `builder`.
9. Query Bob reputation.
10. Submit `claimRole` from Bob.
11. Query leaderboard.
12. Submit `slashEndorsement` from Alice.
13. Query Bob reputation again.

## RPC Endpoints

- Query / transaction RPC: `http://localhost:50002`
- Admin / keystore RPC: `http://localhost:50003`

Run:

```bash
node scripts/demo/repuring-demo.mjs
```

The script uses the Canopy plugin transaction pattern: `msgTypeUrl` and `msgBytes` are posted to `/v1/tx`, then RepuRing state is queried through `/v1/query/repuring/*`.
