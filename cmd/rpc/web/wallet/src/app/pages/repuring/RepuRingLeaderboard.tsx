import React from 'react';
import { ActiveWalletBanner, AvatarFallback, Badge, Button, CommunityContextCard, EmptyState, LeaderboardRowCard, MetricCard, PageHeader, Panel, ReputationBadge, RepuRingPage, RoleProgressCard, SectionHeader, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { useRepuRing } from './useRepuRing';

export default function RepuRingLeaderboard(): JSX.Element {
  const { currentAddress, profile, circleId, leaderboard, circle, status, lastTx, refreshState } = useRepuRing();
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const currentRank = leaderboard.findIndex((row) => cleanHex(row.address) === cleanHex(currentAddress)) + 1;
  const topReputation = leaderboard[0]?.reputation || 0;
  const podium = leaderboard.slice(0, 3);

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Reputation rankings"
        title="Reputation leaderboard"
        copy="See contributors ranked by global profile reputation in the selected community context."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh rankings</Button>}
      />

      <ActiveWalletBanner
        currentAddress={currentAddress}
        username={profile?.username}
        circleName={circle?.name}
        isMember={isMember}
        hasProfile={Boolean(profile)}
      />

      <CommunityContextCard
        circle={circle}
        circleId={circleId}
        currentAddress={currentAddress}
        isMember={isMember}
        actions={<Button to="/repuring/circles" variant="secondary">Change community</Button>}
      />

      <Panel className="border-cyan-300/20 bg-cyan-300/[0.055]">
        <SectionHeader
          eyebrow="Global reputation notice"
          title="Leaderboard scope"
          copy="MVP leaderboard uses global profile reputation displayed in the selected community context. Circle-specific reputation is planned for a later version."
        />
      </Panel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Ranked members" value={String(leaderboard.length)} detail="Rows returned for the selected circle leaderboard." tone="emerald" />
        <MetricCard label="Selected community" value={circle?.name || circleId || 'None'} detail={circle?.description || 'Load a community circle.'} tone="cyan" />
        <MetricCard label="Your rank" value={currentRank > 0 ? `#${currentRank}` : 'Unranked'} detail={currentAddress ? shortAddress(currentAddress) : 'No account selected.'} />
        <MetricCard label="Top reputation" value={String(topReputation)} detail="Highest profile reputation currently visible." />
      </section>

      <RoleProgressCard reputation={profile?.reputation || 0} />

      <Panel>
        <SectionHeader
          eyebrow="How rankings work"
          title="How reputation reaches the leaderboard"
          copy="The selected community leaderboard ranks loaded members using current global profile reputation earned from endorsed contribution proofs."
        />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.07] p-4">
            <p className="font-semibold text-white">1. Earn reputation</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Another community member endorses an active contribution proof through EndorseContributionTx.</p>
          </div>
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-4">
            <p className="font-semibold text-white">2. Enter the ranking</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">The score is profile-level and displayed in the selected circle context.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="font-semibold text-white">3. Show role status</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">Role labels may be derived from reputation or stored after ClaimRoleTx, depending on the loaded state.</p>
          </div>
        </div>
      </Panel>
      {podium.length >= 3 && (
        <Panel>
          <SectionHeader eyebrow="Top contributors" title="Podium" copy="A quick demo-friendly view of the top three contributors." />
          <div className="grid gap-4 md:grid-cols-3">
            {podium.map((row, index) => (
              <div key={row.address} className={`rounded-3xl border p-5 text-center ${index === 0 ? 'border-emerald-300/30 bg-emerald-300/10' : 'border-white/10 bg-black/25'}`}>
                <div className="mx-auto w-fit"><AvatarFallback label={row.username || row.address} /></div>
                <p className="mt-4 text-sm text-zinc-500">Rank #{index + 1}</p>
                <h3 className="mt-1 break-words text-lg font-semibold text-white">{row.username || 'Unnamed'}</h3>
                <p className="mt-2 font-mono text-xs text-zinc-500">{shortAddress(row.address)}</p>
                <div className="mt-4 flex justify-center"><ReputationBadge value={row.reputation} /></div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel>
        <SectionHeader
          eyebrow="Ranked by reputation"
          title="Main leaderboard"
          copy="Rows show profile reputation and role status in the selected circle context; the selected wallet is highlighted."
          actions={<><Button to="/repuring/contributions" variant="secondary">Post proof-of-work</Button><Button to="/repuring/endorse">Review work</Button></>}
        />
        {leaderboard.length === 0 ? (
          <EmptyState
            title="No reputation yet"
            copy="Reputation appears after another circle member endorses a contribution proof. Post work or review a contribution to activate this ranking."
            actions={<><Button to="/repuring/contributions" variant="secondary">Post proof-of-work</Button><Button to="/repuring/endorse">Review work</Button></>}
          />
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {leaderboard.map((row, index) => (
                <LeaderboardRowCard key={row.address} row={row} rank={index + 1} currentAddress={currentAddress} />
              ))}
            </div>
            <div className="hidden rounded-3xl border border-white/10 md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Contributor</th>
                    <th className="px-4 py-3">Reputation</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, index) => {
                    const isCurrent = cleanHex(row.address) === cleanHex(currentAddress);
                    return (
                      <tr key={row.address} className={`border-t border-white/10 ${isCurrent ? 'bg-emerald-300/10' : 'bg-black/10'}`}>
                        <td className="px-4 py-4 font-mono text-zinc-400">#{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <AvatarFallback label={row.username || row.address} />
                            <div>
                              <p className="font-semibold text-white">{row.username || 'Unnamed'}</p>
                              {isCurrent && <p className="text-xs text-emerald-200">Current account</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4"><ReputationBadge value={row.reputation} /></td>
                        <td className="px-4 py-4"><Badge tone="cyan">{roleBadge(row.role || roleForReputation(row.reputation))}</Badge></td>
                        <td className="px-4 py-4 font-mono text-xs text-zinc-500">{shortAddress(row.address)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
