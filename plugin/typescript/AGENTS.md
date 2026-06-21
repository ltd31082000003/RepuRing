# AGENTS.md - Canopy TypeScript Plugin

This file provides context for AI coding assistants working on the Canopy TypeScript plugin.

## Project Overview

This is a **TypeScript plugin** for the Canopy blockchain that extends the Finite State Machine (FSM) functionality. The plugin communicates with the Canopy node via Unix socket using length-prefixed protobuf messages.

### Key Concepts

- **Plugin Architecture**: The plugin runs as a separate Node.js process and communicates with the Canopy FSM via a Unix socket (`plugin.sock`)
- **Protobuf Communication**: All messages between the plugin and FSM are protobuf-encoded with 4-byte length prefixes (big-endian)
- **Transaction Processing**: The plugin handles `CheckTx` (stateless validation) and `DeliverTx` (state application) for custom transaction types
- **State Access**: The plugin reads/writes blockchain state via `StateRead` and `StateWrite` RPC calls to the FSM

## Directory Structure

```
plugin/typescript/
├── src/
│   ├── main.ts                 # Entry point - starts the plugin
│   ├── contract/
│   │   ├── contract.ts         # Transaction handlers (Check/Deliver)
│   │   ├── plugin.ts           # Socket communication and FSM interface
│   │   ├── error.ts            # Error types and constructors
│   │   └── index.ts            # Re-exports
│   └── proto/
│       ├── types.ts            # Type re-exports from generated code
│       ├── descriptors.ts      # File descriptor protos for registration
│       ├── index.js            # Generated protobuf code (CommonJS)
│       ├── index.cjs           # Copy for ESM compatibility
│       └── index.d.ts          # Generated TypeScript definitions
├── proto/                      # Source .proto files
│   ├── tx.proto                # Transaction message definitions
│   ├── plugin.proto            # Plugin<->FSM communication messages
│   ├── account.proto           # Account state messages
│   └── event.proto             # Event messages
├── scripts/
│   └── generate-descriptors.cjs # Generates proto descriptors
├── tutorial/                   # Separate test project for new tx types
│   ├── src/rpc_test.ts         # RPC integration tests
│   ├── proto/                  # Proto files with test tx types
│   └── package.json
├── TUTORIAL.md                 # Guide for adding new transaction types
├── CUSTOMIZE.md                # General customization guide
└── package.json
```

## Key Files

### `src/contract/contract.ts`

Contains the core contract logic:

- **`ContractConfig`**: Registers supported transaction types with the FSM
  - `supportedTransactions`: Array of transaction names (e.g., `["send"]`)
  - `transactionTypeUrls`: Corresponding protobuf type URLs
  - Order must match between these arrays

- **`Contract` class**: Synchronous contract methods
  - `Genesis()`: Initial state setup
  - `BeginBlock()`: Called at block start
  - `EndBlock()`: Called at block end
  - `CheckMessage*()`: Stateless validation for each message type

- **`ContractAsync` class**: Async methods for state operations
  - `CheckTx()`: Validates transaction (reads state for fee check)
  - `DeliverTx()`: Applies transaction to state
  - `DeliverMessage*()`: State mutation for each message type

- **Key functions**: `KeyForAccount()`, `KeyForFeeParams()`, `KeyForFeePool()`
  - Generate state database keys with length-prefixed encoding

### `src/contract/plugin.ts`

Socket communication layer:

- **`Plugin` class**: Manages connection to FSM
  - `Handshake()`: Initial config exchange
  - `StateRead()`: Read state from FSM
  - `StateWrite()`: Write state to FSM
  - `ListenForInbound()`: Process incoming messages

- **`FromAny()`**: Decodes `google.protobuf.Any` to typed messages
  - Add new message type cases here when extending

- **Message protocol**: 4-byte length prefix (big-endian) + protobuf bytes

### `src/contract/error.ts`

Standardized error types:

- `IPluginError`: Interface with `code`, `module`, `msg`
- Error constructors: `ErrInvalidAddress()`, `ErrInsufficientFunds()`, etc.
- Module name: `"plugin"` for all errors

## Common Tasks

### Adding a New Transaction Type

See `TUTORIAL.md` for the complete guide. Summary:

1. Add message to `proto/tx.proto`
2. Run `npm run build:proto` and `npm run build:descriptors`
3. Add to `ContractConfig.supportedTransactions` and `transactionTypeUrls`
4. Add case in `FromAny()` function
5. Add `CheckMessage*()` method to `Contract` class
6. Add case in `ContractAsync.CheckTx()` switch
7. Add `DeliverMessage*()` method to `ContractAsync` class
8. Add case in `ContractAsync.DeliverTx()` switch

### Building the Plugin

Using Makefile (recommended):
```bash
make build-all       # Full rebuild (install + proto + descriptors + TypeScript)
make build           # TypeScript compilation only
make build-proto     # Regenerate protobuf code only
make build-descriptors  # Regenerate descriptor file only
```

Using npm directly:
```bash
npm run build:all    # Full rebuild (proto + descriptors + TypeScript)
npm run build:proto  # Regenerate protobuf code only
npm run build:descriptors  # Regenerate descriptor file only
npm run build        # TypeScript compilation only
```

### Running the Plugin

The plugin is started by Canopy when configured with `"plugin": "typescript"` in `~/.canopy/config.json`.

For development:
```bash
make dev             # Run with nodemon for hot reload
make run             # Run compiled output
# or
npm run dev          # Run with nodemon for hot reload
npm start            # Run compiled output
```

### RepuRing Runtime Policy

RepuRing is developed and demonstrated with the native Windows runtime only:

- build Canopy with Go into `canopy.exe`;
- configure `%USERPROFILE%\.canopy\config.json` with `plugin` set to `typescript`;
- run `canopy.exe start` from the repository root;
- use `http://localhost:50002` for transactions and queries;
- use `http://localhost:50003` for admin/keystore operations.

Do not instruct RepuRing users to run the chain through Docker, Ubuntu, or WSL. Use the repository scripts:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\windows-native\build.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\windows-native\start.ps1
```

Canopy starts the compiled TypeScript plugin automatically on Windows. The plugin process communicates with Canopy through the native Windows controller implementation.

### Running Tests

Tests are in the `tutorial/` subdirectory (separate project):

```bash
cd tutorial
npm install
npm run build:proto
npm test             # Runs RPC integration tests
```

## Code Patterns

### State Keys

Keys are length-prefixed byte arrays:

```typescript
const accountPrefix = Buffer.from([1]);
const poolPrefix = Buffer.from([2]);
const paramsPrefix = Buffer.from([7]);

function KeyForAccount(addr: Uint8Array): Uint8Array {
    return JoinLenPrefix(accountPrefix, Buffer.from(addr));
}
```

### Reading State

```typescript
const [response, readErr] = await contract.plugin.StateRead(contract, {
    keys: [
        { queryId: Long.fromNumber(randomId), key: keyBytes },
    ],
});
// Response has response.results[].entries[].value
```

### Writing State

```typescript
const [writeResp, writeErr] = await contract.plugin.StateWrite(contract, {
    sets: [{ key: keyBytes, value: valueBytes }],
    deletes: [{ key: deleteKeyBytes }],  // optional
});
```

### Error Handling

Always return errors in response objects:

```typescript
if (error) {
    return { error: ErrInvalidAddress() };
}
return { recipient: addr, authorizedSigners: [signer] };
```

### Working with Long

Protobuf uint64 values may be `Long` or `number`:

```typescript
const amount = Long.isLong(msg.amount) 
    ? msg.amount 
    : Long.fromNumber(msg.amount as number || 0);
```

## Protobuf Notes

- Generated code uses CommonJS format (`index.js`)
- ESM compatibility via `index.cjs` copy
- Field names in TypeScript use camelCase (e.g., `fromAddress`)
- Field names in proto files use snake_case (e.g., `from_address`)
- `google.protobuf.Any` uses `type_url` (snake_case) for encoding

## Testing Notes

- Tests require a running Canopy node with the TypeScript plugin enabled
- Use `@noble/curves` for BLS12-381 signing in tests
- Transaction signatures use G2 signatures (longSignatures)
- DST: `BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_`

## Dependencies

**Runtime:**
- `long`: 64-bit integer support for protobuf
- `protobufjs`: Runtime protobuf encoding/decoding

**Development:**
- `protobufjs-cli`: Proto compilation (`pbjs`, `pbts`)
- `typescript`: Type checking and compilation
- `@types/node`: Node.js type definitions

**Tutorial only:**
- `@noble/curves`: BLS12-381 cryptography for test signing
- `tsx`: TypeScript execution for tests

## Configuration

The plugin reads config from `chain.json` in the data directory (default: `/tmp/plugin/`):

```typescript
interface Config {
    ChainId: number;      // Chain identifier
    DataDirPath: string;  // Path to plugin data directory
}
```

## Socket Protocol

1. **Connection**: Plugin connects to `{DataDirPath}/plugin.sock`
2. **Handshake**: Plugin sends config, FSM responds with FSM config
3. **Request/Response**: FSM sends requests, plugin responds
4. **Message Format**: `[4-byte length BE][protobuf bytes]`

Message types (`FSMToPlugin` / `PluginToFSM`):
- `config`: Configuration exchange (handshake)
- `genesis`: Genesis state import/export
- `begin`: BeginBlock
- `check`: CheckTx
- `deliver`: DeliverTx
- `end`: EndBlock
- `stateRead`: State read request/response
- `stateWrite`: State write request/response

