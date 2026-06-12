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

  const profileRole = role?.role || roleForReputation(profile?.reputation || 0);
  const rpcTone = status.toLowerCase().includes('failed') ? 'danger' : status.toLowerCase().includes('submitting') ? 'warning' : 'success';

  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-12%] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[28%] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <main className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge>Social-Fi</Badge>
                <Badge>Custom Canopy TXs</Badge>
                <Badge>RPC 50002/50003</Badge>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">RepuRing</p>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
                  Onchain trust circles for builders, communities, and reputation.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-300">
                  Every profile, circle, endorsement, slash, and role claim is a signed custom transaction submitted to the local Canopy chain, then read back from committed RPC state.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ['01', 'Create profile', 'Register your builder identity onchain.'],
                  ['02', 'Join circle', 'Enter a trusted Social-Fi community.'],
                  ['03', 'Endorse trust', 'Give verifiable reputation to members.'],
                  ['04', 'Claim role', 'Unlock status from onchain score.'],
                ].map(([step, title, copy]) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold text-emerald-300">{step}</div>
                    <div className="mt-2 font-semibold text-white">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-zinc-400">{copy}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-emerald-300/20 bg-black/30 p-5 shadow-xl shadow-emerald-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Live demo circle</p>
                  <h2 className="text-2xl font-semibold text-white">{circle?.name || circleForm.name}</h2>
                </div>
                <StatusPill tone={rpcTone}>{rpcTone === 'danger' ? 'RPC issue' : rpcTone === 'warning' ? 'Submitting' : 'RPC ready'}</StatusPill>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Metric label="Members" value={String(circle?.members?.length || 0)} />
                <Metric label="Reputation" value={String(profile?.reputation || 0)} />
                <Metric label="Role" value={roleBadge(profileRole)} />
                <Metric label="Tx mode" value="Signed" />
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Last transaction</p>
                <p className="mt-2 break-all font-mono text-xs text-zinc-300">{lastTx || 'No transaction submitted yet'}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
          <StatCard label="Current account" value={shortAddress(currentAddress) || 'No account'} detail={currentAddress || 'Select a wallet account before signing.'} />
          <StatCard label="Profile" value={profile?.username || 'Not created'} detail={profile?.bio || 'CreateProfileTx will initialize reputation at 0.'} />
          <StatCard label="Reputation score" value={String(profile?.reputation || 0)} detail="Earned from member endorsements." />
          <Panel className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Role badge</p>
                <p className="mt-1 text-xl font-semibold text-white">{roleBadge(profileRole)}</p>
              </div>
              <StatusPill tone={role?.claimedRole ? 'success' : 'warning'}>{role?.claimedRole ? 'Claimed' : 'Claimable'}</StatusPill>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Circle members" value={String(circle?.members?.length || 0)} />
              <Metric label="RPC status" value={rpcTone === 'danger' ? 'Issue' : 'Live'} />
            </div>
          </Panel>
        </section>

        <Panel className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for keystore-get and BLS signing" />
          <Button onClick={refreshState}>Refresh chain state</Button>
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">{status}</div>
        </Panel>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel id="profile" title="Create Profile" eyebrow="CreateProfileTx">
            <Input label="Username" value={profileForm.username} onChange={(username) => setProfileForm({ ...profileForm, username })} placeholder="alice_builder" />
            <Input label="Bio" value={profileForm.bio} onChange={(bio) => setProfileForm({ ...profileForm, bio })} placeholder="Canopy community builder" multiline />
            <Input label="Avatar URL" value={profileForm.avatarUrl} onChange={(avatarUrl) => setProfileForm({ ...profileForm, avatarUrl })} placeholder="https://..." />
            <Button onClick={() => submit('createProfile', profileForm)}>Submit CreateProfileTx</Button>
          </Panel>

          <Panel id="circles" title="Circles" eyebrow="CreateCircleTx + JoinCircleTx">
            <Input label="Circle ID" value={circleId} onChange={setCircleId} />
            <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} />
            <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} multiline />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => submit('createCircle', { circleId, ...circleForm })}>CreateCircleTx</Button>
              <Button variant="secondary" onClick={() => submit('joinCircle', { circleId })}>JoinCircleTx</Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{circle?.name || 'Circle not found'}</div>
                  <div className="mt-1 text-sm text-zinc-400">{circle?.description || 'Create or query a circle to load members.'}</div>
                </div>
                <Badge>{circle?.members?.length || 0} members</Badge>
              </div>
              <AddressList values={circle?.members || []} />
            </div>
          </Panel>

          <Panel id="endorse" title="Endorse Member" eyebrow="EndorseUserTx">
            <Input label="Circle ID" value={circleId} onChange={setCircleId} />
            <Input label="Target address" value={targetAddress} onChange={setTargetAddress} placeholder="Hex address of another circle member" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">Tag</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20" value={endorse.tag} onChange={(e) => setEndorse({ ...endorse, tag: e.target.value })}>
                {['builder', 'helper', 'creator', 'leader', 'trusted'].map((tag) => <option key={tag}>{tag}</option>)}
              </select>
            </label>
            <Input label="Message" value={endorse.message} onChange={(message) => setEndorse({ ...endorse, message })} multiline />
            <Button onClick={() => submit('endorseUser', { circleId, targetAddress, ...endorse })}>Submit EndorseUserTx</Button>
          </Panel>

          <Panel id="admin" title="Roles and Admin Slash" eyebrow="ClaimRoleTx + SlashEndorsementTx">
            <Input label="Circle ID" value={circleId} onChange={setCircleId} />
            <Button onClick={() => submit('claimRole', { circleId })}>ClaimRoleTx</Button>
            <div className="h-px bg-white/10" />
            <Input label="Endorsement ID" value={endorsementId} onChange={setEndorsementId} placeholder="Paste endorsement ID to slash" />
            <Input label="Slash reason" value={slashReason} onChange={setSlashReason} multiline />
            <Button variant="danger" onClick={() => submit('slashEndorsement', { endorsementId, reason: slashReason })}>SlashEndorsementTx</Button>
          </Panel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Panel id="leaderboard" title="Leaderboard" eyebrow="Circle reputation ranking">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Reputation</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr><td className="px-4 py-8" colSpan={5}><EmptyState title="No leaderboard yet" copy="Create or join a circle, endorse members, then refresh committed chain state." /></td></tr>
                  ) : leaderboard.map((row, index) => (
                    <tr key={row.address} className="border-t border-white/10 bg-black/10">
                      <td className="px-4 py-4 font-mono text-zinc-400">#{index + 1}</td>
                      <td className="px-4 py-4 font-semibold text-white">{row.username || 'Unnamed'}</td>
                      <td className="px-4 py-4"><Badge>{row.reputation} rep</Badge></td>
                      <td className="px-4 py-4"><Badge tone="cyan">{roleBadge(row.role || roleForReputation(row.reputation))}</Badge></td>
                      <td className="px-4 py-4 font-mono text-xs text-zinc-500">{shortAddress(row.address)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Endorsements" eyebrow="For current account">
            {endorsements.length === 0 ? (
              <EmptyState title="No endorsements found" copy="Endorsements targeting the selected account will appear here after they are committed onchain." />
            ) : (
              <div className="grid gap-3">
                {endorsements.map((item) => (
                  <div key={item.endorsementId} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone="emerald">{item.tag}</Badge>
                      <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{item.message || 'No message'}</p>
                    <div className="mt-4 grid gap-2 text-xs text-zinc-500">
                      <div>From <span className="font-mono text-zinc-300">{shortAddress(item.fromAddress)}</span></div>
                      <div>ID <span className="font-mono text-zinc-300">{item.endorsementId}</span></div>
                      {item.slashed && <div className="text-red-300">Reason: {item.slashReason || 'not provided'}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </main>
    </div>
  );
}

function Panel({ id, title, eyebrow, className = '', children }: { id?: string; title?: string; eyebrow?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/20 backdrop-blur-xl ${className}`}>
      {(title || eyebrow) && (
        <div className="mb-4">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p>}
          {title && <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-all text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 line-clamp-2 break-all text-sm text-zinc-400">{detail}</p>
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function Badge({ children, tone = 'emerald' }: { children: React.ReactNode; tone?: 'emerald' | 'cyan' | 'zinc' }) {
  const tones = {
    emerald: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
    cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
    zinc: 'border-white/10 bg-white/5 text-zinc-300',
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function StatusPill({ children, tone }: { children: React.ReactNode; tone: 'success' | 'warning' | 'danger' }) {
  const tones = {
    success: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
    warning: 'border-amber-300/30 bg-amber-400/10 text-amber-200',
    danger: 'border-red-300/30 bg-red-400/10 text-red-200',
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-500">{copy}</p>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, multiline = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; multiline?: boolean }) {
  const inputClass = 'w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20';
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">{label}</span>
      {multiline ? (
        <textarea className={`${inputClass} min-h-24 resize-y`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputClass} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Button({ children, onClick, variant = 'primary' }: { children: React.ReactNode; onClick: () => Promise<void> | void; variant?: 'primary' | 'secondary' | 'danger' }) {
  const variants = {
    primary: 'border-emerald-300/30 bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950 hover:shadow-emerald-500/20',
    secondary: 'border-white/10 bg-white/8 text-white hover:bg-white/12',
    danger: 'border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25',
  };
  return (
    <button className={`rounded-2xl border px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${variants[variant]}`} onClick={() => void Promise.resolve(onClick()).catch((e) => alert(e.message || String(e)))}>
      {children}
    </button>
  );
}

function AddressList({ values }: { values: string[] }) {
  if (values.length === 0) return <EmptyState title="No members loaded" copy="Circle members will appear after CreateCircleTx or JoinCircleTx is committed." />;
  return (
    <div className="mt-4 grid gap-2">
      {values.map((value) => (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs" key={value}>
          <span className="font-mono text-zinc-300">{shortAddress(value)}</span>
          <span className="font-mono text-zinc-600">{value.slice(-8)}</span>
        </div>
      ))}
    </div>
  );
}

function shortAddress(value: string) {
  const clean = cleanHex(value);
  if (!clean) return '';
  return clean.length <= 14 ? clean : `${clean.slice(0, 6)}...${clean.slice(-6)}`;
}

function roleForReputation(reputation: number) {
  if (reputation >= 30) return 'Circle Leader';
  if (reputation >= 15) return 'Core Member';
  if (reputation >= 5) return 'Trusted';
  return 'Newbie';
}

function roleBadge(roleName: string) {
  const role = roleName || 'Newbie';
  const icon = role === 'Circle Leader' ? '👑' : role === 'Core Member' ? '🛠' : role === 'Trusted' ? '🔰' : '🌱';
  return `${icon} ${role}`;
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
