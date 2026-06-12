import React from 'react';
import { bls12_381 } from '@noble/curves/bls12-381.js';
import { useSelectedAccount } from '@/app/providers/SelectedAccountProvider';

const QUERY_RPC = 'http://localhost:50002';
const ADMIN_RPC = 'http://localhost:50003';
const NETWORK_ID = 1;
const CHAIN_ID = 1;
const FEE = 0;

type TxKind =
  | 'createProfile'
  | 'createCircle'
  | 'joinCircle'
  | 'endorseUser'
  | 'slashEndorsement'
  | 'claimRole';

type ProfileView = { address: string; username: string; bio: string; avatarUrl: string; reputation: number };
type CircleView = { circleId: string; name: string; description: string; creatorAddress: string; members: string[] };
type RoleView = { circleId: string; address: string; role: string; reputation: number; claimedRole: boolean };
type EndorsementView = { endorsementId: string; fromAddress: string; targetAddress: string; tag: string; message: string; slashed: boolean; slashReason: string };
type LeaderboardRow = { address: string; username: string; reputation: number; role: string };

const txMeta: Record<TxKind, { typeUrl: string; message: string }> = {
  createProfile: { typeUrl: 'type.googleapis.com/types.MessageCreateProfile', message: 'MessageCreateProfile' },
  createCircle: { typeUrl: 'type.googleapis.com/types.MessageCreateCircle', message: 'MessageCreateCircle' },
  joinCircle: { typeUrl: 'type.googleapis.com/types.MessageJoinCircle', message: 'MessageJoinCircle' },
  endorseUser: { typeUrl: 'type.googleapis.com/types.MessageEndorseUser', message: 'MessageEndorseUser' },
  slashEndorsement: { typeUrl: 'type.googleapis.com/types.MessageSlashEndorsement', message: 'MessageSlashEndorsement' },
  claimRole: { typeUrl: 'type.googleapis.com/types.MessageClaimRole', message: 'MessageClaimRole' },
};

export default function RepuRing(): JSX.Element {
  const { selectedAccount } = useSelectedAccount();
  const [password, setPassword] = React.useState('');
  const [circleId, setCircleId] = React.useState('canopy-builders');
  const [targetAddress, setTargetAddress] = React.useState('');
  const [endorsementId, setEndorsementId] = React.useState('');
  const [status, setStatus] = React.useState('Start local Canopy RPC on 50002 / 50003, then refresh state.');
  const [profileForm, setProfileForm] = React.useState({ username: '', bio: '', avatarUrl: '' });
  const [circleForm, setCircleForm] = React.useState({ name: 'Canopy Builders', description: 'Builders and helpers in the Canopy ecosystem' });
  const [endorse, setEndorse] = React.useState({ tag: 'builder', message: 'Reliable builder in this circle' });
  const [slashReason, setSlashReason] = React.useState('invalid endorsement');
  const [lastTx, setLastTx] = React.useState('');
  const [profile, setProfile] = React.useState<ProfileView | null>(null);
  const [role, setRole] = React.useState<RoleView | null>(null);
  const [circle, setCircle] = React.useState<CircleView | null>(null);
  const [endorsements, setEndorsements] = React.useState<EndorsementView[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardRow[]>([]);

  const currentAddress = selectedAccount?.address ? cleanHex(selectedAccount.address) : '';

  const refreshState = React.useCallback(async () => {
    const tasks: Promise<void>[] = [];
    if (currentAddress) {
      tasks.push(queryMaybe<ProfileView>('/v1/query/repuring/profile', { address: currentAddress }).then(setProfile));
      tasks.push(queryMaybe<RoleView>('/v1/query/repuring/role', { address: currentAddress, circleId }).then(setRole));
      tasks.push(queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-for-user', { address: currentAddress }).then((v) => setEndorsements(v || [])));
    }
    if (circleId.trim()) {
      tasks.push(queryMaybe<CircleView>('/v1/query/repuring/circle', { circleId }).then(setCircle));
      tasks.push(queryMaybe<LeaderboardRow[]>('/v1/query/repuring/leaderboard', { circleId }).then((v) => setLeaderboard(v || [])));
    }
    try {
      await Promise.all(tasks);
      setStatus(`State refreshed from ${QUERY_RPC}`);
    } catch (e) {
      setStatus(`RPC query failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [circleId, currentAddress]);

  React.useEffect(() => {
    void refreshState();
  }, [refreshState]);

  async function submit(kind: TxKind, fields: Record<string, unknown>) {
    if (!currentAddress) throw new Error('Select an account first');
    if (!password) throw new Error('Enter wallet password for signing');
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
    setStatus(`${kind} submitted. Waiting for block, then refreshing state...`);
    await sleep(1200);
    await refreshState();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">RepuRing Social-Fi</p>
        <h1 className="text-3xl font-semibold text-white">Onchain trust circles, reputation, and roles</h1>
        <p className="max-w-3xl text-sm text-zinc-400">
          Submit real RepuRing plugin transactions to Canopy RPC and read committed Social-Fi state from the local chain.
        </p>
      </header>

      <section id="dashboard" className="grid gap-3 rounded-lg border border-zinc-800 bg-bg-secondary p-4 md:grid-cols-4">
        <Stat label="Current account" value={currentAddress || 'No signing account selected'} />
        <Stat label="Profile" value={profile ? `${profile.username}: ${profile.bio || 'no bio'}` : 'No onchain profile'} />
        <Stat label="Reputation" value={profile ? String(profile.reputation) : '0'} />
        <Stat label="Role" value={role ? `${role.role}${role.claimedRole ? '' : ' (claimable)'}` : 'No role'} />
        <label className="md:col-span-3">
          <span className="mb-1 block text-sm text-zinc-400">Signing key password</span>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Button onClick={refreshState}>Refresh state</Button>
        <div className="md:col-span-4 rounded-md border border-zinc-800 bg-black/20 p-3 text-sm text-zinc-300">{status}</div>
        <div className="md:col-span-4 break-all rounded-md border border-zinc-800 bg-black/20 p-3 text-xs text-zinc-500">Last tx: {lastTx || 'none'}</div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="profile" title="Create Profile">
          <Input label="Username" value={profileForm.username} onChange={(username) => setProfileForm({ ...profileForm, username })} />
          <Input label="Bio" value={profileForm.bio} onChange={(bio) => setProfileForm({ ...profileForm, bio })} />
          <Input label="Avatar URL" value={profileForm.avatarUrl} onChange={(avatarUrl) => setProfileForm({ ...profileForm, avatarUrl })} />
          <Button onClick={() => submit('createProfile', profileForm)}>Submit CreateProfileTx</Button>
        </Panel>

        <Panel id="circles" title="Circles">
          <Input label="Circle ID" value={circleId} onChange={setCircleId} />
          <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} />
          <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => submit('createCircle', { circleId, ...circleForm })}>CreateCircleTx</Button>
            <Button onClick={() => submit('joinCircle', { circleId })}>JoinCircleTx</Button>
          </div>
          <div className="rounded-md border border-zinc-800 bg-black/20 p-3 text-sm text-zinc-300">
            <div className="font-semibold text-white">{circle?.name || 'Circle not found'}</div>
            <div className="text-zinc-400">{circle?.description || 'Create or query a circle to load members.'}</div>
            <AddressList values={circle?.members || []} />
          </div>
        </Panel>

        <Panel id="endorse" title="Endorse">
          <Input label="Circle ID" value={circleId} onChange={setCircleId} />
          <Input label="Target address" value={targetAddress} onChange={setTargetAddress} />
          <label>
            <span className="mb-1 block text-sm text-zinc-400">Tag</span>
            <select className="input" value={endorse.tag} onChange={(e) => setEndorse({ ...endorse, tag: e.target.value })}>
              {['builder', 'helper', 'creator', 'leader', 'trusted'].map((tag) => <option key={tag}>{tag}</option>)}
            </select>
          </label>
          <Input label="Message" value={endorse.message} onChange={(message) => setEndorse({ ...endorse, message })} />
          <Button onClick={() => submit('endorseUser', { circleId, targetAddress, ...endorse })}>Submit EndorseUserTx</Button>
        </Panel>

        <Panel id="admin" title="Roles and Admin Slash">
          <Input label="Circle ID" value={circleId} onChange={setCircleId} />
          <Button onClick={() => submit('claimRole', { circleId })}>ClaimRoleTx</Button>
          <Input label="Endorsement ID" value={endorsementId} onChange={setEndorsementId} />
          <Input label="Slash reason" value={slashReason} onChange={setSlashReason} />
          <Button onClick={() => submit('slashEndorsement', { endorsementId, reason: slashReason })}>SlashEndorsementTx</Button>
        </Panel>
      </div>

      <Panel id="leaderboard" title="Leaderboard">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr><th className="py-2">Rank</th><th>User</th><th>Reputation</th><th>Role</th><th>Address</th></tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr><td className="py-3 text-zinc-500" colSpan={5}>No leaderboard state found for this circle.</td></tr>
              ) : leaderboard.map((row, index) => (
                <tr key={row.address} className="border-t border-zinc-800">
                  <td className="py-2 text-zinc-400">{index + 1}</td>
                  <td className="font-medium text-white">{row.username}</td>
                  <td>{row.reputation}</td>
                  <td>{row.role}</td>
                  <td className="break-all font-mono text-xs text-zinc-500">{row.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-2">
          <div className="text-sm font-semibold text-white">Endorsements for current account</div>
          {endorsements.length === 0 ? <div className="text-sm text-zinc-500">No endorsements found.</div> : endorsements.map((item) => (
            <div key={item.endorsementId} className="rounded-md border border-zinc-800 bg-black/20 p-3 text-sm">
              <div className="break-all font-mono text-xs text-zinc-500">{item.endorsementId}</div>
              <div className="text-zinc-300">{item.tag}: {item.message}</div>
              {item.slashed && <div className="text-red-400">Slashed: {item.slashReason}</div>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-20 space-y-3 rounded-lg border border-zinc-800 bg-bg-secondary p-4"><h2 className="text-lg font-semibold text-white">{title}</h2>{children}</section>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs uppercase text-zinc-500">{label}</div><div className="break-all font-mono text-sm text-zinc-100">{value}</div></div>;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label><span className="mb-1 block text-sm text-zinc-400">{label}</span><input className="input" value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Button({ children, onClick }: { children: React.ReactNode; onClick: () => Promise<void> | void }) {
  return <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-black hover:brightness-110" onClick={() => void Promise.resolve(onClick()).catch((e) => alert(e.message || String(e)))}>{children}</button>;
}

function AddressList({ values }: { values: string[] }) {
  if (values.length === 0) return <div className="pt-2 text-sm text-zinc-500">No members loaded.</div>;
  return <div className="mt-2 space-y-1">{values.map((value) => <div className="break-all font-mono text-xs text-zinc-500" key={value}>{value}</div>)}</div>;
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
    case 'createCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId), fieldString(3, v.name), fieldString(4, v.description)]);
    case 'joinCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
    case 'endorseUser':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId), fieldBytes(3, hexToBytes(String(v.targetAddress))), fieldString(4, v.tag), fieldString(5, v.message)]);
    case 'slashEndorsement':
      return concat([fieldBytes(1, sender), fieldString(2, v.endorsementId), fieldString(3, v.reason)]);
    case 'claimRole':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
  }
}

function encodeTransaction(v: { messageType: string; typeUrl: string; msgBytes: Uint8Array; createdHeight: number; time: number; fee: number; networkID: number; chainID: number }) {
  const anyMsg = concat([fieldString(1, v.typeUrl), fieldBytes(2, v.msgBytes)]);
  return concat([
    fieldString(1, v.messageType),
    fieldBytes(2, anyMsg),
    fieldVarint(4, v.createdHeight),
    fieldVarint(5, v.time),
    fieldVarint(6, v.fee),
    fieldVarint(8, v.networkID),
    fieldVarint(9, v.chainID),
  ]);
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
function cleanHex(v: string) { return String(v || '').trim().replace(/^0x/, '').toLowerCase(); }
function hexToBytes(hex: string) {
  const clean = cleanHex(hex);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''); }
function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
