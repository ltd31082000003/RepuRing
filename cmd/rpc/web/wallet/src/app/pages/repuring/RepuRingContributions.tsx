import React from 'react';
import { AvatarFallback, Badge, Button, CategoryBadge, EmptyState, Input, MetricCard, PageHeader, Panel, RepuRingPage, SectionHeader, SocialCard, StatusPill, TxStatusCard, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { useRepuRing } from './useRepuRing';

const categories = ['builder', 'helper', 'creator', 'researcher', 'tester', 'educator'];
const filterChips = ['all', ...categories];

export default function RepuRingContributions(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    circleId,
    setCircleId,
    circle,
    contributionForm,
    setContributionForm,
    contributions,
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

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Contribution feed"
        title="Project Contribution Feed"
        copy="A contribution is a proof-of-work post stored for the selected project circle. Peer endorsements increase the author's profile reputation."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh feed</Button>}
      />

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <Panel>
            <SectionHeader
              eyebrow="Composer"
              title="Post proof-of-work"
              copy="Publish proof-of-work with a selected wallet that has already joined this project circle."
              actions={<Button onClick={() => setComposerOpen((open) => !open)}>{composerOpen ? 'Close composer' : 'Create Contribution'}</Button>}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Circle" value={circle?.name || circleId || 'Not selected'} detail={circle?.description || 'Select or create a project circle.'} tone="cyan" />
              <MetricCard label="Posting status" value={isMember ? 'Ready' : 'Join first'} detail={isMember ? 'Selected account is a circle member.' : 'Join the circle before posting contribution proofs.'} tone={isMember ? 'emerald' : 'neutral'} />
            </div>
            {composerOpen && (
              <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
                <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
                <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
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
                  <Button onClick={() => { void submit('createContribution', { circleId, ...contributionForm }); }}>Post proof-of-work</Button>
                  <Badge tone="zinc">CreateContributionTx</Badge>
                </div>
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
          {visibleContributions.length === 0 ? (
            <EmptyState
              title="No contributions yet"
              copy="Be the first member to post proof-of-work for this project. A profile, circle membership, selected wallet, and signing password are required."
              actions={<Button onClick={() => setComposerOpen(true)}>Post first proof-of-work</Button>}
            />
          ) : (
            <div className="grid gap-4">
              {visibleContributions.map((item) => {
                const selected = selectedContributionId === item.contributionId;
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
                          <a className="break-all font-mono text-cyan-200 underline-offset-4 hover:underline" href={item.proofUrl} target="_blank" rel="noreferrer">External proof link</a>
                        ) : (
                          <span className="text-zinc-500">Not provided</span>
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
                    <div className="mt-5">
                      <Button variant={selected ? 'primary' : 'secondary'} className="w-full sm:w-auto" onClick={() => setSelectedContributionId(item.contributionId)}>
                        {selected ? 'Selected for Endorsement' : 'Select for Endorsement'}
                      </Button>
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
