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

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Panel>
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 break-all text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 line-clamp-2 break-all text-sm text-zinc-400">{detail}</p>
    </Panel>
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

export function Badge({ children, tone = 'emerald' }: { children: React.ReactNode; tone?: 'emerald' | 'cyan' | 'zinc' | 'red' }) {
  const tones = {
    emerald: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
    cyan: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-200',
    zinc: 'border-white/10 bg-white/5 text-zinc-300',
    red: 'border-red-300/30 bg-red-400/10 text-red-200',
  };
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
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
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-500">{copy}</p>
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

export function Button({ children, onClick, variant = 'primary', to }: { children: React.ReactNode; onClick?: () => Promise<void> | void; variant?: 'primary' | 'secondary' | 'danger'; to?: string }) {
  const variants = {
    primary: 'border-emerald-300/30 bg-gradient-to-r from-emerald-300 to-cyan-300 text-slate-950 hover:shadow-emerald-500/20',
    secondary: 'border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]',
    danger: 'border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/25',
  };
  const className = `inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${variants[variant]}`;
  if (to) return <Link className={className} to={to}>{children}</Link>;
  return (
    <button className={className} onClick={() => void Promise.resolve(onClick?.()).catch((e) => alert(e.message || String(e)))}>
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
  const icon = role === 'Circle Leader' ? '👑' : role === 'Core Member' ? '🛠' : role === 'Trusted' ? '🔰' : '🌱';
  return `${icon} ${role}`;
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
