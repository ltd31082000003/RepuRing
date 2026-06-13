import React from 'react';
import { Badge, Button, Input, PageHeader, Panel, RepuRingPage, StatusPill, TxStatusCard, roleBadge, roleForReputation } from './components';
import { useRepuRing } from './useRepuRing';

export default function RepuRingAdmin(): JSX.Element {
  const {
    password,
    setPassword,
    circleId,
    setCircleId,
    endorsementId,
    setEndorsementId,
    slashReason,
    setSlashReason,
    profile,
    role,
    circle,
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();
  const claimableRole = roleForReputation(profile?.reputation || 0);

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Admin and Roles"
        title="Claim status and moderate invalid endorsements."
        copy="ClaimRoleTx converts contribution reputation into a visible circle role. SlashEndorsementTx lets the circle creator/admin remove invalid contribution endorsements."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Claim Role" eyebrow="ClaimRoleTx">
          <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
          <Input label="Circle ID" value={circleId} onChange={setCircleId} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Reputation</p>
              <p className="mt-2 text-2xl font-semibold text-white">{profile?.reputation || 0}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Claimable</p>
              <p className="mt-2 font-semibold text-white">{roleBadge(claimableRole)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Claimed</p>
              <div className="mt-2"><StatusPill tone={role?.claimedRole ? 'success' : 'warning'}>{role?.claimedRole ? roleBadge(role.role) : 'Not claimed'}</StatusPill></div>
            </div>
          </div>
          <Button onClick={() => submit('claimRole', { circleId })}>ClaimRoleTx</Button>
        </Panel>

        <Panel title="Slash Endorsement" eyebrow="SlashEndorsementTx">
          <div className="rounded-2xl border border-red-300/25 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
            Only the circle creator/admin can slash an endorsement. A successful slash marks the endorsement as slashed and reduces the target reputation by 2.
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="red">Danger action</Badge>
            <Badge tone="zinc">Circle: {circle?.name || circleId || 'not loaded'}</Badge>
          </div>
          <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Creator/admin signing key password" />
          <Input label="Endorsement ID" value={endorsementId} onChange={setEndorsementId} placeholder="Paste endorsement ID to slash" />
          <Input label="Slash reason" value={slashReason} onChange={setSlashReason} multiline />
          <Button variant="danger" onClick={() => submit('slashEndorsement', { endorsementId, reason: slashReason })}>SlashEndorsementTx</Button>
        </Panel>
      </div>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
