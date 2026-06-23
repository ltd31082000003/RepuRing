import React from 'react';
import { AvatarFallback, Badge, Button, DemoReadinessCard, MetricCard, Panel, RepuRingPage, RoleProgressCard, SectionHeader, SocialFiJourney, StatusPill, roleBadge, roleForReputation, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

const flow = ['Profile', 'Circle', 'Contribution', 'Endorsement', 'Reputation', 'Role'];

export default function RepuRingOverview(): JSX.Element {
  const { currentAddress, profile, role, circle, circleId, contributions, selectedContributionId, leaderboard, endorsements, lastTx, status, refreshState } = useRepuRing();
  const derivedRole = role?.role || roleForReputation(profile?.reputation || 0);

  return (
    <RepuRingPage>
      <section className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-transparent to-cyan-400/10" />
        <div className="relative grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge>Social-Fi</Badge>
              <Badge tone="cyan">Contribution network</Badge>
              <Badge tone="zinc">Canopy RPC 50002/50003</Badge>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">RepuRing</p>
              <h1 className="mt-4 max-w-4xl break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-6xl">
                Onchain Social-Fi for Web3 project contributors.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                Create an onchain contributor identity, join a project circle, post proof-of-work, earn peer endorsements, and claim a role from profile reputation.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
              {flow.map((step, index) => (
                <div key={step} className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-semibold text-emerald-300">{String(index + 1).padStart(2, '0')}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <Panel className="border-emerald-300/20 bg-black/30">
            <div className="flex min-w-0 flex-wrap items-center gap-4 sm:flex-nowrap">
              <AvatarFallback label={profile?.username || currentAddress} src={profile?.avatarUrl} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-400">Current profile</p>
                <h2 className="truncate text-2xl font-semibold text-white">{profile?.username || 'Profile not created'}</h2>
              </div>
              <div className="shrink-0"><StatusPill tone={profile ? 'success' : 'warning'}>{profile ? 'Active' : 'Needed'}</StatusPill></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Selected wallet" value={shortAddress(currentAddress) || 'No wallet'} detail={currentAddress || 'Open My Account to select a local signing key.'} />
              <MetricCard label="Current circle" value={circle?.name || circleId || 'No circle'} detail={circle ? `${circle.members?.length || 0} members` : 'Create or load a project community.'} tone="cyan" />
              <MetricCard label="Reputation" value={String(profile?.reputation || 0)} detail="Earned from endorsed contribution proofs." tone="emerald" />
              <MetricCard label="Role" value={roleBadge(derivedRole)} detail={role?.claimedRole ? 'Claimed onchain' : 'Claim role from the Admin page.'} />
            </div>
          </Panel>
        </div>
      </section>

      <DemoReadinessCard
        currentAddress={currentAddress}
        profile={profile}
        circle={circle}
        circleId={circleId}
        contributions={contributions}
        endorsements={endorsements}
        status={status}
        lastTx={lastTx}
        onRefresh={refreshState}
      />

      <RoleProgressCard reputation={profile?.reputation || 0} />
      <Panel>
        <SectionHeader
          eyebrow="How RepuRing works"
          title="Six onchain Social-Fi building blocks"
          copy="Profiles, circles, contribution proofs, endorsements, reputation, and roles are queried from real RepuRing plugin state."
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {[
            ['Profile', 'Onchain contributor identity'],
            ['Circle', 'Web3 project community'],
            ['Contribution', 'Proof-of-work post'],
            ['Endorsement', 'Peer validation'],
            ['Reputation', 'Earned from endorsed work'],
            ['Role', 'Circle status from reputation'],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-400">{copy}</p>
            </div>
          ))}
        </div>
      </Panel>

      <SocialFiJourney
        currentAddress={currentAddress}
        profile={profile}
        circle={circle}
        contributions={contributions}
        selectedContributionId={selectedContributionId}
        leaderboard={leaderboard}
        role={role}
        endorsements={endorsements}
      />

      <Panel>
        <SectionHeader
          eyebrow="Quick actions"
          title="Follow the contribution flow"
          copy="Move from identity to contribution proof, peer validation, reputation, and role without leaving the real Canopy RPC path."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <QuickAction title="My Account" copy="Create or edit your RepuRing identity." to="/key-management" />
          <QuickAction title="Create or Join Circle" copy="Set up a project community." to="/repuring/circles" />
          <QuickAction title="Post Contribution" copy="Publish proof-of-work to the feed." to="/repuring/contributions" />
          <QuickAction title="Endorse Work" copy="Review and endorse useful proofs." to="/repuring/endorse" />
          <QuickAction title="View Leaderboard" copy="See reputation and role rankings." to="/repuring/leaderboard" />
        </div>
      </Panel>

    </RepuRingPage>
  );
}

function QuickAction({ title, copy, to }: { title: string; copy: string; to: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{copy}</p>
      <Button to={to} variant="secondary" className="mt-4 w-full">Open</Button>
    </div>
  );
}
