import React from 'react';
import { Link } from 'react-router-dom';
import { cleanHex } from './RepuRingProvider';

export function RepuRingPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070b14] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-12%] h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[28%] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>
      <main className="mx-auto max-w-7xl space-y-6 p-4 lg:p-8">{children}</main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, copy, actions }: { eyebrow: string; title: string; copy: string; actions?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-zinc-300">{copy}</p>
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, copy, actions }: { eyebrow?: string; title: string; copy?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-semibold text-white">{title}</h2>
        {copy && <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{copy}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ id, title, eyebrow, className = '', children }: { id?: string; title?: string; eyebrow?: string; className?: string; children: React.ReactNode }) {
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

export function SocialCard({ children, selected = false, className = '' }: { children: React.ReactNode; selected?: boolean; className?: string }) {
  return (
    <article className={`rounded-3xl border p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition ${selected ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-white/[0.04]'} ${className}`}>
      {children}
    </article>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-all text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 line-clamp-2 break-all text-sm text-zinc-400">{detail}</p>
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
      <p className="mt-2 break-all text-2xl font-semibold text-white">{value}</p>
      {detail && <p className="mt-2 line-clamp-2 break-all text-sm text-zinc-400">{detail}</p>}
    </div>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-lg font-semibold text-white">{value}</p>
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
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
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
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-white/10 bg-white/[0.04]" />
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-500">{copy}</p>
    </div>
  );
}

export function DangerPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-red-300/25 bg-gradient-to-br from-red-500/15 to-black/20 p-5 shadow-xl shadow-red-950/20">
      {children}
    </div>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder, multiline = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; multiline?: boolean }) {
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

export function Button({ children, onClick, variant = 'primary', to, className = '' }: { children: React.ReactNode; onClick?: () => Promise<void> | void; variant?: 'primary' | 'secondary' | 'danger'; to?: string; className?: string }) {
  const variants = {
    primary: 'border-emerald-300/30 bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950 hover:shadow-emerald-500/20',
    secondary: 'border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]',
    danger: 'border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25',
  };
  const buttonClass = `inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${variants[variant]} ${className}`;
  if (to) return <Link className={buttonClass} to={to}>{children}</Link>;
  return (
    <button className={buttonClass} onClick={() => void Promise.resolve(onClick?.()).catch((e) => alert(e.message || String(e)))}>
      {children}
    </button>
  );
}

export function AddressList({ values }: { values: string[] }) {
  if (values.length === 0) return <EmptyState title="No members loaded" copy="Circle members will appear after CreateCircleTx or JoinCircleTx is committed." />;
  return (
    <div className="mt-4 grid gap-2">
      {values.map((value) => (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs" key={value}>
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
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4" key={value}>
            <AvatarFallback label={clean} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-zinc-200">{shortAddress(value)}</p>
              <p className="mt-1 font-mono text-xs text-zinc-600">{clean.slice(-12)}</p>
            </div>
            <div className="flex flex-col gap-1">
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
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">RPC status</p>
        <p className="mt-2 text-sm text-zinc-300">{status}</p>
        <p className="mt-2 break-all font-mono text-xs text-zinc-500">{lastTx || 'No transaction submitted yet'}</p>
      </div>
      <Button variant="secondary" onClick={onRefresh}>Refresh chain state</Button>
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
  const role = roleName || 'Newbie';
  const icon = role === 'Circle Leader' ? 'Leader' : role === 'Core Member' ? 'Core' : role === 'Trusted' ? 'Trusted' : 'Newbie';
  return `${icon} · ${role}`;
}

export function shortAddress(value: string) {
  const clean = cleanHex(value);
  if (!clean) return '';
  return clean.length <= 14 ? clean : `${clean.slice(0, 6)}...${clean.slice(-6)}`;
}

export function rpcTone(status: string): 'success' | 'warning' | 'danger' {
  const lower = status.toLowerCase();
  if (lower.includes('failed') || lower.includes('offline')) return 'danger';
  if (lower.includes('submitting') || lower.includes('waiting')) return 'warning';
  return 'success';
}
