import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveWalletBanner, AvatarFallback, Badge, Button, CategoryBadge, ContributionReviews, EmptyState, Input, MetricCard, PageHeader, Panel, RepuRingPage, SectionHeader, SocialCard, StatusPill, TxStatusCard, shortAddress } from './components';
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
    setCircleId,
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
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const visibleContributions = filter === 'all' ? contributions : contributions.filter((item) => item.category === filter);
  const postDisabled = !currentAddress || !profile || !circle || !isMember || !password || !contributionForm.contributionId.trim() || !contributionForm.title.trim();
  const postHelp = !currentAddress
    ? 'Select a wallet in My Account.'
      : !profile
        ? 'Create your profile before posting proof-of-work.'
        : !circle
        ? 'Open or join a project community before posting proof-of-work.'
        : !isMember
          ? 'Join the current community before posting.'
          : !password
            ? 'Enter the selected wallet password to sign CreateContributionTx.'
            : !contributionForm.contributionId.trim()
              ? 'Enter a contribution ID for this proof-of-work.'
              : !contributionForm.title.trim()
                ? 'Enter a title for this proof-of-work.'
                : 'Ready to post proof-of-work.';

  async function postContribution() {
    if (!circle) return;
    const ok = await submit('createContribution', { circleId: circle.circleId, ...contributionForm });
    if (ok) {
      await refreshState();
      setComposerOpen(false);
    }
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
    if (ownWork) return <p className="text-sm font-medium text-zinc-400">Own work - another member can review</p>;
    if (item.slashed) return <p className="text-sm font-medium text-zinc-400">Review disabled</p>;
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
        eyebrow="Contribution feed"
        title="Project Contribution Feed"
        copy="A contribution is a proof-of-work post stored for the selected project circle. Peer endorsements increase the author's profile reputation."
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

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <Panel>
            <SectionHeader
              eyebrow="Composer"
              title="Post proof-of-work"
              copy="Publish proof-of-work in the current project community after your wallet has joined it."
              actions={composerAction()}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Community" value={circle?.name || 'No community selected'} detail={circle?.description || 'Open or join a project community from Discover communities.'} tone="cyan" />
              <MetricCard label="Circle ID" value={circle?.circleId || circleId || 'Not selected'} detail="Current community context for new contribution proofs." />
              <MetricCard label="Members" value={String(circle?.members?.length || 0)} detail="Joined wallets in this community." tone="emerald" />
              <MetricCard label="Posting status" value={postingStatus(currentAddress, Boolean(profile), Boolean(circle), isMember)} detail={postHelp} tone={isMember ? 'emerald' : 'neutral'} />
            </div>
            {composerOpen && (
              <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
                <Input label="Contribution ID" value={contributionForm.contributionId} onChange={(contributionId) => setContributionForm({ ...contributionForm, contributionId })} placeholder="pharos-guide-v1" />
                <Input label="Title" value={contributionForm.title} onChange={(title) => setContributionForm({ ...contributionForm, title })} placeholder="Wrote Pharos testnet guide" />
                <Input label="Description" value={contributionForm.description} onChange={(description) => setContributionForm({ ...contributionForm, description })} multiline />
                <Input label="Proof URL" value={contributionForm.proofUrl} onChange={(proofUrl) => setContributionForm({ ...contributionForm, proofUrl })} placeholder="https://..." />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-300">Category</span>
                  <select className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20" value={contributionForm.category} onChange={(e) => setContributionForm({ ...contributionForm, category: e.target.value })}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled={postDisabled} onClick={postContribution}>Post proof-of-work</Button>
                  <Badge tone="zinc">CreateContributionTx</Badge>
                </div>
                <p className="text-sm text-zinc-500">{postHelp}</p>
                <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Advanced: change current circle ID</summary>
                  <div className="mt-4">
                    <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">Advanced only. Changing this ID switches the current context after refresh. Normal users should change communities from Discover communities.</p>
                </details>
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
                  <SocialCard key={item.contributionId} selected={selected}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <AvatarFallback label={item.authorUsername || item.authorAddress} />
                        <div className="min-w-0">
                          <p className="break-words font-semibold text-white">{item.authorUsername || shortAddress(item.authorAddress)}</p>
                          <p className="font-mono text-xs text-zinc-500">{shortAddress(item.authorAddress)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <CategoryBadge category={item.category} />
                        <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                      </div>
                    </div>
                    <h3 className="mt-5 break-words text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 break-words text-sm leading-6 text-zinc-300">{item.description || 'No description provided.'}</p>
                    <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                      <div className="flex min-w-0 flex-wrap justify-between gap-2">
                        <span className="text-zinc-500">Proof</span>
                        {item.proofUrl ? (
                          <a className="break-all font-mono text-cyan-200 underline-offset-4 hover:underline" href={item.proofUrl} title={item.proofUrl} target="_blank" rel="noreferrer">{proofLabel(item.proofUrl)}</a>
                        ) : (
                          <span className="text-zinc-500">No proof URL provided</span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-wrap justify-between gap-2">
                        <span className="text-zinc-500">Endorsements</span>
                        <Badge>{item.endorsementCount}</Badge>
                      </div>
                      <div className="flex min-w-0 flex-wrap justify-between gap-2">
                        <span className="shrink-0 text-zinc-500">Contribution ID</span>
                        <span className="min-w-0 break-all font-mono text-xs text-zinc-300">{item.contributionId}</span>
                      </div>
                    </div>
                    <ContributionReviews endorsements={reviews} />
                    <div className="mt-5">
                      {reviewAction(item, selected)}
                    </div>
                  </SocialCard>
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
