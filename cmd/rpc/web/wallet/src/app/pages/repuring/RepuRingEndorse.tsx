import React from 'react';
import { Badge, Button, EmptyState, Input, PageHeader, Panel, RepuRingPage, StatusPill, TxStatusCard, shortAddress } from './components';
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
  const isMember = Boolean(currentAddress && circle?.members?.includes(currentAddress));
  const targetIsMember = Boolean(targetAddress && circle?.members?.includes(targetAddress.toLowerCase()));
  const selectedContribution = contributions.find((item) => item.contributionId === selectedContributionId) || null;
  const selectedAuthorIsSelf = Boolean(selectedContribution && selectedContribution.authorAddress === currentAddress);

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Endorse"
        title="Endorse useful contributions."
        copy="Endorse this contribution and increase the author's reputation. EndorseContributionTx links trust directly to proof-of-work inside a project community."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Panel title="Circle Status" eyebrow={circleId || 'Circle required'}>
            <Input label="Circle ID" value={circleId} onChange={setCircleId} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Current account</p>
                <p className="mt-2 font-mono text-sm text-zinc-200">{shortAddress(currentAddress) || 'No key selected'}</p>
                <div className="mt-3"><StatusPill tone={isMember ? 'success' : 'warning'}>{isMember ? 'Circle member' : 'Join circle first'}</StatusPill></div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Selected contribution</p>
                <p className="mt-2 font-mono text-sm text-zinc-200">{selectedContribution ? selectedContribution.contributionId : 'None selected'}</p>
                <div className="mt-3">
                  <StatusPill tone={!selectedContribution ? 'warning' : selectedAuthorIsSelf ? 'danger' : 'success'}>
                    {!selectedContribution ? 'Pick a proof' : selectedAuthorIsSelf ? 'Cannot self-endorse' : 'Ready to endorse'}
                  </StatusPill>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Choose Contribution" eyebrow="Contribution selector">
            {contributions.length === 0 ? (
              <EmptyState title="No contribution proofs loaded" copy="Post a contribution on the Contribution Board or refresh after selecting a circle." />
            ) : (
              <div className="grid gap-3">
                {contributions.map((item) => {
                  const selected = item.contributionId === selectedContributionId;
                  return (
                    <button
                      key={item.contributionId}
                      type="button"
                      onClick={() => setSelectedContributionId(item.contributionId)}
                      className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-black/25 hover:bg-white/[0.08]'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-white">{item.title}</span>
                        <span className="flex gap-2">
                          <Badge>{item.category}</Badge>
                          <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{item.description}</p>
                      <p className="mt-3 text-xs text-zinc-500">Author <span className="font-mono text-zinc-300">{item.authorUsername || shortAddress(item.authorAddress)}</span></p>
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Endorse Contribution" eyebrow="EndorseContributionTx">
            {selectedContribution && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <p className="font-semibold text-white">{selectedContribution.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{selectedContribution.description}</p>
                <p className="mt-2 break-all text-xs text-zinc-500">Proof: <span className="font-mono text-zinc-300">{selectedContribution.proofUrl || 'not provided'}</span></p>
              </div>
            )}
            <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">Tag</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20" value={endorse.tag} onChange={(e) => setEndorse({ ...endorse, tag: e.target.value })}>
                {tags.map((tag) => <option key={tag}>{tag}</option>)}
              </select>
            </label>
            <Input label="Reason" value={endorse.message} onChange={(message) => setEndorse({ ...endorse, message })} multiline />
            <Button onClick={() => { void submit('endorseContribution', { contributionId: selectedContributionId, ...endorse }); }}>Submit EndorseContributionTx</Button>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Validation Rules" eyebrow="Onchain checks">
            <div className="grid gap-3">
              {[
                'You cannot endorse your own contribution.',
                'The contribution must exist and must not be slashed.',
                'The endorser must have a profile and be a member of the contribution circle.',
                'Only one endorsement per sender per contribution is allowed.',
              ].map((rule) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300" key={rule}>{rule}</div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Contribution Endorsements" eyebrow="Current account or selected circle">
            {endorsements.length === 0 ? (
              <EmptyState title="No endorsements yet" copy="Post a contribution, then submit EndorseContributionTx from another member to populate this feed." />
            ) : (
              <div className="grid gap-3">
                {endorsements.map((item) => (
                  <div key={item.endorsementId} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone="emerald">{item.tag}</Badge>
                      <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{item.message || 'No message'}</p>
                    <div className="mt-4 grid gap-2 text-xs text-zinc-500">
                      {item.contributionId && <div>Contribution <span className="font-mono text-zinc-300">{item.contributionId}</span></div>}
                      <div>From <span className="font-mono text-zinc-300">{shortAddress(item.fromAddress)}</span></div>
                      <div>Target <span className="font-mono text-zinc-300">{shortAddress(item.targetAddress)}</span></div>
                      <div>ID <span className="break-all font-mono text-zinc-300">{item.endorsementId}</span></div>
                      {item.slashed && <div className="text-red-300">Reason: {item.slashReason || 'not provided'}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Legacy Member Endorsement" eyebrow="EndorseUserTx compatibility">
            <p className="text-sm leading-6 text-zinc-400">This keeps the original contest transaction available, but the main Social-Fi flow now endorses contribution proofs.</p>
            <Input label="Target address" value={targetAddress} onChange={setTargetAddress} placeholder="Hex address of another circle member" />
            <div><StatusPill tone={targetIsMember ? 'success' : 'neutral'}>{targetIsMember ? 'Target is member' : 'Membership not confirmed'}</StatusPill></div>
            <Button variant="secondary" onClick={() => { void submit('endorseUser', { circleId, targetAddress, ...endorse }); }}>Submit EndorseUserTx</Button>
          </Panel>
        </div>
      </div>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
