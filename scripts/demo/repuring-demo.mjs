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
  createContribution: ['MessageCreateContribution', types.MessageCreateContribution, 'type.googleapis.com/types.MessageCreateContribution'],
  endorseUser: ['MessageEndorseUser', types.MessageEndorseUser, 'type.googleapis.com/types.MessageEndorseUser'],
  endorseContribution: ['MessageEndorseContribution', types.MessageEndorseContribution, 'type.googleapis.com/types.MessageEndorseContribution'],
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
  const circleId = `pharos-builders-${suffix}`;
  const contributionId = `pharos-guide-${suffix}`;

  console.log(`Alice: ${alice.address}`);
  console.log(`Bob:   ${bob.address}`);

  await send(alice, 'createProfile', { senderAddress: hexToBytes(alice.address), username: `alice-${suffix}`, bio: 'Pharos project admin' });
  await waitFor(`Alice profile ${alice.address}`, async () => {
    const profile = await queryMaybe('/v1/query/repuring/profile', { address: alice.address });
    return profile?.username === `alice-${suffix}`;
  });
  await send(bob, 'createProfile', { senderAddress: hexToBytes(bob.address), username: `bob-${suffix}`, bio: 'Helpful Pharos contributor' });
  await waitFor(`Bob profile ${bob.address}`, async () => {
    const profile = await queryMaybe('/v1/query/repuring/profile', { address: bob.address });
    return profile?.username === `bob-${suffix}`;
  });
  await send(alice, 'createCircle', { senderAddress: hexToBytes(alice.address), circleId, name: 'Pharos Builders', description: 'Community for contributors helping the Pharos ecosystem.' });
  await waitFor(`circle ${circleId}`, async () => {
    const circle = await queryMaybe('/v1/query/repuring/circle', { circleId });
    return circle?.circleId === circleId;
  });
  await send(bob, 'joinCircle', { senderAddress: hexToBytes(bob.address), circleId });
  await waitFor(`Bob membership in ${circleId}`, async () => {
    const result = await queryMaybe('/v1/query/repuring/circle-members', { circleId });
    const members = Array.isArray(result) ? result : result?.members;
    return Array.isArray(members) && members.some((member) => cleanHex(member.address || member) === bob.address);
  });
  await send(bob, 'createContribution', {
    senderAddress: hexToBytes(bob.address),
    contributionId,
    circleId,
    title: 'Wrote Pharos testnet guide',
    description: 'Created a guide to help new users test the Pharos ecosystem.',
    proofUrl: 'https://example.com/pharos-guide',
    category: 'educator',
  });
  await waitFor(`Bob contribution ${contributionId}`, async () => {
    const contributions = await queryMaybe('/v1/query/repuring/contributions-in-circle', { circleId });
    return Array.isArray(contributions) && contributions.some((item) => item.contributionId === contributionId);
  });
  const endorsementId = makeContributionEndorsementId(contributionId, alice.address);
  await send(alice, 'endorseContribution', { senderAddress: hexToBytes(alice.address), contributionId, tag: 'builder', message: 'Endorsed contribution: Wrote Pharos testnet guide' });
  const bobAfterEndorse = await waitFor(`Bob reputation after endorsement`, async () => {
    const reputation = await queryMaybe('/v1/query/repuring/reputation', { address: bob.address });
    return Number(reputation?.reputation || 0) >= 1 ? reputation : false;
  });
  console.log(`Bob reputation after contribution endorsement: ${bobAfterEndorse.reputation}`);
  const contributionAfterEndorse = await queryMaybe('/v1/query/repuring/contribution', { contributionId });
  if (contributionAfterEndorse) {
    console.log('Contribution endorsement count after endorsement: ' + contributionAfterEndorse.endorsementCount);
  } else {
    console.log('Contribution endorsement count query was unavailable.');
  }
  await send(bob, 'claimRole', { senderAddress: hexToBytes(bob.address), circleId });
  const bobRole = await waitFor(`Bob role in ${circleId}`, async () => {
    const role = await queryMaybe('/v1/query/repuring/role', { address: bob.address, circleId });
    return role?.role ? role : false;
  });
  console.log(`Bob claimed role: ${bobRole.role}`);
  const leaderboard = await waitFor(`leaderboard for ${circleId}`, async () => {
    const rows = await queryMaybe('/v1/query/repuring/leaderboard', { circleId });
    return Array.isArray(rows) && rows.some((row) => cleanHex(row.address) === bob.address) ? rows : false;
  });
  console.log('Leaderboard:', leaderboard.map((row, index) => `${index + 1}. ${row.username} (${row.reputation})`).join(' | '));
  console.log('Endorsement ID used for slash: ' + endorsementId);
  await send(alice, 'slashEndorsement', { senderAddress: hexToBytes(alice.address), endorsementId, reason: 'demo slash by circle creator' });
  const bobAfterSlash = await waitFor(`Bob reputation after slash`, async () => {
    const reputation = await queryMaybe('/v1/query/repuring/reputation', { address: bob.address });
    return Number(reputation?.reputation || 0) === 0 ? reputation : false;
  });
  console.log(`Bob reputation after slash: ${bobAfterSlash.reputation}`);

  console.log('\nDemo flow submitted real transactions.');
  console.log(`Circle ID: ${circleId}`);
  console.log(`Contribution ID: ${contributionId}`);
  console.log(`Contribution endorsement ID: ${endorsementId}`);
  console.log('Expected Bob reputation transition: 0 -> 1 -> 0');
  console.log('Verified Bob reputation transition through RPC query state.');
  console.log('\nFinal QA checklist:');
  for (const item of [
    'profiles created',
    'circle created',
    'Bob joined',
    'contribution posted',
    'contribution endorsed',
    'reputation increased',
    'role claimed',
    'leaderboard returned Bob',
    'endorsement slashed',
    'reputation decreased',
  ]) {
    console.log('[x] ' + item);
  }
}

async function send(signer, kind, msg) {
  const [, Message, typeUrl] = meta[kind];
  const height = await getHeight();
  const msgBytes = Message.encode(Message.create(msg)).finish();
  const time = Date.now() * 1000;
  const signBytes = encodeTransaction({
    messageType: kind,
    typeUrl,
    msgBytes,
    createdHeight: height,
    time,
    fee: FEE,
    networkID: NETWORK_ID,
    chainID: CHAIN_ID,
  });
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

async function queryMaybe(path, body) {
  try {
    return await query(path, body);
  } catch {
    return null;
  }
}

async function waitFor(label, fn, timeoutMs = 90000) {
  const started = Date.now();
  let lastValue = null;
  while (Date.now() - started < timeoutMs) {
    lastValue = await fn();
    if (lastValue) return lastValue;
    await sleep(2500);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

function signBLS(privateKeyHex, message) {
  const hashedPoint = bls12_381.longSignatures.hash(message);
  const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, hexToBytes(privateKeyHex));
  return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

function makeContributionEndorsementId(contributionId, from) {
  const { createHash } = requireFromPlugin('crypto');
  return createHash('sha256')
    .update('contribution')
    .update(Buffer.from([0]))
    .update(contributionId)
    .update(Buffer.from([0]))
    .update(hexToBytes(from))
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

function encodeTransaction(v) {
  const anyMsg = concat([fieldString(1, v.typeUrl), fieldBytes(2, v.msgBytes)]);
  const fields = [
    fieldString(1, v.messageType),
    fieldBytes(2, anyMsg),
    fieldVarint(4, v.createdHeight),
    fieldVarint(5, v.time),
  ];
  if (v.fee !== 0) fields.push(fieldVarint(6, v.fee));
  fields.push(fieldVarint(8, v.networkID), fieldVarint(9, v.chainID));
  return concat(fields);
}

function fieldString(n, value) {
  return fieldBytes(n, new TextEncoder().encode(String(value ?? '')));
}

function fieldBytes(n, value) {
  return concat([varint((n << 3) | 2), varint(value.length), value]);
}

function fieldVarint(n, value) {
  return concat([varint((n << 3) | 0), varint(value)]);
}

function varint(value) {
  let v = BigInt(Math.trunc(value));
  const out = [];
  while (v >= 0x80n) {
    out.push(Number((v & 0x7fn) | 0x80n));
    v >>= 7n;
  }
  out.push(Number(v));
  return Uint8Array.from(out);
}

function concat(parts) {
  const len = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(len);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
