import React from 'react';
import { bls12_381 } from '@noble/curves/bls12-381.js';
import { useSelectedAccount } from '@/app/providers/SelectedAccountProvider';
import {
  CircleView,
  ContributionView,
  EndorsementView,
  LeaderboardRow,
  ProfileView,
  RepuRingContext,
  RoleView,
  TxKind,
} from './useRepuRing';

export const QUERY_RPC = 'http://localhost:50002';
export const ADMIN_RPC = 'http://localhost:50003';
const NETWORK_ID = 1;
const CHAIN_ID = 1;
const FEE = 0;

const txMeta: Record<TxKind, { typeUrl: string; message: string }> = {
  createProfile: { typeUrl: 'type.googleapis.com/types.MessageCreateProfile', message: 'MessageCreateProfile' },
  updateProfile: { typeUrl: 'type.googleapis.com/types.MessageUpdateProfile', message: 'MessageUpdateProfile' },
  createCircle: { typeUrl: 'type.googleapis.com/types.MessageCreateCircle', message: 'MessageCreateCircle' },
  joinCircle: { typeUrl: 'type.googleapis.com/types.MessageJoinCircle', message: 'MessageJoinCircle' },
  createContribution: { typeUrl: 'type.googleapis.com/types.MessageCreateContribution', message: 'MessageCreateContribution' },
  endorseUser: { typeUrl: 'type.googleapis.com/types.MessageEndorseUser', message: 'MessageEndorseUser' },
  endorseContribution: { typeUrl: 'type.googleapis.com/types.MessageEndorseContribution', message: 'MessageEndorseContribution' },
  slashEndorsement: { typeUrl: 'type.googleapis.com/types.MessageSlashEndorsement', message: 'MessageSlashEndorsement' },
  claimRole: { typeUrl: 'type.googleapis.com/types.MessageClaimRole', message: 'MessageClaimRole' },
};

const submittedStatus: Record<TxKind, string> = {
  createProfile: 'CreateProfileTx submitted - contributor identity will appear after commit.',
  updateProfile: 'UpdateProfileTx submitted - bio and avatar will refresh; username and reputation remain unchanged.',
  createCircle: 'CreateCircleTx submitted - project circle will refresh after commit.',
  joinCircle: 'JoinCircleTx submitted - membership will appear after commit.',
  createContribution: 'CreateContributionTx submitted - proof-of-work will appear in the contribution feed.',
  endorseContribution: 'EndorseContributionTx submitted - author profile reputation and endorsement count will refresh.',
  endorseUser: 'EndorseUserTx submitted - legacy member endorsement path used.',
  claimRole: 'ClaimRoleTx submitted - role for this circle will refresh after commit.',
  slashEndorsement: 'SlashEndorsementTx submitted - endorsement status and target profile reputation will refresh.',
};

export function RepuRingProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { selectedAccount } = useSelectedAccount();
  const [password, setPassword] = React.useState('');
  const [circleId, setCircleId] = React.useState('pharos-builders');
  const [targetAddress, setTargetAddress] = React.useState('');
  const [endorsementId, setEndorsementId] = React.useState('');
  const [selectedContributionId, setSelectedContributionId] = React.useState('');
  const [status, setStatus] = React.useState('Start local Canopy RPC on 50002 / 50003, then refresh state.');
  const [profileForm, setProfileForm] = React.useState({ username: '', bio: '', avatarUrl: '' });
  const [circleForm, setCircleForm] = React.useState({ name: 'Pharos Builders', description: 'Community for contributors helping the Pharos ecosystem.' });
  const [contributionForm, setContributionForm] = React.useState({
    contributionId: '',
    title: 'Wrote Pharos testnet guide',
    description: 'Created a guide to help new users test the Pharos ecosystem.',
    proofUrl: 'https://example.com/pharos-guide',
    category: 'educator',
  });
  const [endorse, setEndorse] = React.useState({ tag: 'builder', message: 'Useful contribution for this project community.' });
  const [slashReason, setSlashReason] = React.useState('invalid endorsement');
  const [lastTx, setLastTx] = React.useState('');
  const [profile, setProfile] = React.useState<ProfileView | null>(null);
  const [role, setRole] = React.useState<RoleView | null>(null);
  const [circle, setCircle] = React.useState<CircleView | null>(null);
  const [circles, setCircles] = React.useState<CircleView[]>([]);
  const [contributions, setContributions] = React.useState<ContributionView[]>([]);
  const [endorsements, setEndorsements] = React.useState<EndorsementView[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardRow[]>([]);

  const currentAddress = selectedAccount?.address ? cleanHex(selectedAccount.address) : '';

  const refreshState = React.useCallback(async () => {
    try {
      const nextProfile = currentAddress
        ? await queryMaybe<ProfileView>('/v1/query/repuring/profile', { address: currentAddress })
        : null;
      const nextRole = currentAddress && circleId.trim()
        ? await queryMaybe<RoleView>('/v1/query/repuring/role', { address: currentAddress, circleId })
        : null;
      const nextCircles = await queryMaybe<CircleView[]>('/v1/query/repuring/circles', {});
      const nextCircle = circleId.trim()
        ? await queryMaybe<CircleView>('/v1/query/repuring/circle', { circleId })
        : null;
      const nextLeaderboard = circleId.trim()
        ? await queryMaybe<LeaderboardRow[]>('/v1/query/repuring/leaderboard', { circleId })
        : [];
      const byUser = currentAddress
        ? await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-for-user', { address: currentAddress })
        : [];
      const inCircle = circleId.trim()
        ? await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-in-circle', { circleId })
        : [];
      const nextContributions = circleId.trim()
        ? await queryMaybe<ContributionView[]>('/v1/query/repuring/contributions-in-circle', { circleId })
        : [];

      setProfile(nextProfile);
      setRole(nextRole);
      setCircle(nextCircle);
      setCircles(nextCircles || []);
      setContributions(nextContributions || []);
      setLeaderboard(nextLeaderboard || []);
      setEndorsements(mergeEndorsements(byUser || [], inCircle || []));
      setStatus(`State refreshed from ${QUERY_RPC}`);
    } catch (e) {
      setCircles([]);
      setStatus(`RPC query failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [circleId, currentAddress]);

  React.useEffect(() => {
    void refreshState();
  }, [refreshState]);

  React.useEffect(() => {
    // Multi-account safety: switching wallets should not reuse stale signing or action inputs.
    setPassword('');
    setTargetAddress('');
    setEndorsementId('');
    setSlashReason('invalid endorsement');
    setProfileForm({ username: '', bio: '', avatarUrl: '' });
  }, [currentAddress]);

  React.useEffect(() => {
    const selectable = contributions.find((item) => cleanHex(item.authorAddress) !== cleanHex(currentAddress)) || contributions[0];
    const selected = contributions.find((item) => item.contributionId === selectedContributionId);
    if (selectable && (!selected || cleanHex(selected.authorAddress) === cleanHex(currentAddress))) {
      setSelectedContributionId(selectable.contributionId);
    }
  }, [contributions, currentAddress, selectedContributionId]);

  async function submit(kind: TxKind, fields: Record<string, unknown>) {
    try {
      validateSubmit(kind, fields, currentAddress, password);
      setStatus(`Submitting ${kind} through ${QUERY_RPC}/v1/tx...`);
      const signer = await getSigner(currentAddress, password);
      const height = await getHeight();
      const msgBytes = encodeMessage(kind, { senderAddress: signer.address, ...fields });
      const time = Date.now() * 1000;
      const signBytes = encodeTransaction({
        messageType: kind,
        typeUrl: txMeta[kind].typeUrl,
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
        msgTypeUrl: txMeta[kind].typeUrl,
        msgBytes: bytesToHex(msgBytes),
        signature: { publicKey: cleanHex(signer.publicKey), signature: bytesToHex(signature) },
        time,
        createdHeight: height,
        fee: FEE,
        memo: '',
        networkID: NETWORK_ID,
        chainID: CHAIN_ID,
      };
      const response = await postJSON(`${QUERY_RPC}/v1/tx`, tx);
      setLastTx(typeof response === 'string' ? response : JSON.stringify(response));
      setStatus(submittedStatus[kind]);
      await refreshAfterCommit(refreshState);
      return true;
    } catch (e) {
      setStatus(`${kind} failed: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  }

  return (
    <RepuRingContext.Provider
      value={{
        selectedAccount,
        currentAddress,
        password,
        setPassword,
        circleId,
        setCircleId,
        targetAddress,
        setTargetAddress,
        endorsementId,
        setEndorsementId,
        selectedContributionId,
        setSelectedContributionId,
        profileForm,
        setProfileForm,
        circleForm,
        setCircleForm,
        contributionForm,
        setContributionForm,
        endorse,
        setEndorse,
        slashReason,
        setSlashReason,
        lastTx,
        status,
        profile,
        role,
        circle,
        circles,
        contributions,
        endorsements,
        leaderboard,
        refreshState,
        submit,
      }}
    >
      {children}
    </RepuRingContext.Provider>
  );
}

function validateSubmit(kind: TxKind, fields: Record<string, unknown>, currentAddress: string, password: string) {
  if (!currentAddress) throw new Error('Select an account first.');
  if (!password) throw new Error('Enter wallet password for signing.');
  if (kind === 'createProfile' && !String(fields.username || '').trim()) throw new Error('Username is required.');
  if (kind === 'createCircle' && !String(fields.circleId || '').trim()) throw new Error('Circle ID is required.');
  if (kind === 'createCircle' && !String(fields.name || '').trim()) throw new Error('Circle name is required.');
  if ((kind === 'joinCircle' || kind === 'claimRole') && !String(fields.circleId || '').trim()) throw new Error('Circle ID is required.');
  if (kind === 'createContribution') {
    if (!String(fields.circleId || '').trim()) throw new Error('Circle ID is required.');
    if (!String(fields.contributionId || '').trim()) throw new Error('Contribution ID is required.');
    if (!String(fields.title || '').trim()) throw new Error('Contribution title is required.');
    if (!String(fields.category || '').trim()) throw new Error('Contribution category is required.');
  }
  if (kind === 'endorseUser') {
    if (!String(fields.circleId || '').trim()) throw new Error('Circle ID is required.');
    if (!String(fields.targetAddress || '').trim()) throw new Error('Target address is required.');
  }
  if (kind === 'endorseContribution' && !String(fields.contributionId || '').trim()) throw new Error('Contribution ID is required.');
  if (kind === 'slashEndorsement' && !String(fields.endorsementId || '').trim()) throw new Error('Endorsement ID is required.');
}

function mergeEndorsements(a: EndorsementView[], b: EndorsementView[]) {
  const map = new Map<string, EndorsementView>();
  for (const item of [...a, ...b]) map.set(item.endorsementId, item);
  return [...map.values()];
}

async function queryMaybe<T>(path: string, body: unknown): Promise<T | null> {
  const res = await fetch(`${QUERY_RPC}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (res.status === 404) return null;
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(typeof parsed === 'string' ? parsed : parsed?.error || JSON.stringify(parsed));
  return parsed as T;
}

async function getSigner(address: string, password: string) {
  const parsed = await postJSON(`${ADMIN_RPC}/v1/admin/keystore-get`, { address, password });
  return {
    address: cleanHex(parsed.address || parsed.Address || address),
    publicKey: cleanHex(parsed.publicKey || parsed.PublicKey || parsed.public_key),
    privateKey: cleanHex(parsed.privateKey || parsed.PrivateKey || parsed.private_key),
  };
}

async function getHeight(): Promise<number> {
  const result = await postJSON(`${QUERY_RPC}/v1/query/height`, {});
  return Number(result.height || 0);
}

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(typeof parsed === 'string' ? parsed : parsed?.error || JSON.stringify(parsed));
  return parsed;
}

function encodeMessage(kind: TxKind, v: Record<string, unknown>): Uint8Array {
  const sender = hexToBytes(String(v.senderAddress));
  switch (kind) {
    case 'createProfile':
      return concat([fieldBytes(1, sender), fieldString(2, v.username), fieldString(3, v.bio), fieldString(4, v.avatarUrl)]);
    case 'updateProfile':
      return concat([fieldBytes(1, sender), fieldString(2, v.bio), fieldString(3, v.avatarUrl)]);
    case 'createCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId), fieldString(3, v.name), fieldString(4, v.description)]);
    case 'joinCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
    case 'createContribution':
      return concat([fieldBytes(1, sender), fieldString(2, v.contributionId), fieldString(3, v.circleId), fieldString(4, v.title), fieldString(5, v.description), fieldString(6, v.proofUrl), fieldString(7, v.category)]);
    case 'endorseUser':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId), fieldBytes(3, hexToBytes(String(v.targetAddress))), fieldString(4, v.tag), fieldString(5, v.message)]);
    case 'endorseContribution':
      return concat([fieldBytes(1, sender), fieldString(2, v.contributionId), fieldString(3, v.tag), fieldString(4, v.message)]);
    case 'slashEndorsement':
      return concat([fieldBytes(1, sender), fieldString(2, v.endorsementId), fieldString(3, v.reason)]);
    case 'claimRole':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
  }
}

function encodeTransaction(v: { messageType: string; typeUrl: string; msgBytes: Uint8Array; createdHeight: number; time: number; fee: number; networkID: number; chainID: number }) {
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

function signBLS(privateKeyHex: string, message: Uint8Array): Uint8Array {
  const hashedPoint = bls12_381.longSignatures.hash(message);
  const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, hexToBytes(privateKeyHex));
  return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

function fieldString(n: number, value: unknown) { return fieldBytes(n, new TextEncoder().encode(String(value ?? ''))); }
function fieldBytes(n: number, value: Uint8Array) { return concat([varint((n << 3) | 2), varint(value.length), value]); }
function fieldVarint(n: number, value: number) { return concat([varint((n << 3) | 0), varint(value)]); }
function varint(value: number): Uint8Array {
  let v = BigInt(Math.trunc(value));
  const out: number[] = [];
  while (v >= 0x80n) { out.push(Number((v & 0x7fn) | 0x80n)); v >>= 7n; }
  out.push(Number(v));
  return new Uint8Array(out);
}
function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0));
  let offset = 0;
  for (const p of parts) { out.set(p, offset); offset += p.length; }
  return out;
}
export function cleanHex(v: string) { return String(v || '').trim().replace(/^0x/, '').toLowerCase(); }
function hexToBytes(hex: string) {
  const clean = cleanHex(hex);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''); }
function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function refreshAfterCommit(refresh: () => Promise<void>) {
  await sleep(1800);
  await refresh();
  await sleep(2500);
  await refresh();
}
