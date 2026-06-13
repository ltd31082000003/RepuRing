import React from 'react';
import { Badge, Button, Metric, Panel, RepuRingPage, StatCard, StatusPill, TxStatusCard, roleBadge, roleForReputation, rpcTone, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

export default function RepuRingOverview(): JSX.Element {
  const { currentAddress, profile, role, circle, circleForm, lastTx, status, refreshState } = useRepuRing();
  const profileRole = role?.role || roleForReputation(profile?.reputation || 0);
  const tone = rpcTone(status);

  return (
    <RepuRingPage>
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
                Create a Web3 project community, post contribution proofs, endorse useful work, and build onchain reputation. Every action is a signed custom transaction submitted to the local Canopy chain, then read back from committed RPC state.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['01', 'Create profile', 'Register your builder identity onchain.'],
                ['02', 'Join project', 'Enter a Web3 community circle.'],
                ['03', 'Post proof', 'Publish contribution evidence.'],
                ['04', 'Earn role', 'Unlock status from endorsed work.'],
              ].map(([step, title, copy]) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-semibold text-emerald-300">{step}</div>
                  <div className="mt-2 font-semibold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-zinc-400">{copy}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/repuring/circles">Create profile / Circles</Button>
              <Button to="/repuring/contributions" variant="secondary">Post contribution</Button>
              <Button to="/repuring/endorse" variant="secondary">Endorse</Button>
              <Button to="/repuring/leaderboard" variant="secondary">Leaderboard</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-300/20 bg-black/30 p-5 shadow-xl shadow-emerald-950/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Live demo circle</p>
                <h2 className="text-2xl font-semibold text-white">{circle?.name || circleForm.name}</h2>
              </div>
              <StatusPill tone={tone}>{tone === 'danger' ? 'RPC issue' : tone === 'warning' ? 'Submitting' : 'RPC ready'}</StatusPill>
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

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
        <StatCard label="Current account" value={shortAddress(currentAddress) || 'No account'} detail={currentAddress || 'Select a signing key before submitting transactions.'} />
        <StatCard label="Profile" value={profile?.username || 'Not created'} detail={profile?.bio || 'CreateProfileTx initializes your reputation at 0.'} />
        <StatCard label="Reputation score" value={String(profile?.reputation || 0)} detail="Earned when members endorse useful contribution proofs." />
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
            <Metric label="RPC status" value={tone === 'danger' ? 'Issue' : 'Live'} />
          </div>
        </Panel>
      </section>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
