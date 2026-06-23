import React from 'react';
import { ActiveWalletBanner, Badge, Button, DangerPanel, EmptyState, Input, MetricCard, PageHeader, Panel, RepuRingPage, RoleProgressCard, SectionHeader, SocialCard, StatusPill, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { useRepuRing } from './useRepuRing';

export default function RepuRingAdmin(): JSX.Element {
  const {
    currentAddress,
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
    endorsements,
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();
  const claimableRole = roleForReputation(profile?.reputation || 0);
  const creatorSelected = Boolean(currentAddress && circle?.creatorAddress && cleanHex(currentAddress) === cleanHex(circle.creatorAddress));
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));

  // Multi-account demo safety: block ClaimRole/Slash before submit so wrong-account
  // attempts fail clearly in the UI instead of being rejected onchain.
  const claimDisabled = !currentAddress || !profile || !isMember || !password || !circleId.trim();
  const claimHelp = !currentAddress
    ? 'Select a wallet in My Account.'
    : !profile
      ? 'Create your RepuRing profile before claiming a role.'
      : !isMember
        ? 'Join this circle before claiming a role for it.'
        : !password
          ? 'Enter the selected wallet password to sign ClaimRoleTx.'
          : 'Ready to claim a role from current reputation.';
  const slashDisabled = !creatorSelected || !endorsementId.trim() || !password;
  const slashHelp = !currentAddress
    ? 'Select a wallet in My Account.'
    : !creatorSelected
      ? 'Switch to the circle creator/admin wallet to slash an endorsement.'
      : !endorsementId.trim()
        ? 'Select an endorsement ID from the moderation queue first.'
        : !password
          ? 'Enter the creator/admin wallet password to sign SlashEndorsementTx.'
          : 'Ready to slash this endorsement.';

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Moderation center"
        title="Moderation & Roles"
        copy="Claim a role for the selected circle from current profile reputation, or moderate an invalid endorsement as the circle creator/admin."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh moderation state</Button>}
      />

      <ActiveWalletBanner
        currentAddress={currentAddress}
        username={profile?.username}
        circleName={circle?.name}
        isMember={isMember}
        hasProfile={Boolean(profile)}
      />

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel>
          <SectionHeader
            eyebrow="ClaimRoleTx"
            title="Role Claim"
            copy="ClaimRoleTx safely maps current profile reputation to role status for the selected circle; it does not change reputation."
          />
          <RoleProgressCard reputation={profile?.reputation || 0} embedded />
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard label="Reputation" value={String(profile?.reputation || 0)} detail="Current account profile score." tone="emerald" />
            <MetricCard label="Claimable role" value={roleBadge(claimableRole)} detail="Calculated from reputation thresholds." tone="cyan" />
            <MetricCard label="Claimed status" value={role?.claimedRole ? roleBadge(role.role) : 'Not claimed'} detail={role?.claimedRole ? 'Stored onchain for this circle.' : 'Submit ClaimRoleTx to store role.'} />
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
            <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <Input label="Circle ID" value={circleId} onChange={setCircleId} />
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={claimDisabled} onClick={() => { void submit('claimRole', { circleId }); }}>Claim role</Button>
              <Badge tone="zinc">ClaimRoleTx</Badge>
            </div>
            <p className="text-sm text-zinc-500">{claimHelp}</p>
          </div>
        </Panel>

        <DangerPanel>
          <SectionHeader
            eyebrow="SlashEndorsementTx"
            title="Slash invalid endorsement"
            copy="Only the circle creator/admin can submit this danger action. Slashing marks the endorsement, reduces target reputation by 2 floored at 0, and decrements a linked contribution endorsement count when applicable."
            actions={<Badge tone="red">Danger action</Badge>}
          />
          <div className="break-words rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
            This writes permanent plugin state: the endorsement is marked slashed, target profile reputation decreases by 2 with a floor of 0, and a linked contribution count decreases when applicable.
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="zinc">Circle: {circle?.name || circleId || 'not loaded'}</Badge>
            <StatusPill tone={creatorSelected ? 'success' : 'warning'}>{creatorSelected ? 'Creator wallet selected' : 'Creator/admin required'}</StatusPill>
          </div>
          <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Creator/admin signing key password" />
          <Input label="Endorsement ID" value={endorsementId} onChange={setEndorsementId} placeholder="Paste endorsement ID to slash" />
          <Input label="Slash reason" value={slashReason} onChange={setSlashReason} multiline />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="danger" disabled={slashDisabled} onClick={() => { void submit('slashEndorsement', { endorsementId, reason: slashReason }); }}>Slash invalid endorsement</Button>
            <Badge tone="red">SlashEndorsementTx</Badge>
          </div>
          <p className="text-sm text-red-200/70">{slashHelp}</p>
        </DangerPanel>
      </section>

      <Panel>
        <SectionHeader
          eyebrow="Selectable moderation queue"
          title="Recent endorsement IDs"
          copy="Click a card to fill the slash form without copying IDs manually."
        />
        {endorsements.length === 0 ? (
          <EmptyState
            title="No endorsements loaded"
            copy="Endorse a contribution from another member account, then return as the circle creator/admin to review moderation candidates."
            actions={<Button to="/repuring/endorse" variant="secondary">Open endorsement review</Button>}
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {endorsements.map((item) => (
              <SocialCard key={item.endorsementId} selected={endorsementId === item.endorsementId}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge>{item.tag}</Badge>
                  <StatusPill tone={item.slashed ? 'danger' : 'success'}>{item.slashed ? 'Slashed' : 'Active'}</StatusPill>
                </div>
                <p className="mt-3 break-words text-sm leading-6 text-zinc-300">{item.message || 'No message provided.'}</p>
                <div className="mt-4 grid gap-2 text-xs text-zinc-500">
                  <div>ID <span className="break-all font-mono text-zinc-300">{item.endorsementId}</span></div>
                  {item.contributionId && <div>Contribution <span className="break-all font-mono text-zinc-300">{item.contributionId}</span></div>}
                  <div>From <span className="font-mono text-zinc-300">{shortAddress(item.fromAddress)}</span></div>
                  <div>Target <span className="font-mono text-zinc-300">{shortAddress(item.targetAddress)}</span></div>
                </div>
                <Button variant="secondary" className="mt-4 w-full sm:w-auto" onClick={() => setEndorsementId(item.endorsementId)}>Use this endorsement ID</Button>
              </SocialCard>
            ))}
          </div>
        )}
      </Panel>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}
