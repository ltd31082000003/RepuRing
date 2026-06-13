import React from 'react';
import { AddressList, Badge, Button, EmptyState, Input, PageHeader, Panel, RepuRingPage, StatusPill, TxStatusCard, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

export default function RepuRingCircles(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    profile,
    profileForm,
    setProfileForm,
    circleId,
    setCircleId,
    circleForm,
    setCircleForm,
    circle,
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Project community"
        title="Create and join Web3 project circles."
        copy="A project/community creates a circle, members join it, then contribution proofs and endorsements build reputation through real CreateCircleTx and JoinCircleTx transactions."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh</Button>}
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          {!profile && (
            <Panel title="Create Profile" eyebrow="CreateProfileTx">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                A profile is required before creating or joining a circle.
              </div>
              <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Used only for keystore signing" />
              <Input label="Username" value={profileForm.username} onChange={(username) => setProfileForm({ ...profileForm, username })} placeholder="alice_builder" />
              <Input label="Bio" value={profileForm.bio} onChange={(bio) => setProfileForm({ ...profileForm, bio })} placeholder="Pharos ecosystem contributor" multiline />
              <Input label="Avatar URL" value={profileForm.avatarUrl} onChange={(avatarUrl) => setProfileForm({ ...profileForm, avatarUrl })} placeholder="https://..." />
              <Button onClick={() => submit('createProfile', profileForm)}>Submit CreateProfileTx</Button>
            </Panel>
          )}

          <Panel title="Circle Controls" eyebrow="CreateCircleTx + JoinCircleTx">
            <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
            <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} />
            <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} multiline />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => submit('createCircle', { circleId, ...circleForm })}>CreateCircleTx</Button>
              <Button variant="secondary" onClick={() => submit('joinCircle', { circleId })}>JoinCircleTx</Button>
            </div>
          </Panel>
        </div>

        <Panel title="Current Circle" eyebrow={circle?.circleId || circleId || 'No circle selected'}>
          {circle ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{circle.name}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{circle.description || 'No description provided.'}</p>
                  </div>
                  <Badge>{circle.members?.length || 0} members</Badge>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Creator</p>
                    <p className="mt-2 font-mono text-sm text-zinc-200">{shortAddress(circle.creatorAddress)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Selected account</p>
                    <p className="mt-2 font-mono text-sm text-zinc-200">{shortAddress(currentAddress) || 'No key selected'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-white">Members</h3>
                <StatusPill tone={circle.members?.includes(currentAddress) ? 'success' : 'neutral'}>
                  {circle.members?.includes(currentAddress) ? 'You are a member' : 'Not joined'}
                </StatusPill>
              </div>
              <AddressList values={circle.members || []} />
            </>
          ) : (
            <EmptyState title="Circle not loaded" copy="Enter a circle ID, create a new circle, or refresh after a circle transaction commits." />
          )}
        </Panel>
      </div>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
