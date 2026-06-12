const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contract = fs.readFileSync(path.join(root, 'src/contract/contract.ts'), 'utf8');
const proto = fs.readFileSync(path.join(root, 'proto/tx.proto'), 'utf8');

const txs = [
  ['createProfile', 'MessageCreateProfile'],
  ['createCircle', 'MessageCreateCircle'],
  ['joinCircle', 'MessageJoinCircle'],
  ['endorseUser', 'MessageEndorseUser'],
  ['slashEndorsement', 'MessageSlashEndorsement'],
  ['claimRole', 'MessageClaimRole'],
];

for (const [name, message] of txs) {
  assert(contract.includes(`'${name}'`), `${name} missing from supportedTransactions`);
  assert(
    contract.includes(`type.googleapis.com/types.${message}`),
    `${message} type URL missing from ContractConfig`
  );
  assert(proto.includes(`message ${message}`), `${message} missing from tx.proto`);
}

for (const tag of ['builder', 'helper', 'creator', 'leader', 'trusted']) {
  assert(contract.includes(`'${tag}'`), `${tag} endorsement tag missing`);
}

console.log('RepuRing plugin structure test passed');
