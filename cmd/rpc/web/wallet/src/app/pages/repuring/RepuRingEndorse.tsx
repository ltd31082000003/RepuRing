import React from 'react';
import { Badge, Button, EmptyState, Input, PageHeader, Panel, RepuRingPage, StatusPill, TxStatusCard, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

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

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Endorse"
        title="Send verifiable trust to circle members."
        copy="EndorseUserTx mints Social-Fi reputation by recording who vouched for whom, inside which onchain circle, and with what trust tag."
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
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Target account</p>
                <p className="mt-2 font-mono text-sm text-zinc-200">{shortAddress(targetAddress) || 'Missing target'}</p>
                <div className="mt-3"><StatusPill tone={targetIsMember ? 'success' : 'neutral'}>{targetIsMember ? 'Target is member' : 'Membership not confirmed'}</StatusPill></div>
              </div>
            </div>
          </Panel>

          <Panel title="Endorse Member" eyebrow="EndorseUserTx">
            <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <Input label="Target address" value={targetAddress} onChange={setTargetAddress} placeholder="Hex address of another circle member" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">Tag</span>
              <select className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/20" value={endorse.tag} onChange={(e) => setEndorse({ ...endorse, tag: e.target.value })}>
                {['builder', 'helper', 'creator', 'leader', 'trusted'].map((tag) => <option key={tag}>{tag}</option>)}
              </select>
            </label>
            <Input label="Message" value={endorse.message} onChange={(message) => setEndorse({ ...endorse, message })} multiline />
            <Button onClick={() => submit('endorseUser', { circleId, targetAddress, ...endorse })}>Submit EndorseUserTx</Button>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Validation Rules" eyebrow="Onchain checks">
            <div className="grid gap-3">
              {[
                'You cannot endorse yourself.',
                'Both accounts must have profiles.',
                'Both accounts must be members of the selected circle.',
                'Only one endorsement per target per circle is allowed.',
              ].map((rule) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300" key={rule}>{rule}</div>
              ))}
            </div>
          </Panel>

          <Panel title="Recent Endorsements" eyebrow="Current account or selected circle">
            {endorsements.length === 0 ? (
              <EmptyState title="No endorsements yet" copy="Create a circle, join with another account, then submit EndorseUserTx to populate this feed." />
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
                      <div>From <span className="font-mono text-zinc-300">{shortAddress(item.fromAddress)}</span></div>
                      <div>Target <span className="font-mono text-zinc-300">{shortAddress(item.targetAddress)}</span></div>
                      <div>ID <span className="font-mono text-zinc-300">{item.endorsementId}</span></div>
                      {item.slashed && <div className="text-red-300">Reason: {item.slashReason || 'not provided'}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
