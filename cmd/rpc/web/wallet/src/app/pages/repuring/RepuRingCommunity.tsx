import React from 'react';
import { CheckCircle2, Lock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, EmptyState, Input, RepuRingPage, StatusPill, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { CircleView, ContributionView, EndorsementView, useRepuRing } from './useRepuRing';

type CommunityStatus = 'Creator/admin' | 'Member' | 'Not joined' | 'No profile' | 'No wallet selected';
type NextAction = { label: string; to: string; variant?: 'primary' | 'secondary' };
const QUICK_ENDORSE_MESSAGE = 'Endorsed from community activity.';
const LOCAL_REVIEWED_PREFIX = 'repuring.community.reviewed.v1';
const POST_CATEGORIES = ['builder', 'helper', 'creator', 'researcher', 'tester', 'educator'];

export default function RepuRingCommunity(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    profile,
    circleId,
    circle,
    circles,
    contributions,
    endorsements,
    role,
    contributionForm,
    setContributionForm,
    endorse,
    setEndorse,
    status,
    lastTx,
    submittingKind,
    refreshState,
    submit,
    selectedContributionId,
    setSelectedContributionId,
  } = useRepuRing();
  const [contextNotice, setContextNotice] = React.useState('');
  const [reviewContributionId, setReviewContributionId] = React.useState('');
  const [reviewNotice, setReviewNotice] = React.useState('');
  const [postModalOpen, setPostModalOpen] = React.useState(false);
  const [postNotice, setPostNotice] = React.useState('');
  const [localEndorsed, setLocalEndorsed] = React.useState<Record<string, boolean>>({});
  const [localReviewed, setLocalReviewed] = React.useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const community = circle?.circleId === circleId ? circle : circles.find((item) => item.circleId === circleId) || null;
  const isCreator = Boolean(currentAddress && community?.creatorAddress && cleanHex(currentAddress) === cleanHex(community.creatorAddress));
  const isMember = isCircleMember(community, currentAddress);
  const walletStatus = communityStatus(community, currentAddress, Boolean(profile));
  const scopedContributions = community ? contributions.filter((item) => !item.circleId || item.circleId === community.circleId).slice(0, 10) : [];
  const contributionIds = new Set(scopedContributions.map((item) => item.contributionId));
  const scopedReviews = community
    ? endorsements.filter((item) => {
      if (item.circleId && item.circleId !== community.circleId) return false;
      if (item.contributionId && contributionIds.size > 0) return contributionIds.has(item.contributionId);
      return Boolean(item.contributionId);
    })
    : [];
  const currentRole = role?.role || roleForReputation(profile?.reputation || 0);
  const nextRole = nextRoleForReputation(profile?.reputation || 0);
  const primaryAction = nextActionForState(walletStatus, community?.circleId);
  const joinTarget = joinCommunityTarget(community?.circleId);
  const reviewContribution = scopedContributions.find((item) => item.contributionId === reviewContributionId) || null;
  const postDisabled = Boolean(submittingKind) || !currentAddress || !profile || !community || !isMember || !password || !contributionForm.title.trim();
  const postHelp = !currentAddress
    ? 'Select a wallet in My Account.'
    : !profile
      ? 'Create your profile before posting proof-of-work.'
      : !community
        ? 'Open or join a community before posting proof-of-work.'
        : !isMember
          ? 'Join the current community before posting.'
          : !password
            ? 'Enter the selected wallet password to post.'
            : !contributionForm.title.trim()
              ? 'Enter a title for this proof-of-work.'
              : 'Ready to post proof-of-work.';

  function openJoinCommunity() {
    navigate(joinTarget);
  }

  React.useEffect(() => {
    setLocalReviewed(readLocalReviewed(currentAddress));
  }, [currentAddress]);

  React.useEffect(() => {
    if (!postModalOpen || !community?.circleId || !contributionForm.title.trim() || contributionForm.contributionId.trim()) return;
    setContributionForm({
      ...contributionForm,
      contributionId: generateContributionId(community.circleId, contributionForm.title),
    });
  }, [postModalOpen, community?.circleId, contributionForm, setContributionForm]);

  async function endorseContribution(contributionId: string) {
    setSelectedContributionId(contributionId);
    setReviewNotice('');
    const result = await submit('endorseContribution', {
      contributionId,
      tag: endorse.tag || 'builder',
      message: QUICK_ENDORSE_MESSAGE,
    });
    if (result.ok) {
      setLocalEndorsed((current) => ({ ...current, [contributionId]: true }));
      setContextNotice('Endorsement submitted. This contribution is marked as endorsed while community data refreshes.');
      void refreshState();
    } else {
      setContextNotice(result.error || 'Could not endorse this proof-of-work. Check your wallet password and community status, then try again.');
    }
  }

  async function submitReview() {
    if (!reviewContribution) return;
    if (!endorse.tag.trim()) {
      setReviewNotice('Choose a review tag before submitting.');
      return;
    }
    if (!endorse.message.trim()) {
      setReviewNotice('Write a review message before submitting.');
      return;
    }
    setSelectedContributionId(reviewContribution.contributionId);
    setReviewNotice('');
    const result = await submit('endorseContribution', {
      contributionId: reviewContribution.contributionId,
      tag: endorse.tag,
      message: endorse.message,
    });
    if (result.ok) {
      setLocalEndorsed((current) => ({ ...current, [reviewContribution.contributionId]: true }));
      setLocalReviewed((current) => ({ ...current, [reviewContribution.contributionId]: true }));
      writeLocalReviewed(currentAddress, reviewContribution.contributionId);
      setReviewContributionId('');
      setContextNotice('Review submitted. The contribution now shows as endorsed while community data refreshes.');
      void refreshState();
    } else {
      setReviewNotice(result.error || 'Could not submit this review. Check your wallet password, tag, and review message, then try again.');
    }
  }

  function openReview(contributionId: string) {
    setSelectedContributionId(contributionId);
    setReviewContributionId(contributionId);
    setReviewNotice('');
  }

  function regenerateContributionId() {
    const nextCircleId = community?.circleId || circleId || 'circle';
    setContributionForm({
      ...contributionForm,
      contributionId: generateContributionId(nextCircleId, contributionForm.title),
    });
  }

  async function postContribution() {
    if (!community) return;
    const contributionId = contributionForm.contributionId.trim() || generateContributionId(community.circleId, contributionForm.title);
    setPostNotice('');
    const result = await submit('createContribution', { circleId: community.circleId, ...contributionForm, contributionId });
    if (result.ok) {
      setPostNotice('Contribution submitted. Refreshing the community feed...');
      setContributionForm({ ...contributionForm, contributionId: '' });
      setPostModalOpen(false);
      void refreshState();
      return;
    }
    setPostNotice(failureNoticeForStatus(result.error || ''));
  }

  if (!community) {
    return (
      <RepuRingPage>
        <section className="rounded-[34px] border border-[#54f3b3]/12 bg-[#04120f] p-10 shadow-[0_42px_130px_rgba(0,0,0,0.42)]">
          <EmptyState
            title={circleId ? 'Selected community not found' : 'No community selected'}
            copy="Choose a community before viewing workspace activity, members, roles, and proof-of-work."
            actions={<Button to="/repuring/circles" variant="secondary">Discover communities</Button>}
          />
        </section>
        <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
      </RepuRingPage>
    );
  }

  return (
    <RepuRingPage>
      <CommunityIdentityHeader
        community={community}
        status={walletStatus}
        primaryAction={primaryAction}
        onJoinCommunity={openJoinCommunity}
        isCreator={isCreator}
        refreshState={refreshState}
      />

      <MemberStatusBanner
        status={walletStatus}
        currentAddress={currentAddress}
        profileName={profile?.username}
        communityName={community.name}
        primaryAction={primaryAction}
        onJoinCommunity={openJoinCommunity}
        onCreatePost={() => {
          setPostNotice('');
          setPostModalOpen(true);
        }}
        isCreator={isCreator}
      />

      {contextNotice && (
        <section className="rounded-[24px] border border-emerald-300/20 bg-emerald-300/10 p-5 text-sm font-bold leading-6 text-emerald-100">
          {contextNotice}
        </section>
      )}

      <CommunityMetrics
        community={community}
        status={walletStatus}
        contributionCount={scopedContributions.length}
        reviewCount={scopedReviews.length}
      />

      <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <MemberPreview community={community} currentAddress={currentAddress} />
        <RoleProgressCard
          reputation={profile?.reputation || 0}
          currentRole={currentRole}
          nextRole={nextRole}
          isMember={isMember}
        />
      </section>

      <RecentContributions
        contributions={scopedContributions}
        reviews={scopedReviews}
        currentAddress={currentAddress}
        status={walletStatus}
        selectedContributionId={selectedContributionId}
        joinTarget={joinTarget}
        localEndorsed={localEndorsed}
        localReviewed={localReviewed}
        onEndorse={endorseContribution}
        onReview={openReview}
        submitting={submittingKind === 'endorseContribution'}
      />

      {reviewContribution && (
        <ReviewModal
          contribution={reviewContribution}
          password={password}
          setPassword={setPassword}
          endorse={endorse}
          setEndorse={setEndorse}
          submitting={submittingKind === 'endorseContribution'}
          notice={reviewNotice}
          onClose={() => setReviewContributionId('')}
          onSubmit={submitReview}
        />
      )}

      {postModalOpen && (
        <CreatePostModal
          community={community}
          password={password}
          setPassword={setPassword}
          contributionForm={contributionForm}
          setContributionForm={setContributionForm}
          notice={postNotice}
          postHelp={postHelp}
          postDisabled={postDisabled}
          submitting={submittingKind === 'createContribution'}
          onRegenerate={regenerateContributionId}
          onClose={() => setPostModalOpen(false)}
          onSubmit={postContribution}
        />
      )}

      <TechnicalStatus status={status} lastTx={lastTx} refreshState={refreshState} />
    </RepuRingPage>
  );
}

function CommunityIdentityHeader({
  community,
  status,
  primaryAction,
  onJoinCommunity,
  isCreator,
  refreshState,
}: {
  community: CircleView;
  status: CommunityStatus;
  primaryAction: NextAction;
  onJoinCommunity: () => void;
  isCreator: boolean;
  refreshState: () => Promise<void>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[#54f3b3]/12 bg-[#04120f] shadow-[0_42px_130px_rgba(0,0,0,0.42)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(84,243,179,0.20),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(84,243,179,0.08),transparent_35%)]" />
      <div className="relative grid min-h-[500px] gap-10 p-10 xl:grid-cols-[1.12fr_0.88fr] xl:items-center">
        <div className="max-w-4xl">
          <div className="inline-flex rounded-xl border border-[#54f3b3]/16 bg-[#54f3b3]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.30em] text-[#80f7c4]">
            Community workspace
          </div>
          <h1 className="mt-7 max-w-4xl text-[72px] font-black leading-[0.98] text-white">{community.name || 'Community workspace'}</h1>
          <p className="mt-7 max-w-3xl text-lg font-semibold leading-9 text-[#9db9af]">{community.description || 'Selected community workspace for members, work submissions, peer reviews, and role progress.'}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            {primaryAction.label === 'Join community' ? (
              <Button onClick={onJoinCommunity} variant={primaryAction.variant || 'primary'}>{primaryAction.label}</Button>
            ) : (
              <Button to={primaryAction.to} variant={primaryAction.variant || 'primary'}>{primaryAction.label}</Button>
            )}
            <Button to="/repuring/leaderboard" variant="secondary">View leaderboard</Button>
            <Button variant="secondary" onClick={refreshState}>Refresh community</Button>
            {isCreator && <Button to="/repuring/admin" variant="secondary">Open moderation</Button>}
          </div>
          <p className="mt-6 max-w-3xl break-all font-mono text-xs font-semibold text-[#68867b]">Circle ID: {community.circleId}</p>
        </div>

        <div className="justify-self-end rounded-[34px] border border-[#54f3b3]/18 bg-[#071c17]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_26px_90px_rgba(0,0,0,0.28)]">
          <div className="rounded-[28px] border border-white/10 bg-[#061b16] p-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Community status</p>
                <h2 className="mt-4 text-2xl font-black text-white">{status === 'Member' || status === 'Creator/admin' ? 'Ready for contribution' : 'Setup required'}</h2>
              </div>
              <StatusPill tone={status === 'Member' || status === 'Creator/admin' ? 'success' : 'warning'}>{status}</StatusPill>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <HeroMetric label="Members" value={String(community.members?.length || 0)} />
              <HeroMetric label="Creator" value={shortAddress(community.creatorAddress) || 'Unknown'} />
            </div>
            <div className="mt-5 rounded-[22px] border border-white/10 bg-[#03120f] p-4">
              <p className="text-xs font-black text-[#8faea3]">Workspace checklist</p>
              <div className="mt-4 space-y-3">
                {['Wallet selected', 'Profile created', 'Community member'].map((item, index) => (
                  <div className="flex items-center gap-3 text-sm font-bold text-[#9db9af]" key={item}>
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full ${checklistActive(status, index) ? 'bg-[#54f3b3] text-[#03120f]' : 'bg-white/10 text-[#68867b]'}`}>
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberStatusBanner({
  status,
  currentAddress,
  profileName,
  communityName,
  primaryAction,
  onJoinCommunity,
  onCreatePost,
  isCreator,
}: {
  status: CommunityStatus;
  currentAddress: string;
  profileName?: string;
  communityName: string;
  primaryAction: NextAction;
  onJoinCommunity: () => void;
  onCreatePost: () => void;
  isCreator: boolean;
}) {
  const message = status === 'No wallet selected'
    ? 'Select a wallet to start using this community.'
    : status === 'No profile'
      ? 'Create a contributor profile before joining communities.'
      : status === 'Not joined'
        ? 'Join this community before posting or reviewing work.'
        : status === 'Creator/admin'
          ? 'You are the creator/admin of this community.'
          : 'You are active in this community.';
  return (
    <section className="rounded-[32px] border border-[#54f3b3]/18 bg-[#061f19] p-7 shadow-[0_24px_100px_rgba(0,0,0,0.28)]">
      <div className="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Active wallet / member status</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone={currentAddress ? 'cyan' : 'zinc'}>{shortAddress(currentAddress) || 'No wallet selected'}</Badge>
            <Badge tone={profileName ? 'emerald' : 'zinc'}>{profileName || 'No profile'}</Badge>
            <Badge tone={status === 'Member' || status === 'Creator/admin' ? 'emerald' : 'zinc'}>{status}</Badge>
          </div>
          <p className="mt-4 max-w-4xl text-sm font-semibold leading-7 text-[#9db9af]">
            {message} Current community: {communityName}.
          </p>
        </div>
        <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-[360px] xl:justify-end">
          {status === 'Member' || status === 'Creator/admin' ? (
            <>
              <CommunityActionCard
                title="Create post"
                onClick={onCreatePost}
              />
              <CommunityActionCard
                title="Change community"
                to="/repuring/circles?view=involved"
              />
            </>
          ) : primaryAction.label === 'Join community' ? (
            <Button onClick={onJoinCommunity} variant={primaryAction.variant || 'primary'}>{primaryAction.label}</Button>
          ) : (
            <Button to={primaryAction.to} variant={primaryAction.variant || 'primary'}>{primaryAction.label}</Button>
          )}
          {isCreator && <Button to="/repuring/admin" variant="secondary">Open moderation</Button>}
        </div>
      </div>
    </section>
  );
}

function CommunityActionCard({
  title,
  onClick,
  to,
}: {
  title: string;
  onClick?: () => void;
  to?: string;
}) {
  const className = 'flex min-h-[64px] items-center justify-center rounded-[18px] border border-[#54f3b3]/24 bg-[#54f3b3]/10 p-3 text-center shadow-[0_10px_34px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#54f3b3]/44 hover:bg-[#54f3b3]/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#54f3b3]/60';
  const content = (
    <span className="block text-base font-black leading-tight text-white">{title}</span>
  );
  if (to) {
    return <Button to={to} variant="secondary" className={`${className} !px-3 !py-3`}>{content}</Button>;
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  );
}

function CommunityMetrics({ community, status, contributionCount, reviewCount }: { community: CircleView; status: CommunityStatus; contributionCount: number; reviewCount: number }) {
  return (
    <section className="grid gap-4 xl:grid-cols-5">
      <MetricTile label="Members" value={String(community.members?.length || 0)} detail="Joined contributor profiles." />
      <MetricTile label="Contributions" value={String(contributionCount)} detail="Proof-of-work loaded for this community." />
      <MetricTile label="Reviews" value={String(reviewCount)} detail="Endorsements and peer review messages." />
      <MetricTile label="Creator" value={shortAddress(community.creatorAddress) || 'Unknown'} detail="Community creator/admin wallet." />
      <MetricTile label="Community status" value={status} detail="Your current access state." />
    </section>
  );
}

function RoleProgressCard({ reputation, currentRole, nextRole, isMember }: { reputation: number; currentRole: string; nextRole: { name: string; threshold: number } | null; isMember: boolean }) {
  const needed = nextRole ? Math.max(0, nextRole.threshold - reputation) : 0;
  return (
    <section className={`rounded-[32px] border p-8 shadow-[0_24px_90px_rgba(0,0,0,0.24)] ${isMember ? 'border-[#54f3b3]/12 bg-[#061b16]' : 'border-white/10 bg-[#041612]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Role progress</p>
          <h2 className="mt-5 text-3xl font-black text-white">{isMember ? 'Claim community role' : 'Role locked'}</h2>
        </div>
        {!isMember && <Lock className="h-5 w-5 text-[#68867b]" />}
      </div>
      <p className="mt-5 text-sm font-semibold leading-7 text-[#9db9af]">
        {isMember ? 'Global reputation is used to claim a role in the selected community.' : 'Join this community before claiming a role.'}
      </p>
      <div className="mt-6 grid gap-3">
        <MetricInline label="Global reputation" value={String(reputation)} />
        <MetricInline label="Current role" value={roleBadge(currentRole)} />
        <MetricInline label="Next role" value={nextRole?.name || 'Highest role reached'} />
        <MetricInline label="Points needed" value={nextRole ? String(needed) : '0'} />
      </div>
      <div className="mt-6">
        <Button to="/repuring/admin" variant={isMember ? 'primary' : 'secondary'} disabled={!isMember}>Claim role</Button>
      </div>
    </section>
  );
}

function RecentContributions({
  contributions,
  reviews,
  currentAddress,
  status,
  selectedContributionId,
  joinTarget,
  localEndorsed,
  localReviewed,
  onEndorse,
  onReview,
  submitting,
}: {
  contributions: ContributionView[];
  reviews: EndorsementView[];
  currentAddress: string;
  status: CommunityStatus;
  selectedContributionId: string;
  joinTarget: string;
  localEndorsed: Record<string, boolean>;
  localReviewed: Record<string, boolean>;
  onEndorse: (contributionId: string) => Promise<void>;
  onReview: (contributionId: string) => void;
  submitting: boolean;
}) {
  const [openContribution, setOpenContribution] = React.useState<{
    item: ContributionView;
    reviews: EndorsementView[];
    endorseCount: number;
    reviewCount: number;
  } | null>(null);

  return (
    <>
      <section className="rounded-[32px] border border-[#54f3b3]/12 bg-[#061b16] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Recent proof-of-work</p>
            <h2 className="mt-5 text-4xl font-black text-white">Community activity</h2>
          </div>
        </div>
        {contributions.length === 0 ? (
          <EmptyPanel title="No proof-of-work yet" copy="Joined members can post the first proof-of-work for this community." />
        ) : (
          <div className="mt-7 grid gap-4">
            {contributions.map((item) => {
              const itemReviews = reviews.filter((review) => review.contributionId === item.contributionId);
              const currentUserReviews = itemReviews.filter((review) => cleanHex(review.fromAddress) === cleanHex(currentAddress));
              const currentUserWrittenReviewLoaded = currentUserReviews.some(isWrittenReview);
              const optimisticReviewCount = localReviewed[item.contributionId] && !currentUserWrittenReviewLoaded ? 1 : 0;
              const optimisticEndorseCount = localEndorsed[item.contributionId] && currentUserReviews.length === 0 ? 1 : 0;
              const reviewCount = itemReviews.length + optimisticReviewCount;
              const endorseCount = (item.endorsementCount || 0) + optimisticEndorseCount;
              return (
                <ContributionPreviewCard
                  key={item.contributionId}
                  item={item}
                  reviewCount={reviewCount}
                  endorseCount={endorseCount}
                  alreadyEndorsed={Boolean(localEndorsed[item.contributionId]) || currentUserReviews.length > 0}
                  reviewed={Boolean(localReviewed[item.contributionId]) || currentUserWrittenReviewLoaded}
                  ownWork={Boolean(currentAddress && cleanHex(item.authorAddress) === cleanHex(currentAddress))}
                  status={status}
                  selected={selectedContributionId === item.contributionId}
                  joinTarget={joinTarget}
                  onOpenDetails={() => setOpenContribution({ item, reviews: itemReviews, endorseCount, reviewCount })}
                  onEndorse={onEndorse}
                  onReview={onReview}
                  submitting={submitting}
                />
              );
            })}
          </div>
        )}
      </section>
      {openContribution && (
        <ContributionDetailsModal
          contribution={openContribution.item}
          reviews={openContribution.reviews}
          endorseCount={openContribution.endorseCount}
          reviewCount={openContribution.reviewCount}
          onClose={() => setOpenContribution(null)}
        />
      )}
    </>
  );
}

function ContributionPreviewCard({
  item,
  reviewCount,
  endorseCount,
  alreadyEndorsed,
  reviewed,
  ownWork,
  status,
  selected,
  joinTarget,
  onOpenDetails,
  onEndorse,
  onReview,
  submitting,
}: {
  item: ContributionView;
  reviewCount: number;
  endorseCount: number;
  alreadyEndorsed: boolean;
  reviewed: boolean;
  ownWork: boolean;
  status: CommunityStatus;
  selected: boolean;
  joinTarget: string;
  onOpenDetails: () => void;
  onEndorse: (contributionId: string) => Promise<void>;
  onReview: (contributionId: string) => void;
  submitting: boolean;
}) {
  const cta = contributionCta(item, status, ownWork, alreadyEndorsed, joinTarget);
  const openOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onOpenDetails();
  };
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpenDetails}
      onKeyDown={openOnEnter}
      className={`cursor-pointer rounded-[26px] border p-5 transition hover:-translate-y-0.5 hover:border-[#54f3b3]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#54f3b3]/60 ${selected ? 'border-[#54f3b3]/35 bg-[#0a2d24]' : 'border-white/10 bg-[#041612]'}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="cyan">{item.category || 'General'}</Badge>
            <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
          </div>
          <h3 className="mt-4 break-words text-2xl font-black text-white">{item.title || 'Untitled proof-of-work'}</h3>
          <p className="mt-2 text-sm font-bold text-[#8faea3]">By {item.authorUsername || shortAddress(item.authorAddress)}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge tone="emerald">{endorseCount} endorse{endorseCount === 1 ? '' : 's'}</Badge>
          <Badge tone="zinc">{reviewCount} review{reviewCount === 1 ? '' : 's'}</Badge>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-[#9db9af]">{item.description || 'No description provided.'}</p>
      <div className="mt-4 rounded-[18px] border border-white/10 bg-black/20 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#68867b]">Proof URL</p>
        {item.proofUrl ? (
          <a href={item.proofUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="mt-2 block break-all text-sm font-bold text-[#54f3b3] underline-offset-4 hover:underline">{proofLabel(item.proofUrl)}</a>
        ) : (
          <p className="mt-2 text-sm font-bold text-[#68867b]">No proof URL provided</p>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3" onClick={(event) => event.stopPropagation()}>
        {cta.kind === 'button' ? (
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <ContributionActionTile
              label={alreadyEndorsed ? 'Endorsed' : (submitting && selected ? 'Endorsing...' : cta.label)}
              copy={alreadyEndorsed ? 'This wallet has endorsed the proof.' : 'Submit a quick endorsement for this proof-of-work.'}
              disabled={alreadyEndorsed || submitting}
              active={selected || alreadyEndorsed}
              onClick={() => { void onEndorse(item.contributionId); }}
            />
            <ContributionActionTile
              label={reviewed ? 'Reviewed' : 'Review'}
              copy={reviewed ? 'This wallet has reviewed the proof.' : 'Write a peer validation message without leaving this page.'}
              disabled={reviewed || submitting}
              active={reviewed}
              onClick={() => onReview(item.contributionId)}
            />
          </div>
        ) : cta.to ? (
          <Button to={cta.to} variant="secondary">{cta.label}</Button>
        ) : (
          <Badge tone={cta.tone || 'zinc'}>{cta.label}</Badge>
        )}
        {cta.help && <p className="text-xs font-bold text-[#68867b]">{cta.help}</p>}
      </div>
    </article>
  );
}

function ContributionDetailsModal({
  contribution,
  reviews,
  endorseCount,
  reviewCount,
  onClose,
}: {
  contribution: ContributionView;
  reviews: EndorsementView[];
  endorseCount: number;
  reviewCount: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/72 p-4 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <section
        className="flex max-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[#54f3b3]/24 bg-[#0b3a2d] shadow-[0_36px_140px_rgba(0,0,0,0.62)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-white/10 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-[#54f3b3]/20 bg-[#54f3b3]/12 text-xl font-black text-[#dfffee]">
                {(contribution.authorUsername || contribution.authorAddress || '?').slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="break-words text-xl font-black text-white">{contribution.authorUsername || shortAddress(contribution.authorAddress)}</p>
                <p className="mt-1 font-mono text-sm font-bold text-[#8faea3]">{shortAddress(contribution.authorAddress)}</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Badge tone="cyan">{contribution.category || 'General'}</Badge>
              <StatusPill tone={contribution.slashed ? 'danger' : 'success'}>{contribution.slashed ? 'Slashed' : 'Active'}</StatusPill>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <h2 className="break-words text-2xl font-black text-white">{contribution.title || 'Untitled proof-of-work'}</h2>
          <p className="mt-5 break-words text-base font-medium leading-7 text-[#d7e8df]">{contribution.description || 'No description provided.'}</p>

          <div className="mt-7 grid gap-4 rounded-[22px] border border-white/10 bg-[#06291f] p-5 text-sm sm:grid-cols-[0.9fr_1.1fr]">
            <span className="font-semibold text-[#8faea3]">Proof</span>
            {contribution.proofUrl ? (
              <a className="break-all text-right font-mono font-bold text-[#9bf8e8] underline-offset-4 hover:underline" href={contribution.proofUrl} target="_blank" rel="noreferrer">{proofLabel(contribution.proofUrl)}</a>
            ) : (
              <span className="text-right font-semibold text-[#8faea3]">No proof URL provided</span>
            )}
            <span className="font-semibold text-[#8faea3]">Endorsements</span>
            <span className="text-right"><Badge tone="emerald">{endorseCount}</Badge></span>
            <span className="font-semibold text-[#8faea3]">Proof reference</span>
            <span className="break-all text-right font-mono font-bold text-[#d7e8df]">{contribution.contributionId}</span>
          </div>

          <section className="mt-7 rounded-[24px] border border-white/10 bg-[#06291f] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">Reviews / comments</h3>
                <p className="mt-2 text-sm font-semibold text-[#8faea3]">Peer review messages attached to this proof-of-work.</p>
              </div>
              <Badge tone="zinc">{reviewCount} review{reviewCount === 1 ? '' : 's'}</Badge>
            </div>

            {reviews.length === 0 ? (
              <p className="mt-5 rounded-[20px] border border-dashed border-white/12 bg-white/[0.03] p-5 text-sm font-semibold text-[#8faea3]">
                No reviews yet. Review this contribution from another member account to add the first comment.
              </p>
            ) : (
              <div className="mt-5 grid gap-4">
                {reviews.map((review) => (
                  <article key={review.endorsementId} className="rounded-[22px] border border-white/10 bg-[#0b3a2d] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="cyan">{shortAddress(review.fromAddress)}</Badge>
                        <Badge>{review.tag || 'review'}</Badge>
                      </div>
                      <StatusPill tone={review.slashed ? 'danger' : 'success'}>{review.slashed ? 'Slashed' : 'Active'}</StatusPill>
                    </div>
                    <p className="mt-5 break-words text-base leading-7 text-[#d7e8df]">{review.message || 'No review message provided.'}</p>
                    {review.slashed && review.slashReason && <p className="mt-3 break-words text-xs font-semibold leading-5 text-red-200">Slash reason: {review.slashReason}</p>}
                    <p className="mt-5 break-all font-mono text-xs text-[#68867b]">{review.endorsementId}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="shrink-0 border-t border-white/10 p-5 sm:p-6">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </section>
    </div>
  );
}

function ContributionActionTile({
  label,
  copy,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  copy: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[104px] rounded-[22px] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#54f3b3]/60 ${
        active
          ? 'border-[#54f3b3]/35 bg-[#0c4a3b] text-white'
          : 'border-white/10 bg-black/20 text-[#f2fff8] hover:-translate-y-0.5 hover:border-[#54f3b3]/24 hover:bg-[#08241d]'
      } ${disabled ? 'cursor-not-allowed opacity-70 hover:translate-y-0' : ''}`}
    >
      <span className="block text-sm font-black text-[#54f3b3]">{label}</span>
      <span className="mt-3 block text-xs font-semibold leading-5 text-[#9db9af]">{copy}</span>
    </button>
  );
}

function CreatePostModal({
  community,
  password,
  setPassword,
  contributionForm,
  setContributionForm,
  notice,
  postHelp,
  postDisabled,
  submitting,
  onRegenerate,
  onClose,
  onSubmit,
}: {
  community: CircleView;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  contributionForm: { contributionId: string; title: string; description: string; proofUrl: string; category: string };
  setContributionForm: React.Dispatch<React.SetStateAction<{ contributionId: string; title: string; description: string; proofUrl: string; category: string }>>;
  notice: string;
  postHelp: string;
  postDisabled: boolean;
  submitting: boolean;
  onRegenerate: () => void;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/70 p-4 backdrop-blur-sm sm:p-6">
      <section className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] border border-[#54f3b3]/18 bg-[#041612] shadow-[0_36px_140px_rgba(0,0,0,0.58)]">
        <div className="shrink-0 border-b border-white/10 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Create post</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white">Post proof-of-work</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#9db9af]">
                Publish a contribution in {community.name || 'the current community'}.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-[#9db9af] transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-7">
          <Input label="Wallet password" type="password" value={password} onChange={setPassword} />
          <Input label="Title" value={contributionForm.title} onChange={(title) => setContributionForm({ ...contributionForm, title })} />
          <Input label="Description" value={contributionForm.description} onChange={(description) => setContributionForm({ ...contributionForm, description })} multiline />
          <Input label="Proof URL" value={contributionForm.proofUrl} onChange={(proofUrl) => setContributionForm({ ...contributionForm, proofUrl })} />

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#9db9af]">Category</span>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm leading-5 text-white outline-none transition focus:border-[#54f3b3]/60 focus:ring-2 focus:ring-[#54f3b3]/20 sm:rounded-2xl sm:px-4 sm:py-3"
              value={contributionForm.category}
              onChange={(event) => setContributionForm({ ...contributionForm, category: event.target.value })}
            >
              {POST_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black text-white">Proof reference</p>
                <p className="mt-2 break-all font-mono text-xs text-[#9db9af]">{contributionForm.contributionId || 'Generated before submit'}</p>
              </div>
              <Button variant="secondary" onClick={onRegenerate}>Regenerate ID</Button>
            </div>
          </div>

          {notice && <p className="rounded-[18px] border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-semibold leading-6 text-amber-100">{notice}</p>}
          <p className="text-sm font-semibold leading-6 text-[#8faea3]">{postHelp}</p>
        </div>

        <div className="shrink-0 border-t border-white/10 p-5 sm:p-7">
          <div className="flex flex-wrap gap-3">
            <Button disabled={postDisabled} onClick={onSubmit}>{submitting ? 'Posting...' : 'Post proof-of-work'}</Button>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewModal({
  contribution,
  password,
  setPassword,
  endorse,
  setEndorse,
  submitting,
  notice,
  onClose,
  onSubmit,
}: {
  contribution: ContributionView;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  endorse: { tag: string; message: string };
  setEndorse: React.Dispatch<React.SetStateAction<{ tag: string; message: string }>>;
  submitting: boolean;
  notice: string;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}) {
  const tags = ['builder', 'helper', 'creator', 'leader', 'trusted'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <section className="w-full max-w-3xl rounded-[32px] border border-[#54f3b3]/18 bg-[#041612] p-7 shadow-[0_36px_140px_rgba(0,0,0,0.58)]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Peer validation</p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white">Peer validation Write a contribution review</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#9db9af]">
              Review {contribution.title || 'this proof-of-work'} from the current community without leaving the workspace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-[#9db9af] transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#68867b]">Contribution</p>
            <h3 className="mt-2 break-words text-xl font-black text-white">{contribution.title || 'Untitled proof-of-work'}</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#9db9af]">{contribution.description || 'No description provided.'}</p>
          </div>
          <Input label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required to submit a review" />
          <div>
            <p className="mb-2 text-sm font-bold text-[#9db9af]">Review tag</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setEndorse({ ...endorse, tag })}
                  aria-pressed={endorse.tag === tag}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#54f3b3]/60 ${endorse.tag === tag ? 'border-[#54f3b3]/40 bg-[#54f3b3]/15 text-[#dfffee]' : 'border-white/10 bg-white/5 text-[#8faea3] hover:bg-white/[0.08]'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <Input label="Review message" value={endorse.message} onChange={(message) => setEndorse({ ...endorse, message })} multiline />
          {notice && <p className="rounded-[18px] border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-semibold leading-6 text-amber-100">{notice}</p>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button disabled={submitting} onClick={onSubmit}>{submitting ? 'Submitting...' : 'Submit review'}</Button>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </section>
    </div>
  );
}

function MemberPreview({ community, currentAddress }: { community: CircleView; currentAddress: string }) {
  const preview = (community.members || []).slice(0, 5);
  return (
    <section className="rounded-[32px] border border-[#54f3b3]/12 bg-[#041612] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Members</p>
          <h2 className="mt-4 text-3xl font-black text-white">{community.members?.length || 0} members</h2>
        </div>
        <Users className="h-6 w-6 text-[#54f3b3]" />
      </div>
      {preview.length === 0 ? (
        <p className="mt-6 text-sm font-semibold leading-7 text-[#9db9af]">Members appear here after wallets join this community.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {preview.map((address) => {
            const creator = cleanHex(address) === cleanHex(community.creatorAddress);
            const current = cleanHex(address) === cleanHex(currentAddress);
            return (
              <div className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-[#061b16] p-4" key={address}>
                <span className="font-mono text-sm font-black text-white">{shortAddress(address)}</span>
                <span className="flex flex-wrap justify-end gap-2">
                  {creator && <Badge>Creator/admin</Badge>}
                  {current && <Badge tone="cyan">You</Badge>}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TechnicalStatus({ status, lastTx, refreshState }: { status: string; lastTx: string; refreshState: () => Promise<void> }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#04120f] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#68867b]">Service status</p>
          <p className="mt-3 break-words text-sm font-semibold leading-6 text-[#9db9af]">{friendlyStatus(status)}</p>
          <p className="mt-2 text-xs font-semibold text-[#68867b]">{lastTx || 'No action submitted yet.'}</p>
        </div>
        <Button variant="secondary" onClick={refreshState}>Refresh status</Button>
      </div>
    </section>
  );
}

function MetricTile({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="rounded-[26px] border border-[#54f3b3]/12 bg-[#061b16] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.20)]">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#54f3b3]">{label}</p>
      <p className="mt-4 min-h-8 break-words text-2xl font-black text-white">{value}</p>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#8faea3]">{detail}</p>
    </section>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-[#0a2d24] p-4">
      <p className="break-words font-mono text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs font-bold leading-4 text-[#8faea3]">{label}</p>
    </div>
  );
}

function MetricInline({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-[#68867b]">{label}</span>
      <span className="text-right text-sm font-black text-white">{value}</span>
    </div>
  );
}

function EmptyPanel({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="mt-7 rounded-[24px] border border-dashed border-white/14 bg-black/20 p-6">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-[#9db9af]">{copy}</p>
    </div>
  );
}

function nextActionForState(status: CommunityStatus, circleId?: string): NextAction {
  if (status === 'No wallet selected') return { label: 'Select wallet', to: '/key-management', variant: 'secondary' };
  if (status === 'No profile') return { label: 'Create profile', to: '/key-management', variant: 'secondary' };
  if (status === 'Not joined') {
    return { label: 'Join community', to: joinCommunityTarget(circleId), variant: 'secondary' };
  }
  return { label: 'Change community', to: '/repuring/circles?view=involved', variant: 'secondary' };
}

function joinCommunityTarget(circleId?: string) {
  return circleId ? `/repuring/circles?join=${encodeURIComponent(circleId)}` : '/repuring/circles';
}

function contributionCta(item: ContributionView, status: CommunityStatus, ownWork: boolean, alreadyEndorsed: boolean, joinTarget: string): { kind: 'button' | 'link' | 'badge'; label: string; to?: string; help?: string; tone?: 'cyan' | 'emerald' | 'zinc' } {
  if (status === 'No wallet selected') return { kind: 'link', label: 'Select wallet', to: '/key-management' };
  if (status === 'No profile') return { kind: 'link', label: 'Create profile', to: '/key-management' };
  if (status === 'Not joined') return { kind: 'link', label: 'Join to review', to: joinTarget };
  if (item.slashed) return { kind: 'badge', label: 'Review disabled', tone: 'zinc', help: 'This proof-of-work has been slashed.' };
  if (ownWork) return { kind: 'link', label: 'Switch wallet', to: '/key-management', help: 'Own work. Switch wallet to review.' };
  return { kind: 'button', label: 'Endorse' };
}

function nextRoleForReputation(reputation: number): { name: string; threshold: number } | null {
  if (reputation < 5) return { name: 'Trusted', threshold: 5 };
  if (reputation < 15) return { name: 'Core Member', threshold: 15 };
  if (reputation < 30) return { name: 'Circle Leader', threshold: 30 };
  return null;
}

function checklistActive(status: CommunityStatus, index: number) {
  if (index === 0) return status !== 'No wallet selected';
  if (index === 1) return status !== 'No wallet selected' && status !== 'No profile';
  return status === 'Member' || status === 'Creator/admin';
}

function isCircleMember(circle: CircleView | null, currentAddress: string) {
  return Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
}

function communityStatus(circle: CircleView | null, currentAddress: string, hasProfile: boolean): CommunityStatus {
  if (!currentAddress) return 'No wallet selected';
  if (!hasProfile) return 'No profile';
  if (circle?.creatorAddress && cleanHex(circle.creatorAddress) === cleanHex(currentAddress)) return 'Creator/admin';
  if (isCircleMember(circle, currentAddress)) return 'Member';
  return 'Not joined';
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

function generateContributionId(circleId: string, title: string): string {
  const circleSlug = slugifyContributionTitle(circleId || 'circle');
  const titleSlug = slugifyContributionTitle(title);
  const suffix = Date.now().toString(36).slice(-6);
  return `${circleSlug}-${titleSlug}-${suffix}`;
}

function slugifyContributionTitle(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'contribution';
}

function failureNoticeForStatus(status: string): string {
  const value = status.toLowerCase();
  if (value.includes('contribution') && value.includes('exists')) {
    return 'This proof reference already exists. Regenerate it and try again.';
  }
  if (value.includes('member')) return 'Join this community before posting.';
  if (value.includes('circle') && (value.includes('not found') || value.includes('does not exist'))) {
    return 'Current community could not be found. Reopen it from Circles.';
  }
  return 'Contribution could not be submitted. Check the status below. If the proof reference already exists, regenerate it and try again.';
}

function isWrittenReview(review: EndorsementView) {
  const message = review.message.trim();
  if (!message) return false;
  if (message === QUICK_ENDORSE_MESSAGE) return false;
  return true;
}

function readLocalReviewed(currentAddress: string) {
  if (!currentAddress || typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(localReviewedKey(currentAddress));
    const values = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(values)) return {};
    return values.reduce<Record<string, boolean>>((map, value) => {
      if (typeof value === 'string' && value.trim()) map[value] = true;
      return map;
    }, {});
  } catch {
    return {};
  }
}

function writeLocalReviewed(currentAddress: string, contributionId: string) {
  if (!currentAddress || !contributionId || typeof window === 'undefined') return;
  const current = readLocalReviewed(currentAddress);
  current[contributionId] = true;
  try {
    window.localStorage.setItem(localReviewedKey(currentAddress), JSON.stringify(Object.keys(current)));
  } catch {
    // Ignore storage failures; onchain refresh still carries the canonical review state.
  }
}

function localReviewedKey(currentAddress: string) {
  return `${LOCAL_REVIEWED_PREFIX}:${cleanHex(currentAddress)}`;
}

function friendlyStatus(value: string) {
  const emptyStatusFailure = value.match(/^Status\s+([A-Za-z]+)\s+failed:\s*(\{\}|\[\]|null|undefined)?$/i);
  if (emptyStatusFailure) {
    return `${actionFailureLabel(emptyStatusFailure[1])} needs attention. The local node did not explain the failure. Check the selected wallet, required fields, and current community state, then try again.`;
  }
  const lower = value.toLowerCase();
  if (lower.includes('failed') || lower.includes('could not')) return `Action needs attention: ${value}`;
  if (lower.includes('submitting') || lower.includes('waiting')) return `Action in progress: ${value}`;
  return value || 'Community data is ready.';
}

function actionFailureLabel(kind: string) {
  const labels: Record<string, string> = {
    createProfile: 'Profile creation',
    updateProfile: 'Profile update',
    createCircle: 'Community creation',
    joinCircle: 'Community join',
    createContribution: 'Proof-of-work post',
    endorseUser: 'Member endorsement',
    endorseContribution: 'Peer review',
    slashEndorsement: 'Review moderation',
    claimRole: 'Role claim',
  };
  return labels[kind] || 'Action';
}
