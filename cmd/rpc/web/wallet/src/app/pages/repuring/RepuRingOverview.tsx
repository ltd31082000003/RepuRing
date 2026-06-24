import React from 'react';
import { AvatarFallback, Badge, Button, DemoReadinessCard, MetricCard, PageHeader, Panel, RepuRingPage, RoleProgressCard, SectionHeader, SocialFiJourney, StatusPill, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

const flow = ['Profile', 'Circle', 'Community', 'Contribution', 'Endorsement', 'Role'];

export default function RepuRingOverview(): JSX.Element {
  const { currentAddress, profile, role, circle, circleId, contributions, selectedContributionId, leaderboard, endorsements, lastTx, status, refreshState } = useRepuRing();
  const derivedRole = role?.role || roleForReputation(profile?.reputation || 0);

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="RepuRing / Social-Fi on Canopy"
        title="Onchain Social-Fi for Web3 contributors."
        copy="Create a contributor identity, join a community circle, post proof-of-work, get peer-reviewed, build reputation, and claim community status on Canopy testnet."
        actions={(
          <>
            <Button to="/repuring/community">Open Community</Button>
            <Button to="/key-management" variant="secondary">Create Profile</Button>
            <Button to="/repuring/circles" variant="secondary">Discover Circles</Button>
          </>
        )}
      />

      <Panel className="border-emerald-300/20 bg-black/30">
        <div className="flex min-w-0 flex-wrap items-center gap-4 sm:flex-nowrap">
          <AvatarFallback label={profile?.username || currentAddress} src={profile?.avatarUrl} />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-zinc-400">Current profile</p>
            <h2 className="truncate text-2xl font-semibold text-white">{profile?.username || 'Profile not created'}</h2>
          </div>
          <div className="shrink-0"><StatusPill tone={profile ? 'success' : 'warning'}>{profile ? 'Active' : 'Needed'}</StatusPill></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Selected wallet" value={shortAddress(currentAddress) || 'No wallet'} detail={currentAddress || 'Open My Account to select a local signing key.'} />
          <MetricCard label="Current community" value={circle?.name || circleId || 'No community'} detail={circle ? `${circle.members?.length || 0} members` : 'Create or open a community circle.'} tone="cyan" />
          <MetricCard label="Global reputation" value={String(profile?.reputation || 0)} detail="Earned from endorsed proof-of-work." tone="emerald" />
          <MetricCard label="Role" value={roleBadge(derivedRole)} detail={role?.claimedRole ? 'Claimed onchain' : 'Claim role from the Admin page.'} />
        </div>
      </Panel>

      <Panel>
        <SectionHeader eyebrow="Core loop" title="Identity to community status" copy="Every MVP screen supports this Social-Fi contribution loop." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {flow.map((step, index) => (
            <div key={step} className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-semibold text-emerald-300">{String(index + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-sm font-semibold text-white">{step}</p>
            </div>
          ))}
        </div>
      </Panel>

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
            ['Circle', 'Web3 contributor community'],
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <QuickAction title="My Account" copy="Create or edit your RepuRing identity." to="/key-management" />
          <QuickAction title="Create or Join Circle" copy="Set up a community circle." to="/repuring/circles" />
          <QuickAction title="Community Workspace" copy="Open the current community." to="/repuring/community" />
          <QuickAction title="Post Work" copy="Publish proof-of-work to the feed." to="/repuring/contributions" />
          <QuickAction title="Review Work" copy="Review and endorse useful proofs." to="/repuring/endorse" />
          <QuickAction title="View Leaderboard" copy="See reputation and role rankings." to="/repuring/leaderboard" />
        </div>
      </Panel>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
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
