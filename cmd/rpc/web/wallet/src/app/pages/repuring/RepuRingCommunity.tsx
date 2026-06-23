import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveWalletBanner, AvatarFallback, Badge, Button, CategoryBadge, EmptyState, MemberList, MetricCard, PageHeader, Panel, ReputationBadge, RepuRingPage, RoleProgressCard, SectionHeader, SocialCard, StatusPill, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { CircleView, ContributionView, useRepuRing } from './useRepuRing';

type CommunityStatus = 'Creator' | 'Joined' | 'Not joined' | 'No profile' | 'No wallet selected';

export default function RepuRingCommunity(): JSX.Element {
  const {
    currentAddress,
    profile,
    circleId,
    circle,
    circles,
    contributions,
    endorsements,
    leaderboard,
    role,
    status,
    lastTx,
    refreshState,
    selectedContributionId,
    setSelectedContributionId,
  } = useRepuRing();
  const navigate = useNavigate();
  const community = circle?.circleId === circleId ? circle : circles.find((item) => item.circleId === circleId) || null;
  const memberCount = community?.members?.length || 0;
  const isMember = isCircleMember(community, currentAddress);
  const isCreator = Boolean(currentAddress && community?.creatorAddress && cleanHex(currentAddress) === cleanHex(community.creatorAddress));
  const walletStatus = communityStatus(community, currentAddress, Boolean(profile));
  const derivedRole = role?.role || roleForReputation(profile?.reputation || 0);
  const topRows = leaderboard.slice(0, 5);
  const communityContributionIds = new Set(contributions.map((item) => item.contributionId));
  const scopedReviews = community
    ? endorsements.filter((item) => {
      if (!item.contributionId) return false;
      if (item.circleId && item.circleId !== community.circleId) return false;
      if (communityContributionIds.size > 0 && !communityContributionIds.has(item.contributionId)) return false;
      return true;
    })
    : [];
  const communityReviews = scopedReviews.slice(0, 8);
  const recentContributions = contributions.slice(0, 6);

  function reviewContribution(contributionId: string) {
    setSelectedContributionId(contributionId);
    navigate('/repuring/endorse');
  }

  function contributionEmptyAction() {
    if (!currentAddress) return <Button to="/key-management" variant="secondary">Select wallet</Button>;
    if (!profile) return <Button to="/key-management" variant="secondary">Create profile</Button>;
    if (!isMember) return <Button to="/repuring/circles" variant="secondary">Join community</Button>;
    return <Button to="/repuring/contributions">Post first contribution</Button>;
  }

  function contributionReviewAction(item: ContributionView, selected: boolean) {
    const ownWork = Boolean(currentAddress && cleanHex(item.authorAddress) === cleanHex(currentAddress));
    if (!isMember) return <Button to="/repuring/circles" variant="secondary">Join to review</Button>;
    if (ownWork) return <p className="text-sm font-medium text-zinc-400">Own work - switch wallet to review</p>;
    if (item.slashed) return <p className="text-sm font-medium text-zinc-400">Review disabled</p>;
    return <Button variant={selected ? 'primary' : 'secondary'} onClick={() => reviewContribution(item.contributionId)}>Review this work</Button>;
  }

  function reviewCardAction(contributionId: string) {
    const linkedContribution = contributions.find((item) => item.contributionId === contributionId);
    const ownWork = Boolean(currentAddress && linkedContribution?.authorAddress && cleanHex(linkedContribution.authorAddress) === cleanHex(currentAddress));
    if (!isMember) return <Button to="/repuring/circles" variant="secondary">Join to review</Button>;
    if (ownWork) return <p className="text-sm font-medium text-zinc-400">Own work - switch wallet to review</p>;
    return (
      <Button variant={contributionId === selectedContributionId ? 'primary' : 'secondary'} onClick={() => reviewContribution(contributionId)}>
        Review this work
      </Button>
    );
  }

  function roleActions() {
    if (!currentAddress) {
      return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm leading-6 text-zinc-300">Select a wallet before joining or claiming a role.</p>
          <div className="mt-4"><Button to="/key-management" variant="secondary">Select wallet</Button></div>
        </div>
      );
    }
    if (!profile) {
      return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm leading-6 text-zinc-300">Create a profile before joining or claiming a role.</p>
          <div className="mt-4"><Button to="/key-management" variant="secondary">Create profile</Button></div>
        </div>
      );
    }
    if (!isMember) {
      return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm leading-6 text-zinc-300">Join this community before claiming a role.</p>
          <div className="mt-4"><Button to="/repuring/circles" variant="secondary">Join this community</Button></div>
        </div>
      );
    }
    return (
      <>
        <RoleProgressCard reputation={profile.reputation || 0} embedded />
        <div className="flex flex-wrap gap-3">
          <Button to="/repuring/admin">Claim role</Button>
          {isCreator && <Button to="/repuring/admin" variant="secondary">Open moderation</Button>}
        </div>
      </>
    );
  }

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Community Workspace"
        title={community?.name || 'Project community workspace'}
        copy={community?.description || 'Open or join a project community to view members, contribution proofs, reviews, leaderboard, and role actions.'}
        actions={(
          <>
            <Button variant="secondary" onClick={refreshState}>Refresh community</Button>
            {!currentAddress && <Button to="/key-management" variant="secondary">Select wallet</Button>}
            {currentAddress && !profile && <Button to="/key-management" variant="secondary">Create profile</Button>}
            {currentAddress && profile && community && !isMember && <Button to="/repuring/circles" variant="secondary">Join community</Button>}
            {isMember && <Button to="/repuring/contributions" variant="secondary">Post contribution</Button>}
            {isMember && <Button to="/repuring/endorse" variant="secondary">Review work</Button>}
            {isCreator && <Button to="/repuring/admin" variant="secondary">Open moderation</Button>}
            <Button to="/repuring/leaderboard">View leaderboard</Button>
          </>
        )}
      />

      <ActiveWalletBanner
        currentAddress={currentAddress}
        username={profile?.username}
        circleName={community?.name}
        isMember={isMember}
        hasProfile={Boolean(profile)}
      />

      {!community ? (
        <Panel>
          <EmptyState
            title={circleId ? 'Selected community not found' : 'No community selected'}
            copy="Open a project community from Discover Circles to load its workspace."
            actions={<Button to="/repuring/circles" variant="secondary">Discover Circles</Button>}
          />
        </Panel>
      ) : (
        <>
          <Panel>
            <SectionHeader
              eyebrow="Community identity"
              title={community.name || community.circleId}
              copy="This workspace uses the current circle context shared by contributions, reviews, leaderboard, and role actions."
              actions={<StatusPill tone={statusTone(walletStatus)}>{walletStatus}</StatusPill>}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="Circle ID" value={community.circleId} detail="Current project community key." tone="cyan" />
              <MetricCard label="Creator" value={shortAddress(community.creatorAddress) || 'Unknown'} detail={community.creatorAddress || 'Creator address not loaded.'} />
              <MetricCard label="Members" value={String(memberCount)} detail="Joined contributor profiles." tone="emerald" />
              <MetricCard label="Contributions" value={String(contributions.length)} detail="Proof-of-work posts in this community." />
              <MetricCard label="Reviews" value={String(scopedReviews.length)} detail="Peer review comments loaded for this context." />
            </div>
          </Panel>

          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <Panel>
                <SectionHeader
                  eyebrow="Current member"
                  title={profile?.username || shortAddress(currentAddress) || 'Wallet not selected'}
                  copy="Your current wallet status for this project community."
                  actions={<StatusPill tone={statusTone(walletStatus)}>{walletStatus}</StatusPill>}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard label="Wallet" value={shortAddress(currentAddress) || 'No wallet'} detail={currentAddress || 'Select a wallet in My Account.'} />
                  <MetricCard label="Username" value={profile?.username || 'No profile'} detail={profile ? 'Contributor profile active.' : 'Create a profile before joining or posting.'} />
                  <MetricCard label="Reputation" value={String(profile?.reputation || 0)} detail="Profile reputation from endorsed work." tone="emerald" />
                  <MetricCard label="Role" value={roleBadge(derivedRole)} detail={role?.claimedRole ? 'Claimed onchain for this circle.' : isMember ? 'Claimable from role actions.' : 'Join before claiming a role.'} tone="cyan" />
                </div>
                {!currentAddress && <Button to="/key-management" variant="secondary">Select wallet</Button>}
                {currentAddress && !profile && <Button to="/key-management" variant="secondary">Create profile</Button>}
                {currentAddress && profile && !isMember && <Button to="/repuring/circles">Join from Discover Circles</Button>}
              </Panel>

              <Panel>
                <SectionHeader eyebrow="Members" title="Community members" copy="Current wallet and creator badges are marked in the member graph." />
                <MemberList values={community.members || []} currentAddress={currentAddress} creatorAddress={community.creatorAddress} />
              </Panel>

              <Panel>
                <SectionHeader
                  eyebrow="Role actions"
                  title="Role and moderation"
                  copy="Joined members can claim role status. Circle creators can moderate contribution endorsements."
                />
                {roleActions()}
              </Panel>
            </div>

            <div className="space-y-5">
              <Panel>
                <SectionHeader
                  eyebrow="Contributions"
                  title="Proof-of-work in this community"
                  copy="Recent contribution proofs posted by joined members."
                  actions={<Button to="/repuring/contributions" variant="secondary">Open feed</Button>}
                />
                {recentContributions.length === 0 ? (
                  <EmptyState
                    title="No contribution proofs yet"
                    copy="Joined members can post the first proof-of-work for this project community."
                    actions={contributionEmptyAction()}
                  />
                ) : (
                  <div className="grid gap-4">
                    {recentContributions.map((item) => {
                      const reviewCount = scopedReviews.filter((endorsement) => endorsement.contributionId === item.contributionId).length;
                      const selected = item.contributionId === selectedContributionId;
                      return (
                        <SocialCard key={item.contributionId} selected={selected}>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 gap-3">
                              <AvatarFallback label={item.authorUsername || item.authorAddress} />
                              <div className="min-w-0">
                                <h3 className="break-words text-lg font-semibold text-white">{item.title || item.contributionId}</h3>
                                <p className="mt-1 font-mono text-xs text-zinc-500">{item.authorUsername || shortAddress(item.authorAddress)}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <CategoryBadge category={item.category} />
                              <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                            </div>
                          </div>
                          <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-zinc-300">{item.description || 'No description provided.'}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge tone="zinc">{item.endorsementCount} endorsement{item.endorsementCount === 1 ? '' : 's'}</Badge>
                            <Badge tone="zinc">{reviewCount} review{reviewCount === 1 ? '' : 's'}</Badge>
                          </div>
                          <div className="mt-4">
                            {contributionReviewAction(item, selected)}
                          </div>
                        </SocialCard>
                      );
                    })}
                  </div>
                )}
              </Panel>

              <Panel>
                <SectionHeader eyebrow="Community reviews" title="Peer reviews and comments" copy="Review messages attached to EndorseContributionTx records in this circle." />
                {communityReviews.length === 0 ? (
                  <EmptyState title="No peer reviews yet" copy="Peer review comments will appear after members endorse contribution proofs." />
                ) : (
                  <div className="grid gap-3">
                    {communityReviews.map((item) => (
                      <SocialCard key={item.endorsementId}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge tone="cyan">{shortAddress(item.fromAddress)}</Badge>
                            <Badge>{item.tag}</Badge>
                          </div>
                          <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                        </div>
                        <p className="mt-3 break-words text-sm leading-6 text-zinc-300">{item.message || 'No review message provided.'}</p>
                        <p className="mt-3 break-all font-mono text-xs text-zinc-500">Contribution {item.contributionId}</p>
                        <div className="mt-4">
                          {reviewCardAction(item.contributionId)}
                        </div>
                      </SocialCard>
                    ))}
                  </div>
                )}
              </Panel>

              <Panel>
                <SectionHeader
                  eyebrow="Leaderboard"
                  title="Top community reputation"
                  copy="Top contributors by reputation in the current circle context."
                  actions={<Button to="/repuring/leaderboard" variant="secondary">View leaderboard</Button>}
                />
                {topRows.length === 0 ? (
                  <EmptyState title="No leaderboard rows yet" copy="Leaderboard entries appear after profiles and endorsed contribution proofs are loaded." />
                ) : (
                  <div className="grid gap-3">
                    {topRows.map((row, index) => (
                      <div key={row.address || String(index)} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-bold text-emerald-200">{index + 1}</span>
                        <AvatarFallback label={row.username || row.address} />
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-semibold text-white">{row.username || shortAddress(row.address)}</p>
                          <p className="font-mono text-xs text-zinc-500">{shortAddress(row.address)}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap justify-end gap-2">
                          <ReputationBadge value={row.reputation || 0} />
                          <Badge tone="cyan">{roleBadge(row.role)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </section>
        </>
      )}

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}

function isCircleMember(circle: CircleView | null, currentAddress: string) {
  return Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
}

function communityStatus(circle: CircleView | null, currentAddress: string, hasProfile: boolean): CommunityStatus {
  if (!currentAddress) return 'No wallet selected';
  if (!hasProfile) return 'No profile';
  if (circle?.creatorAddress && cleanHex(circle.creatorAddress) === cleanHex(currentAddress)) return 'Creator';
  if (isCircleMember(circle, currentAddress)) return 'Joined';
  return 'Not joined';
}

function statusTone(status: CommunityStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'Creator' || status === 'Joined') return 'success';
  if (status === 'No wallet selected' || status === 'No profile') return 'warning';
  return 'neutral';
}
