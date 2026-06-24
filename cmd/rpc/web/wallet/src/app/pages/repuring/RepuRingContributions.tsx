import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveWalletBanner, ActionGate, Badge, Button, CommunityContextCard, ContributionCard, ContributionReviews, EmptyState, GeneratedRecordIdBlock, Input, MetricCard, PageHeader, Panel, PostVisibilityNotice, RepuRingPage, SectionHeader, TxStatusCard } from './components';
import { cleanHex } from './RepuRingProvider';
import { ContributionView, useRepuRing } from './useRepuRing';

const categories = ['builder', 'helper', 'creator', 'researcher', 'tester', 'educator'];
const filterChips = ['all', ...categories];

export default function RepuRingContributions(): JSX.Element {
  const navigate = useNavigate();
  const {
    currentAddress,
    password,
    setPassword,
    circleId,
    circle,
    profile,
    contributionForm,
    setContributionForm,
    contributions,
    endorsements,
    selectedContributionId,
    setSelectedContributionId,
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();
  const [composerOpen, setComposerOpen] = React.useState(contributions.length === 0);
  const [filter, setFilter] = React.useState('all');
  const [customContributionId, setCustomContributionId] = React.useState('');
  const [recentlySubmittedContributionId, setRecentlySubmittedContributionId] = React.useState('');
  const [postNotice, setPostNotice] = React.useState('');
  const [postCheckPending, setPostCheckPending] = React.useState(false);
  const [visibleLimit, setVisibleLimit] = React.useState(10);
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const filteredContributions = filter === 'all' ? contributions : contributions.filter((item) => item.category === filter);
  const visibleContributions = filteredContributions.slice(0, visibleLimit);
  const hasMoreContributions = visibleContributions.length < filteredContributions.length;
  const circleMismatch = Boolean(circle && circleId && circle.circleId !== circleId);
  const postDisabled = !currentAddress || !profile || !circle || !isMember || !password || !contributionForm.title.trim();
  const postHelp = !currentAddress
    ? 'Select a wallet in My Account.'
      : !profile
        ? 'Create your profile before posting proof-of-work.'
        : !circle
        ? 'Open or join a community before posting proof-of-work.'
        : !isMember
          ? 'Join the current community before posting.'
          : !password
            ? 'Enter the selected wallet password to sign CreateContributionTx.'
            : !contributionForm.title.trim()
              ? 'Enter a title for this proof-of-work. Contribution ID will be generated automatically.'
              : 'Ready to post proof-of-work. Contribution ID will be generated automatically.';

  React.useEffect(() => {
    if (!composerOpen || !circle?.circleId || !contributionForm.title.trim() || contributionForm.contributionId.trim()) return;
    setContributionForm({
      ...contributionForm,
      contributionId: generateContributionId(circle.circleId, contributionForm.title),
    });
  }, [composerOpen, circle?.circleId, contributionForm.title, contributionForm.contributionId, setContributionForm]);

  React.useEffect(() => {
    if (!recentlySubmittedContributionId || postCheckPending) return;
    const found = contributions.some((item) => item.contributionId === recentlySubmittedContributionId);
    if (found) {
      setPostNotice('Contribution posted and visible in the feed.');
      setRecentlySubmittedContributionId('');
      return;
    }
    setPostNotice('Contribution submitted, but it is not visible in the feed yet. Refresh again or check transaction status.');
  }, [contributions, postCheckPending, recentlySubmittedContributionId]);

  React.useEffect(() => {
    setVisibleLimit(10);
  }, [filter, circleId]);

  function regenerateContributionId() {
    const nextCircleId = circle?.circleId || circleId || 'circle';
    setContributionForm({
      ...contributionForm,
      contributionId: generateContributionId(nextCircleId, contributionForm.title),
    });
  }

  function useCustomContributionId() {
    const nextContributionId = customContributionId.trim();
    if (!nextContributionId) return;
    setContributionForm({ ...contributionForm, contributionId: nextContributionId });
  }

  async function postContribution() {
    if (!circle) return;
    const targetCircleId = circle.circleId;
    const contributionId = contributionForm.contributionId.trim() || generateContributionId(targetCircleId, contributionForm.title);
    setPostNotice('');
    setPostCheckPending(false);
    const result = await submit('createContribution', { circleId: targetCircleId, ...contributionForm, contributionId });
    if (result.ok) {
      setRecentlySubmittedContributionId(contributionId);
      setPostCheckPending(true);
      setPostNotice('Contribution submitted. Checking the feed for the new post...');
      await refreshState();
      setPostCheckPending(false);
      setComposerOpen(false);
      setContributionForm({ ...contributionForm, contributionId: '' });
      return;
    }
    setPostNotice(failureNoticeForStatus(result.error || ''));
  }

  function composerAction() {
    if (!currentAddress) return <Button to="/key-management" variant="secondary">Select wallet</Button>;
    if (!profile) return <Button to="/key-management" variant="secondary">Create profile</Button>;
    if (!circle) return <Button to="/repuring/circles" variant="secondary">Discover communities</Button>;
    if (!isMember) return <Button to="/repuring/circles" variant="secondary">Join community</Button>;
    return <Button onClick={() => setComposerOpen((open) => !open)}>{composerOpen ? 'Close composer' : 'Open composer'}</Button>;
  }

  function emptyFeedAction() {
    if (!currentAddress) return <Button to="/key-management" variant="secondary">Select wallet</Button>;
    if (!profile) return <Button to="/key-management" variant="secondary">Create profile</Button>;
    if (!circle) return <Button to="/repuring/circles" variant="secondary">Discover communities</Button>;
    if (!isMember) return <Button to="/repuring/circles" variant="secondary">Join community</Button>;
    return <Button onClick={() => setComposerOpen(true)}>Post first proof-of-work</Button>;
  }

  function reviewAction(item: ContributionView, selected: boolean) {
    const ownWork = Boolean(currentAddress && cleanHex(item.authorAddress) === cleanHex(currentAddress));
    if (!currentAddress) return <Button to="/key-management" variant="secondary">Select wallet</Button>;
    if (!profile) return <Button to="/key-management" variant="secondary">Create profile</Button>;
    if (!isMember) return <Button to="/repuring/circles" variant="secondary">Join to review</Button>;
    if (ownWork) {
      return (
        <ActionGate
          title="Own work"
          copy="Another community member must review this proof-of-work."
        />
      );
    }
    if (item.slashed) {
      return (
        <ActionGate
          tone="danger"
          title="Review disabled"
          copy="This contribution has been slashed and cannot receive new endorsements."
        />
      );
    }
    return (
      <Button
        variant={selected ? 'primary' : 'secondary'}
        className="w-full sm:w-auto"
        onClick={() => {
          setSelectedContributionId(item.contributionId);
          navigate('/repuring/endorse');
        }}
      >
        Review this work
      </Button>
    );
  }

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Post Work"
        title="Proof-of-work feed"
        copy="Post proof-of-work inside the selected community. Peer endorsements increase the author's global profile reputation."
        actions={(
          <>
            <Button variant="secondary" onClick={refreshState}>Refresh feed</Button>
            <Button to="/repuring/community" variant="secondary">Open community</Button>
            <Button to="/repuring/circles" variant="secondary">Discover communities</Button>
          </>
        )}
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

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <Panel>
            <SectionHeader
              eyebrow="Composer"
              title="Post proof-of-work"
              copy="Publish proof-of-work in the current community after your wallet has joined it."
              actions={composerAction()}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Community" value={circle?.name || 'No community selected'} detail={circle?.description || 'Open or join a community from Discover communities.'} tone="cyan" />
              <MetricCard label="Circle ID" value={circle?.circleId || circleId || 'Not selected'} detail="Current community context for new contribution proofs." />
              <MetricCard label="Members" value={String(circle?.members?.length || 0)} detail="Joined wallets in this community." tone="emerald" />
              <MetricCard label="Posting status" value={postingStatus(currentAddress, Boolean(profile), Boolean(circle), isMember)} detail={postHelp} tone={isMember ? 'emerald' : 'neutral'} />
            </div>
            {circleMismatch && (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-medium leading-6 text-amber-100">
                Current form will post to the loaded community <span className="font-mono">{circle?.circleId}</span>. Reopen the community if the context looks stale.
              </div>
            )}
            <PostVisibilityNotice message={postNotice} />
            {composerOpen && (
              <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
                <Input label="Title" value={contributionForm.title} onChange={(title) => setContributionForm({ ...contributionForm, title })} placeholder="Wrote Pharos testnet guide" />
                <Input label="Description" value={contributionForm.description} onChange={(description) => setContributionForm({ ...contributionForm, description })} multiline />
                <Input label="Proof URL" value={contributionForm.proofUrl} onChange={(proofUrl) => setContributionForm({ ...contributionForm, proofUrl })} placeholder="https://..." />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-300">Category</span>
                  <select className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20" value={contributionForm.category} onChange={(e) => setContributionForm({ ...contributionForm, category: e.target.value })}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <GeneratedRecordIdBlock value={contributionForm.contributionId} onRegenerate={regenerateContributionId} />
                <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Advanced: custom contribution ID</summary>
                  <p className="mt-3 text-sm text-zinc-500">Only use this for demos or debugging. IDs must be unique in the current chain state.</p>
                  <div className="mt-4 space-y-3">
                    <Input label="Custom contribution ID" value={customContributionId} onChange={setCustomContributionId} placeholder="pharos-guide-v1" />
                    <Button variant="secondary" disabled={!customContributionId.trim()} onClick={useCustomContributionId}>Use custom ID</Button>
                  </div>
                </details>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled={postDisabled} onClick={postContribution}>Post proof-of-work</Button>
                  <Button to="/repuring/circles" variant="secondary">Change community</Button>
                  <Badge tone="zinc">CreateContributionTx</Badge>
                </div>
                <p className="text-sm text-zinc-500">{postHelp}</p>
              </div>
            )}
          </Panel>

          <Panel>
            <SectionHeader eyebrow="Filters" title="Browse contribution categories" copy="These chips filter the already-loaded feed locally." />
            <div className="flex flex-wrap gap-2">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setFilter(chip)}
                  aria-pressed={filter === chip}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 ${filter === chip ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100' : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/[0.08]'}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <Panel className="h-fit">
          <SectionHeader
            eyebrow={circleId || 'Select a circle'}
            title="Contribution feed"
            copy="Each card reflects contribution state returned by RPC: author, proof, category, endorsement count, and active/slashed status."
          />
          {contributions.length > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing <span className="font-semibold text-white">{visibleContributions.length}</span> of{' '}
                <span className="font-semibold text-white">{filteredContributions.length}</span> contribution{filteredContributions.length === 1 ? '' : 's'}
                {filter !== 'all' && <span className="text-zinc-500"> filtered from {contributions.length}</span>}
              </span>
              {hasMoreContributions && (
                <Button variant="secondary" onClick={() => setVisibleLimit((limit) => limit + 10)}>Show more</Button>
              )}
            </div>
          )}
          {contributions.length === 0 ? (
            <EmptyState
              title="No contributions yet"
              copy="No proof-of-work has been posted in this community yet."
              actions={emptyFeedAction()}
            />
          ) : visibleContributions.length === 0 ? (
            <EmptyState
              title="No contributions match this category"
              copy="The current community has contributions, but none match the selected category filter."
              actions={<Button variant="secondary" onClick={() => setFilter('all')}>Clear filter</Button>}
            />
          ) : (
            <div className="grid gap-4">
              {visibleContributions.map((item) => {
                const selected = selectedContributionId === item.contributionId;
                const reviews = endorsements.filter((endorsement) => endorsement.contributionId === item.contributionId && (!endorsement.circleId || endorsement.circleId === item.circleId));
                return (
                  <ContributionCard
                    key={item.contributionId}
                    contribution={item}
                    selected={selected}
                    reviews={<ContributionReviews endorsements={reviews} />}
                    actions={reviewAction(item, selected)}
                  />
                );
              })}
            </div>
          )}
        </Panel>
      </section>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}

function postingStatus(currentAddress: string, hasProfile: boolean, hasCircle: boolean, isMember: boolean) {
  if (!currentAddress) return 'Select wallet';
  if (!hasProfile) return 'Create profile';
  if (!hasCircle) return 'No community';
  if (!isMember) return 'Join first';
  return 'Ready';
}

function slugifyContributionTitle(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'contribution';
}

function generateContributionId(circleId: string, title: string): string {
  const circleSlug = slugifyContributionTitle(circleId || 'circle');
  const titleSlug = slugifyContributionTitle(title);
  const suffix = Date.now().toString(36).slice(-6);
  return `${circleSlug}-${titleSlug}-${suffix}`;
}

function failureNoticeForStatus(status: string): string {
  const value = status.toLowerCase();
  if (value.includes('contribution') && value.includes('exists')) {
    return 'This contribution record ID already exists. Regenerate ID and try again.';
  }
  if (value.includes('member')) return 'Join this community before posting.';
  if (value.includes('circle') && (value.includes('not found') || value.includes('does not exist'))) {
    return 'Current community could not be found. Reopen it from Community or Circles.';
  }
  return 'Contribution could not be submitted. Check transaction status below. If the record ID already exists, regenerate ID and try again.';
}
