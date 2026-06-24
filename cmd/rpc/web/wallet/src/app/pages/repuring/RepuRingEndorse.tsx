import React from 'react';
import { ActiveWalletBanner, Badge, Button, CategoryBadge, CommunityContextCard, ConfirmationPanel, ContributionCard, ContributionReviews, EmptyState, Input, MetricCard, PageHeader, Panel, RepuRingPage, ReviewCard, SectionHeader, StatusPill, TxStatusCard, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { useRepuRing } from './useRepuRing';

const tags = ['builder', 'helper', 'creator', 'leader', 'trusted'];

export default function RepuRingEndorse(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    circleId,
    circle,
    profile,
    targetAddress,
    setTargetAddress,
    contributions,
    selectedContributionId,
    setSelectedContributionId,
    endorse,
    setEndorse,
    endorsements,
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();
  const [legacyOpen, setLegacyOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const targetIsMember = Boolean(targetAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(targetAddress)));
  const selectedContribution = contributions.find((item) => item.contributionId === selectedContributionId) || null;
  const selectedAuthorIsSelf = Boolean(selectedContribution && cleanHex(selectedContribution.authorAddress) === cleanHex(currentAddress));
  const selectedReviews = selectedContribution ? endorsements.filter((item) => item.contributionId === selectedContribution.contributionId && (!item.circleId || item.circleId === selectedContribution.circleId)) : [];
  const currentReviewerEndorsement = selectedContribution
    ? endorsements.find((item) =>
      item.contributionId === selectedContribution.contributionId &&
        (!item.circleId || item.circleId === selectedContribution.circleId) &&
        currentAddress &&
        cleanHex(item.fromAddress) === cleanHex(currentAddress) &&
        !item.slashed
    ) || null
    : null;
  const alreadyEndorsed = Boolean(currentReviewerEndorsement);
  const selectedReviewState = selectedContribution ? contributionReviewState(selectedContribution, selectedAuthorIsSelf, alreadyEndorsed) : { label: 'No selection', tone: 'warning' as const };
  const endorseDisabled = !currentAddress || !profile || !selectedContribution || !isMember || selectedAuthorIsSelf || Boolean(selectedContribution?.slashed) || alreadyEndorsed || !password || !endorse.tag.trim() || !endorse.message.trim();
  const endorseHelp = !selectedContribution
    ? 'Select a contribution first.'
    : !currentAddress
      ? 'Select a wallet before reviewing contribution work.'
      : !profile
        ? 'Create a profile before reviewing contribution work.'
        : !isMember
          ? 'Join the circle before endorsing.'
          : selectedAuthorIsSelf
            ? 'Switch to another member wallet to endorse this contribution.'
            : selectedContribution.slashed
              ? 'This contribution is slashed and cannot be endorsed.'
              : alreadyEndorsed
                ? 'You already endorsed this contribution. Onchain endorsements cannot be self-cancelled in this protocol; a circle creator can moderate bad endorsements.'
                : !password
                  ? 'Enter the selected wallet password to sign EndorseContributionTx.'
                  : !endorse.tag.trim()
                    ? 'Choose an endorsement tag.'
                    : !endorse.message.trim()
                      ? 'Write a review message before continuing.'
                      : 'Ready to review and confirm this endorsement.';

  async function confirmEndorsement() {
    if (!selectedContribution) return;
    const ok = await submit('endorseContribution', { contributionId: selectedContribution.contributionId, ...endorse });
    if (ok) {
      setConfirmOpen(false);
      setSuccessMessage('Endorsement submitted. The review is now visible under this contribution.');
      await refreshState();
    }
  }

  React.useEffect(() => {
    setConfirmOpen(false);
    setSuccessMessage('');
  }, [selectedContributionId, currentAddress]);

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Review Work"
        title="Review and endorse useful work"
        copy="Inspect another community member's proof-of-work, write a peer review, and submit one onchain endorsement."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh work</Button>}
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
        actions={<Button to="/repuring/community" variant="secondary">Change community</Button>}
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Panel>
            <SectionHeader
              eyebrow="Selected contribution"
              title={selectedContribution?.title || 'Choose work to endorse'}
              copy="A valid peer endorsement gives +1 global reputation to the contribution author after Canopy state refresh."
              actions={<StatusPill tone={selectedReviewState.tone}>{selectedReviewState.label}</StatusPill>}
            />
            {selectedAuthorIsSelf && (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-medium leading-6 text-amber-100">
                Switch to another circle member account to endorse this proof. The contribution author cannot self-endorse.
              </div>
            )}
            {alreadyEndorsed && currentReviewerEndorsement && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
                <p className="font-semibold">You already endorsed this work.</p>
                <p>You already endorsed this work. Your review is visible below. Endorsements cannot be self-cancelled in the MVP protocol.</p>
                <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-zinc-300">
                  <div>Tag <span className="font-semibold text-white">{currentReviewerEndorsement.tag || 'Not tagged'}</span></div>
                  <div>Message <span className="break-words text-white">{currentReviewerEndorsement.message || 'No message'}</span></div>
                  <div>Endorsement ID <span className="break-all font-mono text-white">{currentReviewerEndorsement.endorsementId}</span></div>
                  <div>Status <StatusPill tone={currentReviewerEndorsement.slashed ? 'danger' : 'success'}>{currentReviewerEndorsement.slashed ? 'Slashed' : 'Active'}</StatusPill></div>
                </div>
              </div>
            )}
            {selectedContribution ? (
              <ContributionCard
                contribution={selectedContribution}
                selected
                reviews={<ContributionReviews endorsements={selectedReviews} emptyCopy="No reviews yet. Endorse this contribution from another member account to add the first review/comment." />}
              />
            ) : (
              <EmptyState
                title="No contribution selected"
                copy="Choose a proof below or open the proof-of-work feed. Endorsements must come from another circle member, not the contribution author."
                actions={<Button to="/repuring/contributions" variant="secondary">Browse proof-of-work feed</Button>}
              />
            )}
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Peer validation"
              title="Write a contribution endorsement"
              copy="Use another community member wallet, enter its signing password, then explain why this work helps the community."
              actions={<Badge tone="zinc">EndorseContributionTx</Badge>}
            />
            <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-300">Tag</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setEndorse({ ...endorse, tag })}
                    aria-pressed={endorse.tag === tag}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 ${endorse.tag === tag ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100' : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/[0.08]'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <Input label="Review message" value={endorse.message} onChange={(message) => setEndorse({ ...endorse, message })} multiline />
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button disabled={endorseDisabled} className="w-full sm:w-auto" onClick={() => { if (endorseDisabled) return; setSuccessMessage(''); setConfirmOpen(true); }}>
                Submit peer review
              </Button>
              <Badge tone="zinc">EndorseContributionTx</Badge>
            </div>
            <p className="text-sm text-zinc-500">{endorseHelp}</p>
            {successMessage && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-medium leading-6 text-emerald-100">
                {successMessage}
              </div>
            )}
            {confirmOpen && selectedContribution && (
              <ConfirmationPanel
                eyebrow="Confirm endorsement"
                title="Confirm peer review"
                copy="This endorsement is an onchain attestation. After confirmation, you cannot self-cancel it in the current MVP protocol. Only the circle creator/admin can moderate invalid endorsements."
                actions={(
                  <>
                    <Button onClick={confirmEndorsement}>Confirm endorsement</Button>
                    <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                  </>
                )}
              >
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <ConfirmRow label="Contribution" value={selectedContribution.title || selectedContribution.contributionId} />
                  <ConfirmRow label="Contribution ID" value={selectedContribution.contributionId} mono />
                  <ConfirmRow label="Author" value={selectedContribution.authorUsername || shortAddress(selectedContribution.authorAddress) || selectedContribution.authorAddress} />
                  <ConfirmRow label="Community" value={circle?.name || selectedContribution.circleId} />
                  <ConfirmRow label="Circle ID" value={circle?.circleId || selectedContribution.circleId || circleId} mono />
                  <ConfirmRow label="Tag" value={endorse.tag} />
                  <ConfirmRow label="Reviewer wallet" value={shortAddress(currentAddress) || currentAddress} mono />
                  <div className="md:col-span-2">
                    <ConfirmRow label="Review message" value={endorse.message} />
                  </div>
                  <ConfirmRow label="Reputation impact" value="+1 global reputation to author" />
                </div>
              </ConfirmationPanel>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <SectionHeader eyebrow="Endorsement readiness" title="Onchain validation checklist" copy="The selected wallet must be another active circle member, and the contribution must be active." />
            <div className="grid gap-3">
              <Rule checked={isMember} text="Selected endorser wallet is a member of this circle." />
              <Rule checked={Boolean(selectedContribution)} text="A contribution proof exists and is selected for review." />
              <Rule checked={!selectedAuthorIsSelf && Boolean(selectedContribution)} text="Selected wallet belongs to another member, not the contribution author." />
              <Rule checked={Boolean(selectedContribution && !selectedContribution.slashed)} text="Contribution is active and has not been slashed." />
              <Rule checked={Boolean(selectedContribution && !alreadyEndorsed)} text="Current wallet has not already endorsed this contribution." />
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow={circleId || 'Current community'}
              title="Contribution selector"
              copy="Pick work to review in the current community context."
              actions={<Button to="/repuring/community" variant="secondary">Change community</Button>}
            />
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <MetricCard label="Community" value={circle?.name || 'No community selected'} detail={circle?.description || 'Open a joined community before reviewing work.'} tone="cyan" />
              <MetricCard label="Circle ID" value={circle?.circleId || circleId || 'Not selected'} detail="Current community context for contribution reviews." />
              <MetricCard label="Members" value={String(circle?.members?.length || 0)} detail="Joined wallets in this community." tone="emerald" />
              <MetricCard label="Wallet status" value={isMember ? 'Joined' : currentAddress ? 'Not joined' : 'No wallet'} detail={isMember ? 'Current wallet can review eligible work.' : 'Change or join a community before reviewing.'} />
            </div>
            {contributions.length === 0 ? (
              <EmptyState
                title="No contribution proofs loaded"
                copy="Post the first proof-of-work in this circle, then return with another member wallet to endorse it."
                actions={<Button to="/repuring/contributions" variant="secondary">Post proof-of-work</Button>}
              />
            ) : (
              <div className="grid gap-3">
                {contributions.map((item) => {
                  const itemOwnWork = Boolean(currentAddress && cleanHex(item.authorAddress) === cleanHex(currentAddress));
                  const itemAlreadyEndorsed = Boolean(currentAddress && endorsements.some((endorsement) =>
                    endorsement.contributionId === item.contributionId &&
                    (!endorsement.circleId || endorsement.circleId === item.circleId) &&
                    cleanHex(endorsement.fromAddress) === cleanHex(currentAddress) &&
                    !endorsement.slashed
                  ));
                  const itemState = contributionReviewState(item, itemOwnWork, itemAlreadyEndorsed);
                  return (
                    <button
                      key={item.contributionId}
                      type="button"
                      onClick={() => setSelectedContributionId(item.contributionId)}
                      aria-pressed={item.contributionId === selectedContributionId}
                      className={`min-w-0 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 ${item.contributionId === selectedContributionId ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-black/25 hover:bg-white/[0.08]'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 break-words font-semibold text-white">{item.title}</span>
                        <div className="flex flex-wrap gap-2">
                          <CategoryBadge category={item.category} />
                          <StatusPill tone={itemState.tone}>{itemState.label}</StatusPill>
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 break-words text-sm text-zinc-400">{item.description}</p>
                      <p className="mt-3 text-xs text-zinc-500">Author <span className="font-mono text-zinc-300">{item.authorUsername || shortAddress(item.authorAddress)}</span></p>
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      </section>

      <Panel>
        <SectionHeader eyebrow="Plugin state" title="Recent endorsements" copy="Records returned for the selected circle or current profile, including active and slashed status." />
        {endorsements.length === 0 ? (
          <EmptyState
            title="No endorsements yet"
            copy="Select a contribution and endorse it from another circle member account. Self-endorsement is rejected onchain."
            actions={<Button to="/repuring/contributions" variant="secondary">Choose contribution</Button>}
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {endorsements.map((item) => (
              <ReviewCard key={item.endorsementId} review={item} />
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Advanced / Legacy"
          title="Legacy direct user endorsement"
          copy="Main RepuRing reputation should come from contribution reviews. This legacy path is kept for compatibility."
          actions={<Button variant="secondary" onClick={() => setLegacyOpen((open) => !open)}>{legacyOpen ? 'Hide legacy' : 'Open legacy'}</Button>}
        />
        {legacyOpen && (
          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
            <Input label="Target address" value={targetAddress} onChange={setTargetAddress} placeholder="Hex address of another circle member" />
            <StatusPill tone={targetIsMember ? 'success' : 'neutral'}>{targetIsMember ? 'Target is member' : 'Membership not confirmed'}</StatusPill>
            <div className="flex flex-wrap items-center gap-3"><Button variant="secondary" onClick={() => { void submit('endorseUser', { circleId, targetAddress, ...endorse }); }}>Endorse member (legacy)</Button><Badge tone="zinc">EndorseUserTx</Badge></div>
          </div>
        )}
      </Panel>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}

function Rule({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div className={`rounded-2xl border p-4 text-sm ${checked ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/[0.03] text-zinc-400'}`}>
      {checked ? 'Ready' : 'Check'} - {text}
    </div>
  );
}

function ConfirmRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs font-semibold uppercase text-zinc-500">{label}</p>
      <p className={`mt-1 break-words text-sm text-zinc-100 ${mono ? 'font-mono' : ''}`}>{value || 'Not provided'}</p>
    </div>
  );
}

function contributionReviewState(
  contribution: { slashed?: boolean },
  ownWork: boolean,
  alreadyEndorsed: boolean
): { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' } {
  if (contribution.slashed) return { label: 'Slashed', tone: 'danger' };
  if (ownWork) return { label: 'Own work', tone: 'warning' };
  if (alreadyEndorsed) return { label: 'Already endorsed', tone: 'neutral' };
  return { label: 'Ready to review', tone: 'success' };
}
