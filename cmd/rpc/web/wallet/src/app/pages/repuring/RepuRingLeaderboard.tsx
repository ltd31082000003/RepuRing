import React from 'react';
import { Badge, EmptyState, Input, PageHeader, Panel, RepuRingPage, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

export default function RepuRingLeaderboard(): JSX.Element {
  const { circleId, setCircleId, leaderboard, circle, status, lastTx, refreshState } = useRepuRing();

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Leaderboard"
        title="Reputation rankings for your onchain circle."
        copy="The leaderboard turns endorsements into visible Social-Fi status: reputation points, role tiers, and ranked community standing."
      />

      <Panel className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="canopy-builders" />
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Loaded circle</p>
          <p className="mt-2 text-xl font-semibold text-white">{circle?.name || 'Circle not loaded'}</p>
          <p className="mt-1 text-sm text-zinc-400">{circle ? `${circle.members?.length || 0} members` : 'Create or select a circle, then refresh.'}</p>
        </div>
      </Panel>

      <Panel title="Circle Leaderboard" eyebrow="Ranked by reputation">
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
                <tr><td className="px-4 py-10" colSpan={5}><EmptyState title="No leaderboard data yet" copy="Create profiles, create or join a circle, endorse another member, then refresh committed chain state." /></td></tr>
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

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
