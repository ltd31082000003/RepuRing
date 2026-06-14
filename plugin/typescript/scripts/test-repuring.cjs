const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const contract = fs.readFileSync(path.join(root, 'src/contract/contract.ts'), 'utf8');
const proto = fs.readFileSync(path.join(root, 'proto/tx.proto'), 'utf8');

const txs = [
  ['createProfile', 'MessageCreateProfile'],
  ['updateProfile', 'MessageUpdateProfile'],
  ['createCircle', 'MessageCreateCircle'],
  ['joinCircle', 'MessageJoinCircle'],
  ['createContribution', 'MessageCreateContribution'],
  ['endorseUser', 'MessageEndorseUser'],
  ['endorseContribution', 'MessageEndorseContribution'],
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

for (const category of ['builder', 'helper', 'creator', 'researcher', 'tester', 'educator']) {
  assert(contract.includes(`'${category}'`), `${category} contribution category missing`);
}

for (const route of [
  '/v1/query/repuring/contribution',
  '/v1/query/repuring/contributions-in-circle',
  '/v1/query/repuring/contributions-for-user',
]) {
  const routes = fs.readFileSync(path.resolve(root, '../../cmd/rpc/routes.go'), 'utf8');
  assert(routes.includes(route), `${route} missing from RPC routes`);
}

assert(proto.includes('message Contribution'), 'Contribution state message missing from tx.proto');
assert(contract.includes('DeliverMessageUpdateProfile'), 'UpdateProfileTx DeliverTx missing');
assert(contract.includes('DeliverMessageCreateContribution'), 'CreateContributionTx DeliverTx missing');
assert(contract.includes('DeliverMessageEndorseContribution'), 'EndorseContributionTx DeliverTx missing');

console.log('RepuRing plugin structure test passed');
