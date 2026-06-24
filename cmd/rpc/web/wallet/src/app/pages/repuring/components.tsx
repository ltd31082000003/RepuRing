import React from 'react';
import { Link } from 'react-router-dom';
import { useDS } from '@/core/useDs';
import { cleanHex } from './RepuRingProvider';

const repuNavItems = [
  { name: 'Overview', to: '/repuring' },
  { name: 'Circles', to: '/repuring/circles' },
  { name: 'Community', to: '/repuring/community' },
  { name: 'Post Work', to: '/repuring/contributions' },
  { name: 'Review Work', to: '/repuring/endorse' },
  { name: 'Leaderboard', to: '/repuring/leaderboard' },
  { name: 'Admin', to: '/repuring/admin' },
  { name: 'My Account', to: '/key-management' },
];

export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[28px] border border-[rgba(115,255,198,0.12)] bg-[#071c17]/78 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}

function MiniLogo() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px] border border-[rgba(115,255,198,0.12)] bg-[#103d31] text-[#54f3b3]">
      <span className="h-3 w-3 rounded-full border-2 border-current" />
    </span>
  );
}

export function DashboardPreview({
  currentAddress,
  profileName,
  hasProfile,
  communityState,
  reputation,
  role,
}: {
  currentAddress: string;
  profileName: string;
  hasProfile: boolean;
  communityState: OverviewCommunityState;
  reputation: number;
  role: string;
}) {
  const { data: blockHeight } = useDS<{ height: number }>('height', {}, {
    staleTimeMs: 10_000,
    refetchIntervalMs: 10_000,
  });
  const chainOnline = blockHeight != null;

  return (
    <GlassCard className="overflow-hidden">
      <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-[rgba(115,255,198,0.1)] px-5 py-4 sm:px-8 lg:px-10">
            <div className="flex flex-wrap gap-2">
              <Badge tone="cyan">RPC 50002 / 50003</Badge>
              <Badge tone={chainOnline ? 'emerald' : 'red'}>{chainOnline ? `chain #${blockHeight.height.toLocaleString()}` : 'chain offline'}</Badge>
            </div>
            <Button to="/key-management" variant="secondary" className="!px-4 !py-2 text-xs">My Account</Button>
          </div>

          <div className="space-y-6 p-5 sm:p-8 lg:p-10">
            <section className="grid gap-8 rounded-[24px] border border-[rgba(115,255,198,0.12)] bg-[#0a211b] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#54f3b3]">RepuRing / Social-Fi on Canopy</p>
                <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.04] text-[#f2fff8] sm:text-5xl lg:text-6xl">Onchain Social-Fi for Web3 contributors.</h1>
                <p className="mt-6 max-w-3xl text-sm font-semibold leading-7 text-[#9db9af] sm:text-base">
                  Create a contributor identity, join a community circle, post proof-of-work, get peer-reviewed, build reputation, and claim community status on Canopy testnet.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:min-w-[220px]">
                <Button to="/repuring/community">Open Community</Button>
                <Button to="/key-management" variant="secondary">{hasProfile ? 'Profile created' : 'Create Profile'}</Button>
                <Button to="/repuring/circles" variant="secondary">Discover Circles</Button>
              </div>
            </section>

            <section className="rounded-[24px] border border-[rgba(115,255,198,0.12)] bg-[#071c17] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <AvatarFallback label={profileName || currentAddress} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#9db9af]">Current profile</p>
                    <h2 className="truncate text-2xl font-extrabold text-[#f2fff8]">{profileName || 'Profile not created'}</h2>
                  </div>
                </div>
                <StatusPill tone={profileName ? 'success' : 'warning'}>{profileName ? 'Active' : 'Needed'}</StatusPill>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Wallet" value={shortAddress(currentAddress) || 'No wallet'} detail={currentAddress || 'Open My Account to select a local signing key.'} />
                <MetricCard label="Current Community" value={communityState.value} subValue={communityState.countLabel} detail={communityState.helper} tone={communityState.active ? 'cyan' : 'neutral'} />
                <MetricCard label="Global Reputation" value={String(reputation)} detail="Earned from endorsed proof-of-work." tone="emerald" />
                <MetricCard label="Role" value={roleBadge(role)} detail="Claim role from the Admin page." />
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded-[18px] border border-[rgba(115,255,198,0.12)] bg-[#0a211b] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold leading-6 text-[#9db9af]">{communityState.helper}</p>
                <Button to={communityState.ctaTo} variant={communityState.active ? 'secondary' : 'primary'} className="w-full sm:w-auto">
                  {communityState.ctaLabel}
                </Button>
              </div>
            </section>

            <section className="rounded-[24px] border border-[rgba(115,255,198,0.12)] bg-[#041612] p-5 sm:p-7">
              <SectionHeader eyebrow="Core loop" title="Identity to community status" copy="Every MVP screen supports this Social-Fi contribution loop." />
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ['01', 'Profile', 'Create a local contributor identity and connect a signing key.'],
                  ['02', 'Circle', 'Join builders, submit work, and review what peers ship.'],
                  ['03', 'Community', 'Turn verified contribution into reputation, role, and status.'],
                ].map(([num, title, copy]) => (
                  <div key={title} className="rounded-[18px] border border-[rgba(115,255,198,0.12)] bg-[#071c17] p-5">
                    <p className="text-xs font-extrabold text-[#54f3b3]">{num}</p>
                    <h3 className="mt-4 text-lg font-extrabold text-[#f2fff8]">{title}</h3>
                    <p className="mt-3 text-sm font-medium leading-6 text-[#9db9af]">{copy}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
      </div>
    </GlassCard>
  );
}

export function WorkspaceMapSection() {
  const cards = [
    ['Circles', 'Discover, create, or open builder circles and organize work around shared standards.'],
    ['Leaderboard', 'Rank contributors by earned reputation, endorsed proof-of-work, and community status.'],
    ['Admin', 'Claim roles, validate community actions, and manage the lightweight trust layer.'],
  ];
  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#54f3b3]">Workspace map</p>
          <h2 className="mt-5 max-w-lg text-4xl font-extrabold leading-[1.05] text-[#f2fff8]">Every navigation item becomes a clear contribution station.</h2>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ActionCard title="Post Work" copy="Submit proof-of-work with context, evidence, and circle alignment." to="/repuring/contributions" highlight />
        <ActionCard title="Review Work" copy="Endorse contribution without burying reviewers in noise." to="/repuring/endorse" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(([title, copy]) => (
          <ActionCard key={title} title={title} copy={copy} to={title === 'Circles' ? '/repuring/circles' : title === 'Admin' ? '/repuring/admin' : '/repuring/leaderboard'} />
        ))}
      </div>
    </section>
  );
}

export function ActionCard({ title, copy, to, highlight = false }: { title: string; copy: string; to: string; highlight?: boolean }) {
  return (
    <Link to={to} className={`group relative block min-h-[170px] rounded-[24px] border p-6 transition hover:-translate-y-1 hover:border-[rgba(115,255,198,0.28)] ${highlight ? 'border-[rgba(115,255,198,0.16)] bg-[#103d31]' : 'border-[rgba(115,255,198,0.12)] bg-[#071c17]'}`}>
      {highlight && <span className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#54f3b3] text-lg font-extrabold text-[#03120f]">↗</span>}
      <p className="text-sm font-extrabold text-[#54f3b3]">{title}</p>
      <h3 className="mt-4 max-w-md text-2xl font-extrabold leading-tight text-[#f2fff8]">{title === 'Post Work' ? 'Submit proof-of-work with context, evidence, and circle alignment.' : title === 'Review Work' ? 'Endorse contribution without burying reviewers in noise.' : title}</h3>
      <p className="mt-5 max-w-lg text-sm font-medium leading-6 text-[#9db9af]">{copy}</p>
    </Link>
  );
}

export function ReputationModelSection({
  currentAddress,
  reputation,
  communityState,
  role,
  hasProfile,
}: {
  currentAddress: string;
  reputation: number;
  communityState: OverviewCommunityState;
  role: string;
  hasProfile: boolean;
}) {
  const walletState = currentAddress
    ? ['Wallet selected', 'This account is the source for profile and community checks.']
    : ['No wallet', 'Select a wallet before profile and community state can be trusted.'];

  return (
    <GlassCard className="grid gap-8 p-8 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:p-10">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#54f3b3]">Reputation model</p>
        <h2 className="mt-5 max-w-lg text-4xl font-extrabold leading-[1.05] text-[#f2fff8]">Reputation is earned from endorsed work, not profile decoration.</h2>
        <p className="mt-6 max-w-lg text-sm font-semibold leading-7 text-[#9db9af]">
          RepuRing makes missing profile state explicit, then guides a contributor toward wallet selection, circle creation, proof submission, review, and role claim.
        </p>
      </div>
      <div className="relative min-h-[330px] rounded-[24px] border border-[rgba(115,255,198,0.12)] bg-[#041612] p-6">
        <div className="absolute left-1/2 top-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#103d31] shadow-[0_0_70px_rgba(84,243,179,0.18)]">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-[#f2fff8]">{reputation}</p>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#54f3b3]">Global Rep</p>
          </div>
        </div>
        {[
          ['left-6 top-6', walletState[0], walletState[1]],
          ['right-6 top-14', communityState.active ? communityState.value : 'Community pending', communityState.helper],
          ['left-10 bottom-10', roleBadge(role), 'Role language stays honest until reputation conditions are met.'],
          ['right-8 bottom-8', hasProfile ? 'Active' : 'Needed', 'Empty states become useful prompts instead of dead panels.'],
        ].map(([pos, title, copy]) => (
          <div key={title} className={`absolute ${pos} max-w-[230px] rounded-[18px] border border-[rgba(115,255,198,0.12)] bg-[#071c17] p-4`}>
            <p className="text-xs font-extrabold text-[#54f3b3]">{title}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#9db9af]">{copy}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function AccountStateSection({ profileName, hasProfile }: { profileName: string; hasProfile: boolean }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.8fr]">
      <GlassCard className="p-6">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#54f3b3]">Account state</p>
        <h2 className="mt-5 text-3xl font-extrabold text-[#f2fff8]">{profileName || 'Profile not created'}</h2>
        <p className="mt-5 text-sm font-medium leading-7 text-[#9db9af]">A contributor should always understand what is missing, what is possible, and what action comes next.</p>
      </GlassCard>
      <GlassCard className="grid gap-4 bg-[#103d31]/70 p-5 md:grid-cols-3">
        <ActionCard title={hasProfile ? 'Profile created' : 'Create Profile'} copy={hasProfile ? 'Your contributor identity is active for this wallet.' : 'Start the contributor identity and prepare the wallet state.'} to="/key-management" highlight />
        <ActionCard title="Open Community" copy="Enter the active circle and see community contribution paths." to="/repuring/community" />
        <ActionCard title="Discover Circles" copy="Browse builder groups before committing proof-of-work." to="/repuring/circles" />
      </GlassCard>
    </section>
  );
}

export function RepuRingFooter() {
  const { data: blockHeight } = useDS<{ height: number }>('height', {}, {
    staleTimeMs: 10_000,
    refetchIntervalMs: 10_000,
  });
  const chainOnline = blockHeight != null;

  return (
    <footer className="grid gap-8 border-t border-[rgba(115,255,198,0.12)] py-10 lg:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <Link to="/repuring" className="flex items-center gap-3">
          <MiniLogo />
          <span>
            <span className="block text-sm font-extrabold text-[#f2fff8]">RepuRing</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#54f3b3]">Social-Fi</span>
          </span>
        </Link>
        <p className="mt-5 max-w-sm text-sm font-medium leading-7 text-[#68867b]">Onchain Social-Fi for Web3 contributors building reputation through circles, proof-of-work, reviews, and community status.</p>
        <p className="mt-8 text-xs font-medium text-[#68867b]">© 2026 RepuRing. Contributor reputation interface.</p>
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#68867b]">Navigation</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {repuNavItems.slice(0, 8).map((item) => (
            <Link key={item.name} to={item.to} className="text-sm font-bold text-[#9db9af] transition hover:text-[#54f3b3]">{item.name}</Link>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#68867b]">Network</p>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-[18px] border border-[rgba(115,255,198,0.12)] bg-[#071c17] px-5 py-3 text-sm font-bold text-[#9db9af]"><span>RPC</span><span className="text-[#54f3b3]">50002 / 50003</span></div>
          <div className={`flex items-center justify-between rounded-[18px] border px-5 py-3 text-sm font-bold ${chainOnline ? 'border-[rgba(115,255,198,0.18)] bg-[#103d31] text-[#54f3b3]' : 'border-[#3b2525] bg-[#3b2525] text-[#d8b6b6]'}`}>
            <span>Chain</span>
            <span>{chainOnline ? `#${blockHeight.height.toLocaleString()}` : 'offline'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export type OverviewCommunityState = {
  value: string;
  countLabel?: string;
  helper: string;
  ctaLabel: string;
  ctaTo: string;
  active: boolean;
};

export function RepuRingPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 overflow-x-hidden text-[#f2fff8]">
      <main className="min-w-0 space-y-10 sm:space-y-12 lg:space-y-16">{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, copy, actions }: { eyebrow: string; title: string; copy: string; actions?: React.ReactNode }) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-[28px] border border-[rgba(115,255,198,0.12)] bg-[#071c17]/88 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(84,243,179,0.12),transparent_38%)]" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <p className="break-words text-[11px] font-extrabold uppercase tracking-[0.32em] text-[#54f3b3] sm:text-xs">{eyebrow}</p>
          <h1 className="mt-4 break-words text-3xl font-extrabold leading-[1.05] text-[#f2fff8] sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl break-words text-sm font-medium leading-7 text-[#9db9af] sm:text-base">{copy}</p>
        </div>
        {actions && <div className="flex w-full flex-wrap gap-3 sm:w-auto lg:flex-col">{actions}</div>}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, copy, actions }: { eyebrow?: string; title: string; copy?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="break-words text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#54f3b3]">{eyebrow}</p>}
        <h2 className="mt-2 break-words text-2xl font-extrabold leading-tight text-[#f2fff8]">{title}</h2>
        {copy && <p className="mt-3 max-w-2xl break-words text-sm font-medium leading-6 text-[#9db9af]">{copy}</p>}
      </div>
      {actions && <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">{actions}</div>}
    </div>
  );
}

export function Panel({ id, title, eyebrow, className = '', children }: { id?: string; title?: string; eyebrow?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`min-w-0 scroll-mt-20 rounded-[24px] border border-[rgba(115,255,198,0.12)] bg-[#071c17]/78 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6 ${className}`}>
      {(title || eyebrow) && (
        <div className="mb-4">
          {eyebrow && <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#54f3b3]">{eyebrow}</p>}
          {title && <h2 className="mt-2 text-xl font-extrabold text-[#f2fff8]">{title}</h2>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function SocialCard({ children, selected = false, className = '' }: { children: React.ReactNode; selected?: boolean; className?: string }) {
  return (
    <article className={`min-w-0 overflow-hidden rounded-[22px] border p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-[rgba(115,255,198,0.28)] ${selected ? 'border-[rgba(115,255,198,0.28)] bg-[#103d31]/80' : 'border-[rgba(115,255,198,0.12)] bg-[#071c17]/76'} ${className}`}>
      {children}
    </article>
  );
}

export function QuickActionCard({ title, copy, to }: { title: string; copy: string; to: string }) {
  return (
    <SocialCard>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{copy}</p>
      <Button to={to} variant="secondary" className="mt-4 w-full">Open</Button>
    </SocialCard>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel>
      <p className="text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-2 break-words text-xl font-semibold text-white">{value}</p>
      <p className="mt-2 line-clamp-2 break-words text-sm text-zinc-400">{detail}</p>
    </Panel>
  );
}

export function MetricCard({ label, value, subValue, detail, tone = 'neutral' }: { label: string; value: string; subValue?: string; detail?: string; tone?: 'neutral' | 'emerald' | 'cyan' | 'red' }) {
  const tones = {
    neutral: 'from-[#0a211b] to-[#071c17] border-[rgba(115,255,198,0.12)]',
    emerald: 'from-[#103d31] to-[#071c17] border-[rgba(115,255,198,0.18)]',
    cyan: 'from-[#0e2b24] to-[#071c17] border-[rgba(115,255,198,0.18)]',
    red: 'from-[#3b2525] to-[#071c17] border-[#3b2525]',
  };
  return (
    <div className={`rounded-[18px] border bg-gradient-to-br p-5 shadow-[0_16px_50px_rgba(0,0,0,0.18)] ${tones[tone]}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.26em] text-[#68867b]">{label}</p>
      <p className="mt-3 break-words text-xl font-extrabold text-[#f2fff8]">{value}</p>
      {subValue && <p className="mt-1 break-words text-3xl font-extrabold leading-tight text-[#54f3b3]">{subValue}</p>}
      {detail && <p className="mt-3 line-clamp-2 break-words text-sm font-medium leading-6 text-[#9db9af]">{detail}</p>}
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
    emerald: 'border-[rgba(115,255,198,0.28)] bg-[#103d31] text-[#54f3b3]',
    cyan: 'border-[rgba(115,255,198,0.18)] bg-[#0e2b24] text-[#9ff6d1]',
    zinc: 'border-[rgba(115,255,198,0.12)] bg-[#0a211b] text-[#9db9af]',
    red: 'border-[#3b2525] bg-[#3b2525] text-[#f0b9b9]',
  };
  return <span className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-center text-xs font-bold leading-5 [overflow-wrap:anywhere] ${tones[tone]}`}>{children}</span>;
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
    success: 'border-[rgba(115,255,198,0.28)] bg-[#103d31] text-[#54f3b3]',
    warning: 'border-[#514f22] bg-[#514f22] text-[#f3e98a]',
    danger: 'border-[#3b2525] bg-[#3b2525] text-[#f0b9b9]',
    neutral: 'border-[rgba(115,255,198,0.12)] bg-[#0a211b] text-[#9db9af]',
  };
  return <span className={`inline-flex max-w-full rounded-full border px-3 py-1 text-center text-xs font-bold leading-5 [overflow-wrap:anywhere] ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, copy, actions }: { title: string; copy: string; actions?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-center sm:p-6 lg:rounded-3xl">
      <div className="mx-auto mb-3 h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04]" />
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 break-words text-sm text-zinc-500">{copy}</p>
      {actions && <div className="mt-4 flex flex-wrap justify-center gap-2">{actions}</div>}
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
    { title: 'Community circle loaded', copy: 'Create or load the community used by the remaining flow.', status: statusFor(2), to: '/repuring/circles', tx: 'CreateCircleTx' },
    { title: 'Member ready', copy: 'Join the current community before posting work.', status: statusFor(3), to: '/repuring/circles', tx: 'JoinCircleTx' },
    { title: 'Community workspace', copy: 'Open the joined community to view members, contributions, reviews, leaderboard, and role actions.', status: statusFor(4), to: '/repuring/community' },
    { title: 'Proof-of-work posted', copy: 'Publish a contribution proof into the current community.', status: statusFor(5), to: '/repuring/contributions', tx: 'CreateContributionTx' },
    { title: 'Contribution review ready', copy: 'Select useful work and switch to another member account to endorse it.', status: statusFor(6), to: '/repuring/endorse', tx: 'EndorseContributionTx' },
    { title: 'Reputation visible', copy: 'Peer-endorsed contribution proofs increase profile reputation.', status: statusFor(7), to: '/repuring/leaderboard' },
    { title: 'Role claimed', copy: 'Store a role for this circle based on current profile reputation.', status: statusFor(8), to: '/repuring/admin', tx: 'ClaimRoleTx' },
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
    { label: 'Community circle', ready: Boolean(circle), detail: circle?.name || circleId || 'Create or load a community circle.' },
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
          <p className="text-xs uppercase text-cyan-200/70">Query and transaction RPC</p>
          <p className="mt-1 break-all font-mono text-cyan-100">http://localhost:50002</p>
        </div>
        <div>
          <p className="text-xs uppercase text-cyan-200/70">Admin and keystore RPC</p>
          <p className="mt-1 break-all font-mono text-cyan-100">http://localhost:50003</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase text-zinc-500">Live status</p>
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
    <div className="rounded-2xl border border-red-300/25 bg-gradient-to-br from-red-500/15 to-black/20 p-4 shadow-lg shadow-red-950/20 lg:rounded-3xl lg:p-5">
      {children}
    </div>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder, multiline = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; multiline?: boolean }) {
  const inputClass = 'min-w-0 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm leading-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20 sm:rounded-2xl sm:px-4 sm:py-3';
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

export function Button({ children, onClick, variant = 'primary', to, className = '', disabled = false }: { children: React.ReactNode; onClick?: () => Promise<void> | void; variant?: 'primary' | 'secondary' | 'danger'; to?: string; className?: string; disabled?: boolean }) {
  const variants = {
    primary: 'border-transparent bg-[#54f3b3] text-[#03120f] hover:bg-[#7bf7c6]',
    secondary: 'border-[rgba(115,255,198,0.12)] bg-[#0a211b] text-[#f2fff8] hover:border-[rgba(115,255,198,0.28)] hover:bg-[#103d31]',
    danger: 'border-[#3b2525] bg-[#3b2525] text-[#f0b9b9] hover:bg-[#4a2b2b]',
  };
  const buttonClass = `inline-flex max-w-full items-center justify-center whitespace-normal rounded-[18px] border px-5 py-3 text-center text-sm font-extrabold leading-5 shadow-[0_16px_42px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#54f3b3]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#03120f] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${variants[variant]} ${className}`;
  if (to) return <Link className={buttonClass} to={to}>{children}</Link>;
  return (
    <button type="button" disabled={disabled} aria-disabled={disabled} className={buttonClass} onClick={() => !disabled && void Promise.resolve(onClick?.()).catch((e) => alert(e.message || String(e)))}>
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

export function ActiveWalletBanner({
  currentAddress,
  username,
  circleName,
  isMember,
  hasProfile,
}: {
  currentAddress: string;
  username?: string;
  circleName?: string;
  isMember: boolean;
  hasProfile: boolean;
}) {
  return (
    <Panel className="border-cyan-300/15 bg-cyan-300/[0.045]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase text-cyan-200/80 sm:text-xs">Active wallet / community role</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge tone={currentAddress ? 'cyan' : 'zinc'}>{currentAddress ? shortAddress(currentAddress) : 'No wallet selected'}</Badge>
            <Badge tone={hasProfile ? 'emerald' : 'zinc'}>{hasProfile ? (username || 'Profile active') : 'No profile'}</Badge>
            <Badge tone={isMember ? 'emerald' : 'zinc'}>{isMember ? 'Circle member' : 'Not joined'}</Badge>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
            {currentAddress
              ? 'This wallet signs transactions for ' + (circleName || 'the current circle') + '. Confirm the active wallet before submitting.'
              : 'Select a local account in My Account before submitting RepuRing transactions.'}
          </p>
        </div>
        <Button to="/key-management" variant="secondary" className="w-full md:w-auto">Open My Account</Button>
      </div>
    </Panel>
  );
}

export function ActionGate({
  title,
  copy,
  actions,
  children,
  tone = 'neutral',
}: {
  title: string;
  copy: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  tone?: 'neutral' | 'warning' | 'danger';
}) {
  const toneClass = tone === 'danger'
    ? 'border-red-300/25 bg-red-500/10 text-red-100'
    : tone === 'warning'
      ? 'border-amber-300/25 bg-amber-400/10 text-amber-100'
      : 'border-white/10 bg-black/20 text-zinc-300';
  return (
    <div className={`rounded-2xl border p-3.5 sm:p-4 ${toneClass}`}>
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 break-words text-sm leading-6 opacity-85">{copy}</p>
      {children}
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function ReadinessRule({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div className={`rounded-2xl border p-3.5 text-sm ${checked ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/[0.03] text-zinc-400'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="break-words">{text}</p>
        <StatusPill tone={checked ? 'success' : 'neutral'}>{checked ? 'Ready' : 'Check'}</StatusPill>
      </div>
    </div>
  );
}

export function CommunityContextCard({
  circle,
  circleId,
  currentAddress,
  isMember,
  isCreator = false,
  actions,
}: {
  circle: { circleId?: string; name?: string; description?: string; creatorAddress?: string; members?: string[] } | null;
  circleId: string;
  currentAddress: string;
  isMember: boolean;
  isCreator?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <Panel className="border-cyan-300/15 bg-cyan-300/[0.035]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase text-cyan-200/80 sm:text-xs">Current community context</p>
          <h2 className="mt-1.5 break-words text-base font-semibold text-white sm:text-lg">{circle?.name || 'No community selected'}</h2>
          <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-zinc-400">
            {circle?.description || 'Circle-scoped actions use this selected community. Open or join a community before posting, reviewing, ranking, or claiming a role.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
            <Badge tone="cyan">Onchain community ID: {circle?.circleId || circleId || 'none'}</Badge>
            <Badge tone={isMember ? 'emerald' : 'zinc'}>{isMember ? 'Member' : 'Not joined'}</Badge>
            {isCreator && <Badge>Creator/admin</Badge>}
            <Badge tone="zinc">{circle?.members?.length || 0} member{(circle?.members?.length || 0) === 1 ? '' : 's'}</Badge>
          </div>
          {currentAddress && <p className="mt-2 break-all font-mono text-xs text-zinc-500">Active wallet: {shortAddress(currentAddress)}</p>}
        </div>
        {actions && <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">{actions}</div>}
      </div>
    </Panel>
  );
}

export function CommunityCard({
  circle,
  selected = false,
  status,
  actions,
  children,
}: {
  circle: { circleId: string; name?: string; description?: string; creatorAddress?: string; members?: string[] };
  selected?: boolean;
  status?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <SocialCard selected={selected}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-white">{circle.name || circle.circleId}</h3>
          <p className="mt-1 break-all font-mono text-xs text-zinc-500">{circle.circleId}</p>
        </div>
        {status}
      </div>
      <p className="mt-3 break-words text-sm leading-6 text-zinc-400">{circle.description || 'No description provided.'}</p>
      <div className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
        <div>Members <span className="font-semibold text-zinc-200">{circle.members?.length || 0}</span></div>
        <div>Creator <span className="font-mono text-zinc-300">{shortAddress(circle.creatorAddress || '')}</span></div>
      </div>
      {children}
      {actions && <div className="mt-4 flex flex-wrap items-center gap-2">{actions}</div>}
    </SocialCard>
  );
}

export function LeaderboardRowCard({
  row,
  rank,
  currentAddress,
}: {
  row: { address: string; username?: string; reputation: number; role?: string };
  rank: number;
  currentAddress: string;
}) {
  const isCurrent = cleanHex(row.address) === cleanHex(currentAddress);
  return (
    <SocialCard selected={isCurrent}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] font-mono text-sm text-emerald-200">#{rank}</span>
        <AvatarFallback label={row.username || row.address} />
        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold text-white">{row.username || 'Unnamed'}</p>
          <p className="mt-1 font-mono text-xs text-zinc-500">{shortAddress(row.address)}</p>
          {isCurrent && <p className="mt-1 text-xs text-emerald-200">Current account</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <ReputationBadge value={row.reputation} />
        <Badge tone="cyan">{roleBadge(row.role || roleForReputation(row.reputation))}</Badge>
      </div>
    </SocialCard>
  );
}

export function GeneratedRecordIdBlock({
  value,
  onRegenerate,
  children,
}: {
  value: string;
  onRegenerate: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Onchain record ID</p>
          <p className="mt-1 break-all font-mono text-xs text-zinc-400">{value || 'Generated before submit'}</p>
          <p className="mt-2 text-xs text-zinc-500">This ID is generated for the onchain contribution record.</p>
        </div>
        <Button variant="secondary" onClick={onRegenerate}>Regenerate ID</Button>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function VisibilityNotice({ message }: { message: string }) {
  if (!message) return null;
  const lower = message.toLowerCase();
  const className = lower.includes('not visible') || lower.includes('failed') || lower.includes('could not')
    ? 'border-amber-300/30 bg-amber-300/10 text-amber-100'
    : lower.includes('visible in the feed') || lower.includes('visible under this contribution')
      ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
      : 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100';
  return <div className={`rounded-2xl border p-3.5 text-sm font-medium leading-6 sm:p-4 ${className}`}>{message}</div>;
}

export function PostVisibilityNotice({ message }: { message: string }) {
  return <VisibilityNotice message={message} />;
}

export function ConfirmationPanel({
  eyebrow,
  title,
  copy,
  children,
  actions,
  tone = 'warning',
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
  actions: React.ReactNode;
  tone?: 'warning' | 'danger';
}) {
  const toneClass = tone === 'danger'
    ? 'border-red-300/30 bg-red-500/10'
    : 'border-amber-300/30 bg-amber-300/10';
  return (
    <div className={`rounded-2xl border p-4 lg:rounded-3xl ${toneClass}`}>
      <SectionHeader eyebrow={eyebrow} title={title} copy={copy} />
      <div className="mt-4">{children}</div>
      <div className="mt-4 flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}

export function ContributionCard({
  contribution,
  selected = false,
  actions,
  reviews,
  compact = false,
  statusBadge,
}: {
  contribution: {
    contributionId: string;
    authorAddress: string;
    authorUsername?: string;
    title: string;
    description: string;
    proofUrl?: string;
    category: string;
    endorsementCount: number;
    slashed: boolean;
  };
  selected?: boolean;
  actions?: React.ReactNode;
  reviews?: React.ReactNode;
  compact?: boolean;
  statusBadge?: React.ReactNode;
}) {
  return (
    <SocialCard selected={selected}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <AvatarFallback label={contribution.authorUsername || contribution.authorAddress} />
          <div className="min-w-0">
            <p className="break-words font-semibold text-white">{contribution.authorUsername || shortAddress(contribution.authorAddress)}</p>
            <p className="font-mono text-xs text-zinc-500">{shortAddress(contribution.authorAddress)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryBadge category={contribution.category} />
          {statusBadge}
          <StatusPill tone={contribution.slashed ? 'danger' : 'success'}>{contribution.slashed ? 'Slashed' : 'Active'}</StatusPill>
        </div>
      </div>
      <h3 className={`${compact ? 'mt-4 text-base' : 'mt-5 text-lg'} break-words font-semibold text-white`}>{contribution.title}</h3>
      <p className={`${compact ? 'line-clamp-2' : ''} mt-3 break-words text-sm leading-6 text-zinc-300`}>{contribution.description || 'No description provided.'}</p>
      <div className={`${compact ? 'mt-4' : 'mt-5'} grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm`}>
        <div className="flex min-w-0 flex-wrap justify-between gap-2">
          <span className="text-zinc-500">Proof</span>
          {contribution.proofUrl ? (
            <a className="break-all font-mono text-cyan-200 underline-offset-4 hover:underline" href={contribution.proofUrl} title={contribution.proofUrl} target="_blank" rel="noreferrer">{proofLabel(contribution.proofUrl)}</a>
          ) : (
            <span className="text-zinc-500">No proof URL provided</span>
          )}
        </div>
        <div className="flex min-w-0 flex-wrap justify-between gap-2">
          <span className="text-zinc-500">Endorsements</span>
          <Badge>{contribution.endorsementCount}</Badge>
        </div>
        <div className="flex min-w-0 flex-wrap justify-between gap-2">
          <span className="shrink-0 text-zinc-500">Onchain record ID</span>
          <span className="min-w-0 break-all font-mono text-xs text-zinc-300">{contribution.contributionId}</span>
        </div>
      </div>
      {reviews}
      {actions && <div className="mt-5">{actions}</div>}
    </SocialCard>
  );
}

export function ReviewCard({
  review,
  contributionTitle,
  selected = false,
  actions,
}: {
  review: {
    endorsementId: string;
    fromAddress: string;
    targetAddress: string;
    contributionId?: string;
    tag: string;
    message: string;
    slashed: boolean;
    slashReason?: string;
  };
  contributionTitle?: string;
  selected?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <SocialCard selected={selected}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge tone="cyan">{shortAddress(review.fromAddress)}</Badge>
          <Badge>{review.tag}</Badge>
        </div>
        <StatusPill tone={review.slashed ? 'danger' : 'success'}>{review.slashed ? 'Slashed' : 'Active'}</StatusPill>
      </div>
      {contributionTitle && <p className="mt-3 break-words text-sm font-semibold text-white">{contributionTitle}</p>}
      <p className="mt-3 break-words text-sm leading-6 text-zinc-300">{review.message || 'No review message provided.'}</p>
      {review.slashed && review.slashReason && <p className="mt-3 break-words text-xs leading-5 text-red-200">Slash reason: {review.slashReason}</p>}
      <div className="mt-4 grid gap-2 text-xs text-zinc-500">
        {review.contributionId && <div>Contribution <span className="break-all font-mono text-zinc-300">{review.contributionId}</span></div>}
        <div>Target <span className="font-mono text-zinc-300">{shortAddress(review.targetAddress)}</span></div>
        <details>
          <summary className="cursor-pointer text-zinc-400">Technical metadata</summary>
          <p className="mt-2 break-all font-mono text-zinc-500">{review.endorsementId}</p>
        </details>
      </div>
      {actions && <div className="mt-4">{actions}</div>}
    </SocialCard>
  );
}

export function ContributionReviews({ endorsements, emptyCopy }: { endorsements: Array<{ endorsementId: string; fromAddress: string; tag: string; message: string; slashed: boolean }>; emptyCopy?: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-white">Reviews / comments</p>
          <p className="mt-1 text-xs text-zinc-500">Peer review messages attached to EndorseContributionTx.</p>
        </div>
        <Badge tone="zinc">{endorsements.length} review{endorsements.length === 1 ? '' : 's'}</Badge>
      </div>
      {endorsements.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-500">
          {emptyCopy || 'No reviews yet. Endorse this contribution from another member account.'}
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {endorsements.map((item) => (
            <div key={item.endorsementId} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="cyan">{shortAddress(item.fromAddress)}</Badge>
                  <Badge>{item.tag}</Badge>
                </div>
                <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
              </div>
              <p className="mt-3 break-words text-sm leading-6 text-zinc-300">{item.message || 'No review message provided.'}</p>
              <p className="mt-3 break-all font-mono text-[11px] text-zinc-600">{item.endorsementId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TxStatusCard({ status, lastTx, onRefresh }: { status: string; lastTx: string; onRefresh: () => Promise<void> }) {
  return (
    <Panel className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0" aria-live="polite">
        <p className="text-xs uppercase text-zinc-500">RPC status</p>
        <p className="mt-2 break-words text-sm text-zinc-300">{status}</p>
        <p className="mt-2 break-all font-mono text-xs text-zinc-500">{lastTx || 'No transaction submitted yet'}</p>
      </div>
      <Button variant="secondary" className="self-start md:self-auto" onClick={onRefresh}>Refresh chain state</Button>
    </Panel>
  );
}

function proofLabel(value: string) {
  try {
    const url = new URL(value);
    const path = url.pathname && url.pathname !== '/' ? url.pathname : '';
    const label = `${url.hostname}${path}`;
    return label.length > 48 ? `${label.slice(0, 45)}...` : label;
  } catch {
    return value.length > 48 ? `${value.slice(0, 45)}...` : value;
  }
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

