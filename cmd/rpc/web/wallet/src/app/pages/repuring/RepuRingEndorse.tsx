import React from 'react';
import { AvatarFallback, Badge, Button, CategoryBadge, EmptyState, Input, PageHeader, Panel, RepuRingPage, SectionHeader, SocialCard, StatusPill, TxStatusCard, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { useRepuRing } from './useRepuRing';

const tags = ['builder', 'helper', 'creator', 'leader', 'trusted'];

export default function RepuRingEndorse(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    circleId,
    setCircleId,
    circle,
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
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const targetIsMember = Boolean(targetAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(targetAddress)));
  const selectedContribution = contributions.find((item) => item.contributionId === selectedContributionId) || null;
  const selectedAuthorIsSelf = Boolean(selectedContribution && cleanHex(selectedContribution.authorAddress) === cleanHex(currentAddress));

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Contribution review"
        title="Endorse Useful Work"
        copy="Review proof-of-work from another circle member. The author cannot endorse their own proof; use a second member wallet for EndorseContributionTx."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh work</Button>}
      />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Panel>
            <SectionHeader
              eyebrow="Selected contribution"
              title={selectedContribution?.title || 'Choose work to endorse'}
              copy="Peer validation through EndorseContributionTx increases the author's profile reputation by 1 after commit."
              actions={<StatusPill tone={!selectedContribution ? 'warning' : selectedAuthorIsSelf ? 'danger' : 'success'}>{!selectedContribution ? 'No selection' : selectedAuthorIsSelf ? 'Own work' : 'Review ready'}</StatusPill>}
            />
            {selectedAuthorIsSelf && (
              <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-medium leading-6 text-amber-100">
                Switch to another circle member account to endorse this proof. The contribution author cannot self-endorse.
              </div>
            )}            {selectedContribution ? (
              <SocialCard selected>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <AvatarFallback label={selectedContribution.authorUsername || selectedContribution.authorAddress} />
                    <div>
                      <p className="break-words font-semibold text-white">{selectedContribution.authorUsername || shortAddress(selectedContribution.authorAddress)}</p>
                      <p className="font-mono text-xs text-zinc-500">{shortAddress(selectedContribution.authorAddress)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <CategoryBadge category={selectedContribution.category} />
                    <Badge>{selectedContribution.endorsementCount} endorsements</Badge>
                  </div>
                </div>
                <p className="mt-4 break-words text-sm leading-6 text-zinc-300">{selectedContribution.description || 'No description provided.'}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                  <p className="text-zinc-500">Proof URL</p>
                  {selectedContribution.proofUrl ? (
                    <a href={selectedContribution.proofUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all font-mono text-cyan-200 underline-offset-4 hover:underline">{selectedContribution.proofUrl}</a>
                  ) : (
                    <p className="mt-2 text-zinc-400">No proof URL provided.</p>
                  )}
                </div>
              </SocialCard>
            ) : (
              <EmptyState
                title="No contribution selected"
                copy="Choose a proof below or open the Contribution Feed. Endorsements must come from another circle member, not the contribution author."
                actions={<Button to="/repuring/contributions" variant="secondary">Browse contribution feed</Button>}
              />
            )}
          </Panel>

          <Panel>
            <SectionHeader
              eyebrow="Peer validation"
              title="Write a contribution endorsement"
              copy="Use another circle member wallet, enter its signing password, then explain why this work helps the project."
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
              <Button className="w-full sm:w-auto" onClick={() => { void submit('endorseContribution', { contributionId: selectedContributionId, ...endorse }); }}>
                Endorse contribution
              </Button>
              <Badge tone="zinc">EndorseContributionTx</Badge>
            </div>
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
            </div>
          </Panel>

          <Panel>
            <SectionHeader eyebrow={circleId || 'Select circle'} title="Contribution selector" copy="Pick work to review without leaving this page." />
            <Input label="Circle ID" value={circleId} onChange={setCircleId} />
            {contributions.length === 0 ? (
              <EmptyState
                title="No contribution proofs loaded"
                copy="Post the first proof-of-work in this circle, then return with another member wallet to endorse it."
                actions={<Button to="/repuring/contributions" variant="secondary">Post proof-of-work</Button>}
              />
            ) : (
              <div className="grid gap-3">
                {contributions.map((item) => (
                  <button
                    key={item.contributionId}
                    type="button"
                    onClick={() => setSelectedContributionId(item.contributionId)}
                    aria-pressed={item.contributionId === selectedContributionId}
                    className={`min-w-0 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 ${item.contributionId === selectedContributionId ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-black/25 hover:bg-white/[0.08]'}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="min-w-0 break-words font-semibold text-white">{item.title}</span>
                      <CategoryBadge category={item.category} />
                    </div>
                    <p className="mt-2 line-clamp-2 break-words text-sm text-zinc-400">{item.description}</p>
                    <p className="mt-3 text-xs text-zinc-500">Author <span className="font-mono text-zinc-300">{item.authorUsername || shortAddress(item.authorAddress)}</span></p>
                  </button>
                ))}
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
              <SocialCard key={item.endorsementId}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge>{item.tag}</Badge>
                  <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                </div>
                <p className="mt-3 break-words text-sm leading-6 text-zinc-300">{item.message || 'No message'}</p>
                <div className="mt-4 grid gap-2 text-xs text-zinc-500">
                  {item.contributionId && <div>Contribution <span className="break-all font-mono text-zinc-300">{item.contributionId}</span></div>}
                  <div>From <span className="font-mono text-zinc-300">{shortAddress(item.fromAddress)}</span></div>
                  <div>Target <span className="font-mono text-zinc-300">{shortAddress(item.targetAddress)}</span></div>
                  <div>ID <span className="break-all font-mono text-zinc-300">{item.endorsementId}</span></div>
                </div>
              </SocialCard>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Advanced / Legacy"
          title="Member endorsement compatibility"
          copy="EndorseUserTx remains available for backward compatibility; the main product flow is contribution-based."
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
