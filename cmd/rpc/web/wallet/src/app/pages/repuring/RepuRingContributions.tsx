import React from 'react';
import { Badge, Button, EmptyState, Input, PageHeader, Panel, RepuRingPage, StatusPill, TxStatusCard, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

const categories = ['builder', 'helper', 'creator', 'researcher', 'tester', 'educator'];

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
  const isMember = Boolean(currentAddress && circle?.members?.includes(currentAddress));

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Contribution Feed"
        title="Project Contribution Board"
        copy="Members post proof-of-work for a Web3 project community. Useful contributions can be endorsed onchain and turned into reputation."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh board</Button>}
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Panel title="Board Context" eyebrow="Project community">
            <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Selected project</p>
                <p className="mt-2 font-semibold text-white">{circle?.name || 'Circle not loaded'}</p>
                <p className="mt-1 text-sm text-zinc-400">{circle?.description || 'Create or load a circle first.'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Posting account</p>
                <p className="mt-2 font-mono text-sm text-zinc-200">{shortAddress(currentAddress) || 'No key selected'}</p>
                <div className="mt-3"><StatusPill tone={isMember ? 'success' : 'warning'}>{isMember ? 'Can post proof' : 'Join circle first'}</StatusPill></div>
              </div>
            </div>
          </Panel>

          <Panel title="Post Contribution Proof" eyebrow="CreateContributionTx">
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
            <Button onClick={() => submit('createContribution', { circleId, ...contributionForm })}>Submit CreateContributionTx</Button>
          </Panel>
        </div>

        <Panel title="Contribution Feed" eyebrow={circleId || 'Select a circle'} className="h-fit">
          {contributions.length === 0 ? (
            <EmptyState title="No contributions yet" copy="Create the first proof-of-work post for this project community, then endorse it from the Endorse page." />
          ) : (
            <div className="grid gap-4">
              {contributions.map((item) => {
                const selected = selectedContributionId === item.contributionId;
                return (
                  <article key={item.contributionId} className={`rounded-3xl border p-5 transition ${selected ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-black/25'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-zinc-400">by {item.authorUsername || shortAddress(item.authorAddress)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{item.category}</Badge>
                        <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-zinc-300">{item.description || 'No description provided.'}</p>
                    <div className="mt-4 grid gap-2 text-xs text-zinc-500">
                      <div>Proof <span className="break-all font-mono text-zinc-300">{item.proofUrl || 'optional proof URL not provided'}</span></div>
                      <div>Endorsements <span className="font-semibold text-emerald-200">{item.endorsementCount}</span></div>
                      <div>ID <span className="break-all font-mono text-zinc-300">{item.contributionId}</span></div>
                      <div>Author <span className="font-mono text-zinc-300">{shortAddress(item.authorAddress)}</span></div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button variant={selected ? 'primary' : 'secondary'} onClick={() => setSelectedContributionId(item.contributionId)}>
                        {selected ? 'Selected for endorsement' : 'Select for EndorseContributionTx'}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
