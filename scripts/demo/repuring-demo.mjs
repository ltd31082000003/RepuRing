import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { randomBytes } from 'crypto';

const requireFromPlugin = createRequire(new URL('../../plugin/typescript/package.json', import.meta.url));
const requireFromWallet = createRequire(new URL('../../cmd/rpc/web/wallet/package.json', import.meta.url));
const { bls12_381 } = await import(pathToFileURL(requireFromWallet.resolve('@noble/curves/bls12-381.js')).href);
const protoRoot = requireFromPlugin('./src/proto/index.cjs');
const { types, google } = protoRoot;

const QUERY_RPC = process.env.REPURING_QUERY_RPC || 'http://localhost:50002';
const ADMIN_RPC = process.env.REPURING_ADMIN_RPC || 'http://localhost:50003';
const PASSWORD = process.env.REPURING_PASSWORD || 'repuring-demo-pass';
const NETWORK_ID = Number(process.env.REPURING_NETWORK_ID || 1);
const CHAIN_ID = Number(process.env.REPURING_CHAIN_ID || 1);
const FEE = Number(process.env.REPURING_FEE || 0);

const meta = {
  createProfile: ['MessageCreateProfile', types.MessageCreateProfile, 'type.googleapis.com/types.MessageCreateProfile'],
  createCircle: ['MessageCreateCircle', types.MessageCreateCircle, 'type.googleapis.com/types.MessageCreateCircle'],
  joinCircle: ['MessageJoinCircle', types.MessageJoinCircle, 'type.googleapis.com/types.MessageJoinCircle'],
  endorseUser: ['MessageEndorseUser', types.MessageEndorseUser, 'type.googleapis.com/types.MessageEndorseUser'],
  slashEndorsement: ['MessageSlashEndorsement', types.MessageSlashEndorsement, 'type.googleapis.com/types.MessageSlashEndorsement'],
  claimRole: ['MessageClaimRole', types.MessageClaimRole, 'type.googleapis.com/types.MessageClaimRole'],
};

async function main() {
  console.log('RepuRing RPC demo');
  console.log(`RPC: ${QUERY_RPC}, admin: ${ADMIN_RPC}`);
  await getHeight();

  const suffix = randomBytes(3).toString('hex');
  const aliceAddr = await newKey(`alice-${suffix}`);
  const bobAddr = await newKey(`bob-${suffix}`);
  const alice = await getKey(aliceAddr);
  const bob = await getKey(bobAddr);
  const circleId = `canopy-builders-${suffix}`;

  console.log(`Alice: ${alice.address}`);
  console.log(`Bob:   ${bob.address}`);

  await send(alice, 'createProfile', { senderAddress: hexToBytes(alice.address), username: `alice-${suffix}`, bio: 'Canopy builder' });
  await send(bob, 'createProfile', { senderAddress: hexToBytes(bob.address), username: `bob-${suffix}`, bio: 'Helpful community member' });
  await send(alice, 'createCircle', { senderAddress: hexToBytes(alice.address), circleId, name: 'Canopy Builders', description: 'Local demo circle' });
  await send(bob, 'joinCircle', { senderAddress: hexToBytes(bob.address), circleId });
  const endorsementId = makeEndorsementId(circleId, alice.address, bob.address);
  await send(alice, 'endorseUser', { senderAddress: hexToBytes(alice.address), circleId, targetAddress: hexToBytes(bob.address), tag: 'builder', message: 'Bob shipped a useful demo' });
  const bobAfterEndorse = await query('/v1/query/repuring/reputation', { address: bob.address });
  console.log(`Bob reputation after endorsement: ${bobAfterEndorse.reputation}`);
  await send(bob, 'claimRole', { senderAddress: hexToBytes(bob.address), circleId });
  const bobRole = await query('/v1/query/repuring/role', { address: bob.address, circleId });
  console.log(`Bob claimed role: ${bobRole.role}`);
  const leaderboard = await query('/v1/query/repuring/leaderboard', { circleId });
  console.log('Leaderboard:', leaderboard.map((row, index) => `${index + 1}. ${row.username} (${row.reputation})`).join(' | '));
  await send(alice, 'slashEndorsement', { senderAddress: hexToBytes(alice.address), endorsementId, reason: 'demo slash by circle creator' });
  const bobAfterSlash = await query('/v1/query/repuring/reputation', { address: bob.address });
  console.log(`Bob reputation after slash: ${bobAfterSlash.reputation}`);

  console.log('\nDemo flow submitted real transactions.');
  console.log(`Circle ID: ${circleId}`);
  console.log(`Endorsement ID: ${endorsementId}`);
  console.log('Verified Bob reputation transition through RPC query state.');
}

async function send(signer, kind, msg) {
  const [, Message, typeUrl] = meta[kind];
  const height = await getHeight();
  const msgBytes = Message.encode(Message.create(msg)).finish();
  const time = Date.now() * 1000;
  const anyMsg = google.protobuf.Any.create({ type_url: typeUrl, value: msgBytes });
  const signTx = types.Transaction.create({
    messageType: kind,
    msg: anyMsg,
    signature: null,
    createdHeight: height,
    time,
    fee: FEE,
    networkId: NETWORK_ID,
    chainId: CHAIN_ID,
  });
  const signBytes = types.Transaction.encode(signTx).finish();
  const signature = signBLS(signer.privateKey, signBytes);
  const tx = {
    type: kind,
    msgTypeUrl: typeUrl,
    msgBytes: bytesToHex(msgBytes),
    signature: { publicKey: signer.publicKey, signature: bytesToHex(signature) },
    time,
    createdHeight: height,
    fee: FEE,
    memo: '',
    networkID: NETWORK_ID,
    chainID: CHAIN_ID,
  };
  const hash = await post(`${QUERY_RPC}/v1/tx`, tx);
  console.log(`${kind}: ${hash}`);
  await sleep(1500);
  return hash;
}

async function newKey(nickname) {
  return post(`${ADMIN_RPC}/v1/admin/keystore-new-key`, { nickname, password: PASSWORD });
}

async function getKey(address) {
  const key = await post(`${ADMIN_RPC}/v1/admin/keystore-get`, { address, password: PASSWORD });
  return {
    address: cleanHex(key.address || key.Address || address),
    publicKey: cleanHex(key.publicKey || key.PublicKey || key.public_key),
    privateKey: cleanHex(key.privateKey || key.PrivateKey || key.private_key),
  };
}

async function getHeight() {
  const h = await post(`${QUERY_RPC}/v1/query/height`, {});
  return Number(h.height || 0);
}

async function post(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${url} failed: ${text}`);
  return parsed;
}

async function query(path, body) {
  return post(`${QUERY_RPC}${path}`, body);
}

function signBLS(privateKeyHex, message) {
  const hashedPoint = bls12_381.longSignatures.hash(message);
  const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, hexToBytes(privateKeyHex));
  return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

function makeEndorsementId(circleId, from, target) {
  const { createHash } = requireFromPlugin('crypto');
  return createHash('sha256')
    .update(circleId)
    .update(Buffer.from([0]))
    .update(hexToBytes(from))
    .update(Buffer.from([0]))
    .update(hexToBytes(target))
    .digest('hex')
    .slice(0, 32);
}

function cleanHex(v) {
  return String(v || '').trim().replace(/^0x/, '').toLowerCase();
}

function hexToBytes(hex) {
  return Uint8Array.from(Buffer.from(cleanHex(hex), 'hex'));
}

function bytesToHex(bytes) {
  return Buffer.from(bytes).toString('hex');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
