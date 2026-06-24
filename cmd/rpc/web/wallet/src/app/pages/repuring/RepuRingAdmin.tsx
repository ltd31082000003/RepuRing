import React from 'react';
import { ActiveWalletBanner, ActionGate, Badge, Button, CommunityContextCard, ConfirmationPanel, DangerPanel, EmptyState, Input, MetricCard, PageHeader, Panel, RepuRingPage, ReviewCard, RoleProgressCard, SectionHeader, StatusPill, TxStatusCard, roleBadge, roleForReputation, shortAddress } from './components';
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
    contributions,
    endorsements,
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();
  const [claimAdvancedOpen, setClaimAdvancedOpen] = React.useState(false);
  const [slashConfirmOpen, setSlashConfirmOpen] = React.useState(false);
  const claimableRole = roleForReputation(profile?.reputation || 0);
  const creatorSelected = Boolean(currentAddress && circle?.creatorAddress && cleanHex(currentAddress) === cleanHex(circle.creatorAddress));
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const selectedReview = endorsements.find((item) => item.endorsementId === endorsementId) || null;
  const linkedContribution = selectedReview?.contributionId ? contributions.find((item) => item.contributionId === selectedReview.contributionId) || null : null;
  const activeCircleId = circle?.circleId || circleId;

  // Multi-account demo safety: block ClaimRole/Slash before submit so wrong-account
  // attempts fail clearly in the UI instead of being rejected onchain.
  const claimDisabled = !currentAddress || !profile || !isMember || !password || !activeCircleId.trim();
  const claimHelp = !currentAddress
    ? 'Select a wallet in My Account.'
    : !profile
      ? 'Create your RepuRing profile before claiming a role.'
      : !isMember
        ? 'Join this circle before claiming a role for it.'
        : !password
          ? 'Enter the selected wallet password to sign ClaimRoleTx.'
          : 'Ready to claim a role from current reputation.';
  const slashDisabled = !creatorSelected || !endorsementId.trim() || !slashReason.trim() || !password || Boolean(selectedReview?.slashed);
  const slashHelp = !currentAddress
    ? 'Select a wallet in My Account.'
    : !creatorSelected
      ? 'Switch to the circle creator/admin wallet to slash an endorsement.'
      : !endorsementId.trim()
        ? 'Select a review card from the moderation queue first.'
        : selectedReview?.slashed
          ? 'This review is already slashed.'
          : !slashReason.trim()
            ? 'Enter a slash reason before confirming moderation.'
        : !password
          ? 'Enter the creator/admin wallet password to sign SlashEndorsementTx.'
          : 'Ready to review slash impact.';

  async function claimRole() {
    await submit('claimRole', { circleId: activeCircleId });
  }

  async function confirmSlash() {
    const result = await submit('slashEndorsement', { endorsementId, reason: slashReason });
    if (result.ok) {
      setSlashConfirmOpen(false);
      await refreshState();
    }
  }

  React.useEffect(() => {
    setSlashConfirmOpen(false);
  }, [endorsementId, slashReason, currentAddress]);

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

      <CommunityContextCard
        circle={circle}
        circleId={circleId}
        currentAddress={currentAddress}
        isMember={isMember}
        isCreator={creatorSelected}
        actions={<Button to="/repuring/circles" variant="secondary">Change community</Button>}
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
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">Current community</p>
              <p className="mt-1 break-words text-sm text-zinc-300">{circle?.name || 'No community loaded'}</p>
              <p className="mt-2 break-all font-mono text-xs text-zinc-500">Onchain community ID: {activeCircleId || 'none'}</p>
            </div>
            <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={claimDisabled} onClick={claimRole}>Claim role</Button>
              <Button to="/repuring/circles" variant="secondary">Change community</Button>
              <Badge tone="zinc">ClaimRoleTx</Badge>
            </div>
            <p className="text-sm text-zinc-500">{claimHelp}</p>
            <details className="rounded-2xl border border-white/10 bg-black/20 p-4" open={claimAdvancedOpen} onToggle={(event) => setClaimAdvancedOpen(event.currentTarget.open)}>
              <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Advanced/debug: manual community ID</summary>
              <div className="mt-4">
                <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="Manual fallback only" />
              </div>
            </details>
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
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">Selected review</p>
            <p className="mt-2 break-all font-mono text-xs text-zinc-400">{endorsementId || 'Select a review card from the moderation queue'}</p>
            {selectedReview && (
              <p className="mt-2 break-words text-sm leading-6 text-zinc-300">{selectedReview.message || 'No review message provided.'}</p>
            )}
          </div>
          <Input label="Slash reason" value={slashReason} onChange={setSlashReason} multiline />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="danger" disabled={slashDisabled} onClick={() => setSlashConfirmOpen(true)}>Review slash impact</Button>
            <Badge tone="red">SlashEndorsementTx</Badge>
          </div>
          <p className="text-sm text-red-200/70">{slashHelp}</p>
          {!creatorSelected && (
            <ActionGate
              tone="danger"
              title="Creator/admin wallet required"
              copy="Switch to the circle creator wallet before moderating endorsements."
              actions={<Button to="/key-management" variant="secondary">Switch wallet</Button>}
            />
          )}
          {slashConfirmOpen && selectedReview && (
            <ConfirmationPanel
              eyebrow="Confirm slash"
              title="Review slash impact"
              copy="This action writes permanent moderation state for the selected endorsement."
              tone="danger"
              actions={(
                <>
                  <Button variant="danger" disabled={slashDisabled} onClick={confirmSlash}>Confirm slash</Button>
                  <Button variant="secondary" onClick={() => setSlashConfirmOpen(false)}>Cancel</Button>
                </>
              )}
            >
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <DetailRow label="Review / endorsement ID" value={selectedReview.endorsementId} mono />
                <DetailRow label="Reviewer" value={shortAddress(selectedReview.fromAddress) || selectedReview.fromAddress} mono />
                <DetailRow label="Target contributor" value={shortAddress(selectedReview.targetAddress) || selectedReview.targetAddress} mono />
                <DetailRow label="Linked contribution" value={linkedContribution?.title || selectedReview.contributionId || 'No linked contribution'} />
                {selectedReview.contributionId && <DetailRow label="Contribution ID" value={selectedReview.contributionId} mono />}
                <DetailRow label="Slash reason" value={slashReason} />
                <DetailRow label="Reputation impact" value="Target reputation -2, floor 0" />
                <DetailRow label="Contribution impact" value={selectedReview.contributionId ? 'Linked contribution endorsement count -1' : 'No linked contribution count impact'} />
              </div>
            </ConfirmationPanel>
          )}
          <details className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Advanced: manual endorsement ID</summary>
            <div className="mt-4">
              <Input label="Endorsement ID" value={endorsementId} onChange={setEndorsementId} placeholder="Paste endorsement ID only for debugging" />
            </div>
          </details>
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
              <ReviewCard
                key={item.endorsementId}
                review={item}
                selected={endorsementId === item.endorsementId}
                actions={(
                  <Button
                    variant={endorsementId === item.endorsementId ? 'primary' : 'secondary'}
                    className="w-full sm:w-auto"
                    disabled={item.slashed}
                    onClick={() => setEndorsementId(item.endorsementId)}
                  >
                    {item.slashed ? 'Already slashed' : 'Select for slash'}
                  </Button>
                )}
              />
            ))}
          </div>
        )}
      </Panel>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs font-semibold uppercase text-zinc-500">{label}</p>
      <p className={`mt-1 break-words text-sm text-zinc-100 ${mono ? 'font-mono' : ''}`}>{value || 'Not provided'}</p>
    </div>
  );
}
