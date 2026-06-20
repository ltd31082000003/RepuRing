import React from 'react';
import { Link } from 'react-router-dom';
import { cleanHex } from './RepuRingProvider';

export function RepuRingPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b14] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-12%] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[28%] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <main className="mx-auto min-w-0 max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, copy, actions }: { eyebrow: string; title: string; copy: string; actions?: React.ReactNode }) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="break-words text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p>
          <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-4 break-words text-base leading-7 text-zinc-300">{copy}</p>
        </div>
        {actions && <div className="flex w-full flex-wrap gap-3 sm:w-auto">{actions}</div>}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, copy, actions }: { eyebrow?: string; title: string; copy?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="break-words text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p>}
        <h2 className="mt-1 break-words text-2xl font-semibold text-white">{title}</h2>
        {copy && <p className="mt-2 max-w-2xl break-words text-sm leading-6 text-zinc-400">{copy}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">{actions}</div>}
    </div>
  );
}

export function Panel({ id, title, eyebrow, className = '', children }: { id?: string; title?: string; eyebrow?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`min-w-0 scroll-mt-20 rounded-3xl border border-white/10 bg-white/[0.045] p-4 sm:p-5 shadow-xl shadow-black/20 backdrop-blur-xl ${className}`}>
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

export function SocialCard({ children, selected = false, className = '' }: { children: React.ReactNode; selected?: boolean; className?: string }) {
  return (
    <article className={`min-w-0 overflow-hidden rounded-3xl border p-4 shadow-xl shadow-black/20 backdrop-blur-xl transition sm:p-5 ${selected ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-white/[0.04]'} ${className}`}>
      {children}
    </article>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 line-clamp-2 break-words text-sm text-zinc-400">{detail}</p>
    </Panel>
  );
}

export function MetricCard({ label, value, detail, tone = 'neutral' }: { label: string; value: string; detail?: string; tone?: 'neutral' | 'emerald' | 'cyan' | 'red' }) {
  const tones = {
    neutral: 'from-white/[0.055] to-white/[0.025] border-white/10',
    emerald: 'from-emerald-400/15 to-white/[0.025] border-emerald-300/20',
    cyan: 'from-cyan-400/15 to-white/[0.025] border-cyan-300/20',
    red: 'from-red-400/15 to-white/[0.025] border-red-300/20',
  };
  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-4 shadow-lg shadow-black/20 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold text-white">{value}</p>
      {detail && <p className="mt-2 line-clamp-2 break-words text-sm text-zinc-400">{detail}</p>}
    </div>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 break-words text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function AvatarFallback({ label, src }: { label?: string; src?: string }) {
  const initial = (label || 'R').trim().slice(0, 1).toUpperCase() || 'R';
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-300/20 to-cyan-300/10 text-sm font-bold text-emerald-100">
      {src ? <img src={src} alt={label || 'avatar'} className="h-full w-full object-cover" /> : initial}
    </div>
  );
}

export function Badge({ children, tone = 'emerald' }: { children: React.ReactNode; tone?: 'emerald' | 'cyan' | 'zinc' | 'red' }) {
  const tones = {
    emerald: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
    cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
    zinc: 'border-white/10 bg-white/5 text-zinc-300',
    red: 'border-red-300/30 bg-red-400/10 text-red-200',
  };
  return <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-center text-xs font-semibold leading-5 [overflow-wrap:anywhere] ${tones[tone]}`}>{children}</span>;
}

export function CategoryBadge({ category }: { category: string }) {
  const normalized = category || 'builder';
  const tones: Record<string, 'emerald' | 'cyan' | 'zinc'> = {
    builder: 'emerald',
    helper: 'cyan',
    creator: 'emerald',
    researcher: 'cyan',
    tester: 'zinc',
    educator: 'emerald',
  };
  return <Badge tone={tones[normalized] || 'zinc'}>{normalized}</Badge>;
}

export function ReputationBadge({ value }: { value: number }) {
  return <Badge tone={value > 0 ? 'emerald' : 'zinc'}>{value} reputation</Badge>;
}

export function StatusPill({ children, tone }: { children: React.ReactNode; tone: 'success' | 'warning' | 'danger' | 'neutral' }) {
  const tones = {
    success: 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200',
    warning: 'border-amber-300/30 bg-amber-400/10 text-amber-200',
    danger: 'border-red-300/30 bg-red-400/10 text-red-200',
    neutral: 'border-white/10 bg-white/5 text-zinc-300',
  };
  return <span className={`inline-flex max-w-full rounded-full border px-3 py-1 text-center text-xs font-semibold leading-5 [overflow-wrap:anywhere] ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, copy, actions }: { title: string; copy: string; actions?: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-5 text-center sm:p-8">
      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.04]" />
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 break-words text-sm text-zinc-500">{copy}</p>
      {actions && <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>}
    </div>
  );
}

type JourneyStatus = 'done' | 'current' | 'blocked' | 'optional';

export function SocialFiJourney({
  currentAddress,
  profile,
  circle,
  contributions,
  selectedContributionId,
  leaderboard,
  role,
  endorsements,
}: {
  currentAddress: string;
  profile: { reputation: number } | null;
  circle: { members?: string[] } | null;
  contributions: Array<{ contributionId: string }>;
  selectedContributionId: string;
  leaderboard: Array<unknown>;
  role: { claimedRole?: boolean; role?: string } | null;
  endorsements: Array<unknown>;
}) {
  const memberReady = Boolean(
    currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)),
  );
  const completion = [
    Boolean(currentAddress),
    Boolean(profile),
    Boolean(circle),
    memberReady,
    contributions.length > 0,
    Boolean(selectedContributionId),
    Boolean((profile?.reputation || 0) > 0 || leaderboard.length > 0),
    Boolean(role?.claimedRole || role?.role),
  ];
  const firstPending = completion.findIndex((done) => !done);
  const statusFor = (index: number): JourneyStatus => completion[index]
    ? 'done'
    : index === firstPending
      ? 'current'
      : 'blocked';
  const steps: Array<{ title: string; copy: string; status: JourneyStatus; to: string; tx?: string }> = [
    { title: 'Wallet selected', copy: 'Select a local signing key before submitting Social-Fi transactions.', status: statusFor(0), to: '/key-management' },
    { title: 'Profile created', copy: 'Store your contributor identity in RepuRing plugin state.', status: statusFor(1), to: '/key-management', tx: 'CreateProfileTx' },
    { title: 'Project circle loaded', copy: 'Create or load the project community used by the remaining flow.', status: statusFor(2), to: '/repuring/circles', tx: 'CreateCircleTx' },
    { title: 'Member ready', copy: 'Join the selected circle before posting work.', status: statusFor(3), to: '/repuring/circles', tx: 'JoinCircleTx' },
    { title: 'Proof-of-work posted', copy: 'Publish a contribution proof into the selected circle.', status: statusFor(4), to: '/repuring/contributions', tx: 'CreateContributionTx' },
    { title: 'Contribution review ready', copy: 'Select useful work and switch to another member account to endorse it.', status: statusFor(5), to: '/repuring/endorse', tx: 'EndorseContributionTx' },
    { title: 'Reputation visible', copy: 'Peer-endorsed contribution proofs increase profile reputation.', status: statusFor(6), to: '/repuring/leaderboard' },
    { title: 'Role claimed', copy: 'Store a role for this circle based on current profile reputation.', status: statusFor(7), to: '/repuring/admin', tx: 'ClaimRoleTx' },
    { title: 'Moderation ready', copy: 'The circle creator/admin can review and slash invalid endorsements.', status: endorsements.length > 0 ? 'done' : 'optional', to: '/repuring/admin', tx: 'SlashEndorsementTx' },
  ];
  const statusStyles: Record<JourneyStatus, string> = {
    done: 'border-emerald-300/30 bg-emerald-300/10',
    current: 'border-cyan-300/40 bg-cyan-300/10 ring-1 ring-cyan-300/20',
    blocked: 'border-white/10 bg-black/20 opacity-70',
    optional: 'border-amber-300/20 bg-amber-300/[0.06]',
  };
  const statusLabels: Record<JourneyStatus, string> = {
    done: 'Done',
    current: 'Next',
    blocked: 'Locked',
    optional: 'Optional',
  };

  return (
    <Panel>
      <SectionHeader
        eyebrow="Demo journey"
        title="Follow the live Social-Fi state transition"
        copy="Each completed step is backed by a signed custom transaction or a RepuRing RPC query."
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <Link key={step.title} to={step.to} className={['group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/30', statusStyles[step.status]].join(' ')}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-xs font-bold text-emerald-200">
                  {step.status === 'done' ? 'OK' : String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{step.copy}</p>
                </div>
              </div>
              <StatusPill tone={step.status === 'done' ? 'success' : step.status === 'current' ? 'warning' : 'neutral'}>
                {statusLabels[step.status]}
              </StatusPill>
            </div>
            {step.tx && <div className="mt-3 pl-11"><Badge tone="zinc">{step.tx}</Badge></div>}
          </Link>
        ))}
      </div>
      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4 text-sm leading-6 text-cyan-100/80">
        Demo setup: run local RPC on <span className="font-mono text-cyan-100">50002</span> and admin keystore RPC on <span className="font-mono text-cyan-100">50003</span>. Select a wallet, then enter its password when signing. Contribution endorsement requires a second circle member account.
      </div>
    </Panel>
  );
}

export function DemoReadinessCard({
  currentAddress,
  profile,
  circle,
  circleId,
  contributions,
  endorsements,
  status,
  lastTx,
  onRefresh,
}: {
  currentAddress: string;
  profile: object | null;
  circle: { name?: string; creatorAddress?: string; members?: string[] } | null;
  circleId: string;
  contributions: Array<unknown>;
  endorsements: Array<unknown>;
  status: string;
  lastTx: string;
  onRefresh: () => Promise<void>;
}) {
  const normalizedStatus = status.toLowerCase();
  const rpcReady = normalizedStatus.includes('refreshed') &&
    !normalizedStatus.includes('failed') &&
    !normalizedStatus.includes('start local');
  const memberCount = circle?.members?.length || 0;
  const creatorReady = Boolean(
    currentAddress && circle?.creatorAddress && cleanHex(currentAddress) === cleanHex(circle.creatorAddress),
  );
  const items = [
    { label: 'Local RPC', ready: rpcReady, detail: rpcReady ? 'Chain state refreshed.' : 'Start both local RPC services.' },
    { label: 'Signing wallet', ready: Boolean(currentAddress), detail: currentAddress ? shortAddress(currentAddress) : 'Select a local wallet in My Account.' },
    { label: 'Onchain profile', ready: Boolean(profile), detail: profile ? 'Contributor identity active.' : 'Create a profile before joining or posting.' },
    { label: 'Project circle', ready: Boolean(circle), detail: circle?.name || circleId || 'Create or load a project circle.' },
    { label: 'Contribution proof', ready: contributions.length > 0, detail: contributions.length > 0 ? String(contributions.length) + ' proof(s) loaded.' : 'Post proof-of-work as a circle member.' },
    { label: 'Peer endorsement', ready: contributions.length > 0 && memberCount > 1, detail: memberCount > 1 ? 'A second member can review work.' : 'Add a second circle member; self-endorsement is blocked.' },
    { label: 'Admin moderation', ready: creatorReady && endorsements.length > 0, detail: creatorReady ? (endorsements.length > 0 ? 'Slash candidates available.' : 'Create an endorsement before moderation.') : 'Select the circle creator/admin wallet.' },
  ];

  return (
    <Panel>
      <SectionHeader
        eyebrow="Demo readiness"
        title="Canopy RPC and signing readiness"
        copy="Verify local services and transaction prerequisites before running the end-to-end flow. Passwords are used only for local wallet signing."
        actions={<StatusPill tone={rpcReady ? 'success' : 'warning'}>{rpcReady ? 'RPC connected' : 'Setup required'}</StatusPill>}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className={['rounded-2xl border p-4', item.ready ? 'border-emerald-300/25 bg-emerald-300/10' : 'border-white/10 bg-black/20'].join(' ')}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{item.label}</p>
              <StatusPill tone={item.ready ? 'success' : 'neutral'}>{item.ready ? 'Ready' : 'Missing'}</StatusPill>
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-400">{item.detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Query and transaction RPC</p>
          <p className="mt-1 break-all font-mono text-cyan-100">http://localhost:50002</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/70">Admin and keystore RPC</p>
          <p className="mt-1 break-all font-mono text-cyan-100">http://localhost:50003</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Live status</p>
          <p className="mt-1 text-sm text-zinc-300">{status}</p>
          <p className="mt-1 break-all font-mono text-xs text-zinc-600">{lastTx || 'No transaction submitted yet'}</p>
        </div>
        <Button variant="secondary" onClick={onRefresh}>Refresh readiness</Button>
      </div>
    </Panel>
  );
}

const roleThresholds = [
  { name: 'Newbie', min: 0, max: 4 },
  { name: 'Trusted', min: 5, max: 14 },
  { name: 'Core Member', min: 15, max: 29 },
  { name: 'Circle Leader', min: 30, max: null },
] as const;

export function RoleProgressCard({ reputation, embedded = false }: { reputation: number; embedded?: boolean }) {
  const currentRole = roleForReputation(reputation);
  const nextThreshold = roleThresholds.find((threshold) => threshold.min > reputation);
  const needed = nextThreshold ? nextThreshold.min - reputation : 0;
  const content = (
    <>
      <SectionHeader
        eyebrow="Reputation path"
        title="From contribution proof to community role"
        copy="Profile reputation comes from endorsed contribution proofs and determines the role that can be claimed for the selected circle."
        actions={<Badge tone="cyan">{roleBadge(currentRole)}</Badge>}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Current reputation" value={String(reputation)} detail="Profile-level reputation from endorsed work." tone="emerald" />
        <MetricCard label="Current role" value={currentRole} detail="Derived from the unchanged role thresholds." tone="cyan" />
        <MetricCard
          label="Next milestone"
          value={nextThreshold ? nextThreshold.name : 'Top role reached'}
          detail={nextThreshold ? 'Need ' + String(needed) + ' more reputation.' : 'Circle Leader is the highest role.'}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {roleThresholds.map((threshold) => {
          const active = reputation >= threshold.min;
          const range = threshold.max === null ? String(threshold.min) + '+' : String(threshold.min) + '..' + String(threshold.max);
          return (
            <div key={threshold.name} className={['rounded-2xl border p-3', active ? 'border-emerald-300/25 bg-emerald-300/10' : 'border-white/10 bg-black/20'].join(' ')}>
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">{threshold.name}</p>
                <Badge tone={active ? 'emerald' : 'zinc'}>{range}</Badge>
              </div>
              <p className="mt-2 text-xs text-zinc-500">{currentRole === threshold.name ? 'Current derived role' : active ? 'Milestone reached' : 'Not reached'}</p>
            </div>
          );
        })}
      </div>
    </>
  );

  if (embedded) return <div className="space-y-4">{content}</div>;
  return <Panel>{content}</Panel>;
}
export function DangerPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-red-300/25 bg-gradient-to-br from-red-500/15 to-black/20 p-5 shadow-xl shadow-red-950/20">
      {children}
    </div>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder, multiline = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; multiline?: boolean }) {
  const inputClass = 'min-w-0 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20';
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

export function Button({ children, onClick, variant = 'primary', to, className = '' }: { children: React.ReactNode; onClick?: () => Promise<void> | void; variant?: 'primary' | 'secondary' | 'danger'; to?: string; className?: string }) {
  const variants = {
    primary: 'border-emerald-300/30 bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950 hover:shadow-emerald-500/20',
    secondary: 'border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]',
    danger: 'border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25',
  };
  const buttonClass = `inline-flex max-w-full items-center justify-center whitespace-normal rounded-2xl border px-5 py-3 text-center text-sm font-semibold leading-5 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14] ${variants[variant]} ${className}`;
  if (to) return <Link className={buttonClass} to={to}>{children}</Link>;
  return (
    <button type="button" className={buttonClass} onClick={() => void Promise.resolve(onClick?.()).catch((e) => alert(e.message || String(e)))}>
      {children}
    </button>
  );
}

export function AddressList({ values }: { values: string[] }) {
  if (values.length === 0) return <EmptyState title="No members loaded" copy="Circle members will appear after CreateCircleTx or JoinCircleTx is committed." />;
  return (
    <div className="mt-4 grid gap-2">
      {values.map((value) => (
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs" key={value}>
          <span className="font-mono text-zinc-300">{shortAddress(value)}</span>
          <span className="font-mono text-zinc-600">{cleanHex(value).slice(-8)}</span>
        </div>
      ))}
    </div>
  );
}

export function MemberList({ values, currentAddress, creatorAddress }: { values: string[]; currentAddress: string; creatorAddress: string }) {
  if (values.length === 0) return <EmptyState title="No members loaded" copy="Circle members will appear after CreateCircleTx or JoinCircleTx is committed." />;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {values.map((value) => {
        const clean = cleanHex(value);
        const isCurrent = clean === cleanHex(currentAddress);
        const isCreator = clean === cleanHex(creatorAddress);
        return (
          <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4" key={value}>
            <AvatarFallback label={clean} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-zinc-200">{shortAddress(value)}</p>
              <p className="mt-1 font-mono text-xs text-zinc-600">{clean.slice(-12)}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              {isCurrent && <Badge tone="cyan">You</Badge>}
              {isCreator && <Badge>Creator</Badge>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TxStatusCard({ status, lastTx, onRefresh }: { status: string; lastTx: string; onRefresh: () => Promise<void> }) {
  return (
    <Panel className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0" aria-live="polite">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">RPC status</p>
        <p className="mt-2 break-words text-sm text-zinc-300">{status}</p>
        <p className="mt-2 break-all font-mono text-xs text-zinc-500">{lastTx || 'No transaction submitted yet'}</p>
      </div>
      <Button variant="secondary" className="self-start md:self-auto" onClick={onRefresh}>Refresh chain state</Button>
    </Panel>
  );
}

export function roleForReputation(reputation: number) {
  if (reputation >= 30) return 'Circle Leader';
  if (reputation >= 15) return 'Core Member';
  if (reputation >= 5) return 'Trusted';
  return 'Newbie';
}

export function roleBadge(roleName: string) {
  return roleName || 'Newbie';
}

export function shortAddress(value: string) {
  const clean = cleanHex(value);
  if (!clean) return '';
  return clean.length <= 14 ? clean : `${clean.slice(0, 6)}...${clean.slice(-6)}`;
}

export function rpcTone(status: string): 'success' | 'warning' | 'danger' {
  const lower = status.toLowerCase();
  if (lower.includes('failed') || lower.includes('offline')) return 'danger';
  if (lower.includes('submitting') || lower.includes('waiting') || lower.includes('start local')) return 'warning';
  return 'success';
}

