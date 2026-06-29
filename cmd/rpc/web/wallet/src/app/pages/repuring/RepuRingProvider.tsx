import React from 'react';
import { bls12_381 } from '@noble/curves/bls12-381.js';
import { useSelectedAccount } from '@/app/providers/SelectedAccountProvider';
import { waitForTransactionCommit } from '@/core/txConfirmation';
import {
  CircleView,
  ContributionView,
  EndorsementView,
  LeaderboardRow,
  ProfileView,
  RepuRingContext,
  RoleView,
  TxKind,
} from './useRepuRing';

export const QUERY_RPC = 'http://localhost:50002';
export const ADMIN_RPC = 'http://localhost:50003';
const NETWORK_ID = 1;
const CHAIN_ID = 1;
const FEE = 0;
const SUBMIT_RETRY_DELAYS_MS = [0, 350, 900];
const OPTIMISTIC_ACTION_TTL_MS = 20000;
const TX_CONFIRM_TIMEOUT_MS = 30000;
const TX_CONFIRM_POLL_MS = 1200;

const txMeta: Record<TxKind, { typeUrl: string; message: string }> = {
  createProfile: { typeUrl: 'type.googleapis.com/types.MessageCreateProfile', message: 'MessageCreateProfile' },
  updateProfile: { typeUrl: 'type.googleapis.com/types.MessageUpdateProfile', message: 'MessageUpdateProfile' },
  createCircle: { typeUrl: 'type.googleapis.com/types.MessageCreateCircle', message: 'MessageCreateCircle' },
  joinCircle: { typeUrl: 'type.googleapis.com/types.MessageJoinCircle', message: 'MessageJoinCircle' },
  leaveCircle: { typeUrl: 'type.googleapis.com/types.MessageLeaveCircle', message: 'MessageLeaveCircle' },
  createContribution: { typeUrl: 'type.googleapis.com/types.MessageCreateContribution', message: 'MessageCreateContribution' },
  endorseUser: { typeUrl: 'type.googleapis.com/types.MessageEndorseUser', message: 'MessageEndorseUser' },
  endorseContribution: { typeUrl: 'type.googleapis.com/types.MessageEndorseContribution', message: 'MessageEndorseContribution' },
  slashEndorsement: { typeUrl: 'type.googleapis.com/types.MessageSlashEndorsement', message: 'MessageSlashEndorsement' },
  claimRole: { typeUrl: 'type.googleapis.com/types.MessageClaimRole', message: 'MessageClaimRole' },
};

type Signer = { address: string; publicKey: string; privateKey: string };
type OptimisticAction = { kind: TxKind; fields: Record<string, unknown>; senderAddress: string; expiresAt: number };
type TxConfirmation = { kind: TxKind; fields: Record<string, unknown>; senderAddress: string; circleId: string; baseline?: number };
type RepuRingSnapshot = {
  profile: ProfileView | null;
  role: RoleView | null;
  circle: CircleView | null;
  circles: CircleView[];
  contributions: ContributionView[];
  endorsements: EndorsementView[];
};

const actionCopy: Record<TxKind, { progress: string; success: string; failureStep: string }> = {
  createProfile: {
    progress: 'Creating your profile...',
    success: 'Profile confirmed onchain.',
    failureStep: 'profile creation',
  },
  updateProfile: {
    progress: 'Saving profile changes...',
    success: 'Profile update confirmed onchain.',
    failureStep: 'profile update',
  },
  createCircle: {
    progress: 'Creating community...',
    success: 'Community confirmed onchain.',
    failureStep: 'community creation',
  },
  joinCircle: {
    progress: 'Joining community...',
    success: 'Community membership confirmed onchain.',
    failureStep: 'community join',
  },
  leaveCircle: {
    progress: 'Leaving community...',
    success: 'Community leave confirmed onchain.',
    failureStep: 'community leave',
  },
  createContribution: {
    progress: 'Posting proof-of-work...',
    success: 'Proof-of-work confirmed onchain.',
    failureStep: 'proof-of-work post',
  },
  endorseContribution: {
    progress: 'Submitting peer review...',
    success: 'Peer review confirmed onchain.',
    failureStep: 'peer review',
  },
  endorseUser: {
    progress: 'Submitting member endorsement...',
    success: 'Member endorsement confirmed onchain.',
    failureStep: 'member endorsement',
  },
  claimRole: {
    progress: 'Claiming role...',
    success: 'Role claim confirmed onchain.',
    failureStep: 'role claim',
  },
  slashEndorsement: {
    progress: 'Submitting moderation action...',
    success: 'Moderation confirmed onchain.',
    failureStep: 'moderation',
  },
};

export function RepuRingProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { selectedAccount } = useSelectedAccount();
  const [password, setPassword] = React.useState('');
  const [circleId, setCircleId] = React.useState('pharos-builders');
  const [targetAddress, setTargetAddress] = React.useState('');
  const [endorsementId, setEndorsementId] = React.useState('');
  const [selectedContributionId, setSelectedContributionId] = React.useState('');
  const [status, setStatus] = React.useState('Start the local RepuRing services, then refresh.');
  const [submittingKind, setSubmittingKind] = React.useState<TxKind | null>(null);
  const [profileForm, setProfileForm] = React.useState({ username: '', bio: '', avatarUrl: '' });
  const [circleForm, setCircleForm] = React.useState({ name: 'Pharos Builders', description: 'Community for contributors helping the Pharos ecosystem.' });
  const [contributionForm, setContributionForm] = React.useState({
    contributionId: '',
    title: '',
    description: '',
    proofUrl: '',
    category: 'builder',
  });
  const [endorse, setEndorse] = React.useState({ tag: 'builder', message: 'Useful contribution for this community.' });
  const [slashReason, setSlashReason] = React.useState('invalid endorsement');
  const [lastTx, setLastTx] = React.useState('');
  const [profile, setProfile] = React.useState<ProfileView | null>(null);
  const [role, setRole] = React.useState<RoleView | null>(null);
  const [circle, setCircle] = React.useState<CircleView | null>(null);
  const [circles, setCircles] = React.useState<CircleView[]>([]);
  const [contributions, setContributions] = React.useState<ContributionView[]>([]);
  const [endorsements, setEndorsements] = React.useState<EndorsementView[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardRow[]>([]);
  const submitInFlightRef = React.useRef<TxKind | null>(null);
  const refreshStateRef = React.useRef<() => Promise<void>>(async () => undefined);
  const optimisticActionsRef = React.useRef<OptimisticAction[]>([]);

  const currentAddress = selectedAccount?.address ? cleanHex(selectedAccount.address) : '';

  const refreshState = React.useCallback(async () => {
    try {
      const nextProfile = currentAddress
        ? await queryMaybe<ProfileView>('/v1/query/repuring/profile', { address: currentAddress })
        : null;
      const nextRole = currentAddress && circleId.trim()
        ? await queryMaybe<RoleView>('/v1/query/repuring/role', { address: currentAddress, circleId })
        : null;
      const nextCircles = await queryMaybe<CircleView[]>('/v1/query/repuring/circles', {});
      const nextCircle = circleId.trim()
        ? await queryMaybe<CircleView>('/v1/query/repuring/circle', { circleId })
        : null;
      const nextLeaderboard = circleId.trim()
        ? await queryMaybe<LeaderboardRow[]>('/v1/query/repuring/leaderboard', { circleId })
        : [];
      const byUser = currentAddress
        ? await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-for-user', { address: currentAddress })
        : [];
      const inCircle = circleId.trim()
        ? await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-in-circle', { circleId })
        : [];
      const nextContributions = circleId.trim()
        ? await queryMaybe<ContributionView[]>('/v1/query/repuring/contributions-in-circle', { circleId })
        : [];

      optimisticActionsRef.current = optimisticActionsRef.current.filter((action) => action.expiresAt > Date.now());
      const optimisticSnapshot = optimisticActionsRef.current.reduce(
        (snapshot, action) => applyOptimisticSnapshot(snapshot, action.kind, action.fields, action.senderAddress),
        {
          profile: nextProfile,
          role: nextRole,
          circle: nextCircle,
          circles: nextCircles || [],
          contributions: nextContributions || [],
          endorsements: mergeEndorsements(byUser || [], inCircle || []),
        } satisfies RepuRingSnapshot,
      );

      setProfile(optimisticSnapshot.profile);
      setRole(optimisticSnapshot.role);
      setCircle(optimisticSnapshot.circle);
      setCircles(optimisticSnapshot.circles);
      setContributions(optimisticSnapshot.contributions);
      setLeaderboard(nextLeaderboard || []);
      setEndorsements(optimisticSnapshot.endorsements);
      setStatus('RepuRing data refreshed.');
    } catch (e) {
      setCircles([]);
      setStatus(`Could not refresh RepuRing data: ${formatUserError(e, 'Check that the local RepuRing services are running, then refresh again.')}`);
    }
  }, [circleId, currentAddress]);

  React.useEffect(() => {
    refreshStateRef.current = refreshState;
  }, [refreshState]);

  React.useEffect(() => {
    void refreshState();
  }, [refreshState]);

  React.useEffect(() => {
    // Multi-account safety: switching wallets should not reuse stale signing or action inputs.
    setPassword('');
    setTargetAddress('');
    setEndorsementId('');
    setSlashReason('invalid endorsement');
    setProfileForm({ username: '', bio: '', avatarUrl: '' });
  }, [currentAddress]);

  React.useEffect(() => {
    const selectable = contributions.find((item) => cleanHex(item.authorAddress) !== cleanHex(currentAddress)) || contributions[0];
    const selected = contributions.find((item) => item.contributionId === selectedContributionId);
    if (selectable && (!selected || cleanHex(selected.authorAddress) === cleanHex(currentAddress))) {
      setSelectedContributionId(selectable.contributionId);
    }
  }, [contributions, currentAddress, selectedContributionId]);

  function applyOptimisticAction(kind: TxKind, fields: Record<string, unknown>, senderAddress: string) {
    const sender = cleanHex(senderAddress);
    if (!sender) return;
    optimisticActionsRef.current = [
      ...optimisticActionsRef.current.filter((action) => action.expiresAt > Date.now()),
      { kind, fields, senderAddress: sender, expiresAt: Date.now() + OPTIMISTIC_ACTION_TTL_MS },
    ];

    switch (kind) {
      case 'createProfile': {
        setProfile({
          address: sender,
          username: String(fields.username || '').trim(),
          bio: String(fields.bio || ''),
          avatarUrl: String(fields.avatarUrl || ''),
          reputation: profile?.reputation || 0,
        });
        return;
      }
      case 'updateProfile': {
        setProfile((current) => current
          ? { ...current, bio: String(fields.bio || ''), avatarUrl: String(fields.avatarUrl || '') }
          : current);
        return;
      }
      case 'createCircle': {
        const nextCircle: CircleView = {
          circleId: String(fields.circleId || '').trim(),
          name: String(fields.name || '').trim(),
          description: String(fields.description || ''),
          creatorAddress: sender,
          members: [sender],
        };
        if (!nextCircle.circleId) return;
        setCircle(nextCircle);
        setCircles((current) => {
          const exists = current.some((item) => item.circleId === nextCircle.circleId);
          return exists
            ? current.map((item) => item.circleId === nextCircle.circleId ? { ...item, ...nextCircle } : item)
            : [nextCircle, ...current];
        });
        return;
      }
      case 'joinCircle': {
        const targetCircleId = String(fields.circleId || '').trim();
        if (!targetCircleId) return;
        const withMember = (item: CircleView): CircleView => ({
          ...item,
          members: item.members?.some((member) => cleanHex(member) === sender)
            ? item.members
            : [...(item.members || []), sender],
        });
        setCircle((current) => current?.circleId === targetCircleId ? withMember(current) : current);
        setCircles((current) => current.map((item) => item.circleId === targetCircleId ? withMember(item) : item));
        return;
      }
      case 'leaveCircle': {
        const targetCircleId = String(fields.circleId || '').trim();
        if (!targetCircleId) return;
        const withoutMember = (item: CircleView): CircleView => ({
          ...item,
          members: (item.members || []).filter((member) => cleanHex(member) !== sender),
        });
        setCircle((current) => current?.circleId === targetCircleId ? withoutMember(current) : current);
        setCircles((current) => current.map((item) => item.circleId === targetCircleId ? withoutMember(item) : item));
        setRole((current) => current?.circleId === targetCircleId ? null : current);
        return;
      }
      case 'createContribution': {
        const nextContribution: ContributionView = {
          contributionId: String(fields.contributionId || '').trim(),
          circleId: String(fields.circleId || circleId).trim(),
          authorAddress: sender,
          authorUsername: profile?.username || shortHex(sender),
          title: String(fields.title || '').trim(),
          description: String(fields.description || ''),
          proofUrl: String(fields.proofUrl || ''),
          category: String(fields.category || ''),
          endorsementCount: 0,
          slashed: false,
        };
        if (!nextContribution.contributionId) return;
        setContributions((current) => {
          const exists = current.some((item) => item.contributionId === nextContribution.contributionId);
          return exists
            ? current.map((item) => item.contributionId === nextContribution.contributionId ? { ...item, ...nextContribution } : item)
            : [nextContribution, ...current];
        });
        return;
      }
      case 'endorseContribution': {
        const contributionId = String(fields.contributionId || '').trim();
        if (!contributionId) return;
        setContributions((current) => current.map((item) => item.contributionId === contributionId
          ? { ...item, endorsementCount: item.endorsementCount + 1 }
          : item));
        return;
      }
      case 'slashEndorsement': {
        const endorsementId = String(fields.endorsementId || '').trim();
        if (!endorsementId) return;
        setEndorsements((current) => current.map((item) => item.endorsementId === endorsementId
          ? { ...item, slashed: true, slashReason: String(fields.reason || item.slashReason || 'Moderated') }
          : item));
        return;
      }
      case 'claimRole': {
        setRole((current) => current ? { ...current, claimedRole: true } : current);
        return;
      }
      case 'endorseUser':
        return;
    }
  }

  async function submit(kind: TxKind, fields: Record<string, unknown>) {
    if (submitInFlightRef.current) {
      const error = 'Another action is already being submitted. Wait for it to finish, then try again.';
      setStatus(error);
      return { ok: false, error };
    }
    submitInFlightRef.current = kind;
    setSubmittingKind(kind);
    try {
      validateSubmit(kind, fields, currentAddress, password);
      setStatus(actionCopy[kind].progress);
      const signer = await getSigner(currentAddress, password);
      const confirmation = buildTxConfirmation(kind, fields, signer.address, circleId, contributions);
      const response = await submitWithRetry(kind, fields, signer);
      setLastTx('Last action accepted by the local RepuRing network. Waiting for onchain confirmation...');
      setStatus(`Confirming ${actionCopy[kind].failureStep} onchain...`);
      const committed = await waitForTransactionCommit({ rpcBase: QUERY_RPC, txHash: response, timeoutMs: TX_CONFIRM_TIMEOUT_MS, pollMs: TX_CONFIRM_POLL_MS });
      if (committed.status !== 'confirmed') {
        throw new Error('The transaction was accepted, but it was not committed before the confirmation timeout. Keep the node running, then refresh and try again if the action is still missing.');
      }
      const confirmed = await waitForTxConfirmation(confirmation);
      if (!confirmed) {
        throw new Error('The transaction was accepted, but the committed RepuRing state did not update before the confirmation timeout. Keep the node running, then refresh and try again if the action is still missing.');
      }
      await refreshStateRef.current();
      setStatus(actionCopy[kind].success);
      setLastTx('Last action confirmed onchain.');
      return { ok: true, hash: response };
    } catch (e) {
      const error = formatSubmitFailure(kind, e);
      setStatus(error);
      return { ok: false, error };
    } finally {
      submitInFlightRef.current = null;
      setSubmittingKind(null);
    }
  }

  return (
    <RepuRingContext.Provider
      value={{
        selectedAccount,
        currentAddress,
        password,
        setPassword,
        circleId,
        setCircleId,
        targetAddress,
        setTargetAddress,
        endorsementId,
        setEndorsementId,
        selectedContributionId,
        setSelectedContributionId,
        profileForm,
        setProfileForm,
        circleForm,
        setCircleForm,
        contributionForm,
        setContributionForm,
        endorse,
        setEndorse,
        slashReason,
        setSlashReason,
        lastTx,
        status,
        submittingKind,
        profile,
        role,
        circle,
        circles,
        contributions,
        endorsements,
        leaderboard,
        refreshState,
        submit,
      }}
    >
      {submittingKind ? <PendingTransactionOverlay label={actionCopy[submittingKind].failureStep} status={status} /> : null}
      {children}
    </RepuRingContext.Provider>
  );
}

function PendingTransactionOverlay({ label, status }: { label: string; status: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-[80] max-w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-emerald-300/25 bg-[#03120f]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-300/10">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200/25 border-t-emerald-200" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200">Waiting for chain</p>
          <p className="mt-1 text-sm font-black text-white">{label}</p>
          <p className="mt-1 break-words text-xs font-semibold leading-5 text-[#9db9af]">{status}</p>
        </div>
      </div>
    </div>
  );
}

function validateSubmit(kind: TxKind, fields: Record<string, unknown>, currentAddress: string, password: string) {
  if (!currentAddress) throw new Error('Select a wallet first.');
  if (!password) throw new Error('Enter the selected wallet password.');
  if (kind === 'createProfile' && !String(fields.username || '').trim()) throw new Error('Username is required.');
  if (kind === 'createCircle' && !String(fields.circleId || '').trim()) throw new Error('Community is required.');
  if (kind === 'createCircle' && !String(fields.name || '').trim()) throw new Error('Community name is required.');
  if ((kind === 'joinCircle' || kind === 'leaveCircle' || kind === 'claimRole') && !String(fields.circleId || '').trim()) throw new Error('Community is required.');
  if (kind === 'createContribution') {
    if (!String(fields.circleId || '').trim()) throw new Error('Community is required.');
    if (!String(fields.contributionId || '').trim()) throw new Error('Proof identifier is required.');
    if (!String(fields.title || '').trim()) throw new Error('Proof title is required.');
    if (!String(fields.category || '').trim()) throw new Error('Proof category is required.');
  }
  if (kind === 'endorseUser') {
    if (!String(fields.circleId || '').trim()) throw new Error('Community is required.');
    if (!String(fields.targetAddress || '').trim()) throw new Error('Target contributor is required.');
  }
  if (kind === 'endorseContribution' && !String(fields.contributionId || '').trim()) throw new Error('Select proof-of-work to review.');
  if (kind === 'slashEndorsement' && !String(fields.endorsementId || '').trim()) throw new Error('Select a review to moderate.');
  if (kind === 'slashEndorsement' && !String(fields.reason || '').trim()) throw new Error('Moderation reason is required.');
}

function mergeEndorsements(a: EndorsementView[], b: EndorsementView[]) {
  const map = new Map<string, EndorsementView>();
  for (const item of [...a, ...b]) map.set(item.endorsementId, item);
  return [...map.values()];
}

function applyOptimisticSnapshot(
  snapshot: RepuRingSnapshot,
  kind: TxKind,
  fields: Record<string, unknown>,
  senderAddress: string,
): RepuRingSnapshot {
  const sender = cleanHex(senderAddress);
  if (!sender) return snapshot;

  switch (kind) {
    case 'createProfile':
      return {
        ...snapshot,
        profile: {
          address: sender,
          username: String(fields.username || '').trim(),
          bio: String(fields.bio || ''),
          avatarUrl: String(fields.avatarUrl || ''),
          reputation: snapshot.profile?.reputation || 0,
        },
      };
    case 'updateProfile':
      return snapshot.profile
        ? { ...snapshot, profile: { ...snapshot.profile, bio: String(fields.bio || ''), avatarUrl: String(fields.avatarUrl || '') } }
        : snapshot;
    case 'createCircle': {
      const nextCircle: CircleView = {
        circleId: String(fields.circleId || '').trim(),
        name: String(fields.name || '').trim(),
        description: String(fields.description || ''),
        creatorAddress: sender,
        members: [sender],
      };
      if (!nextCircle.circleId) return snapshot;
      const circles = snapshot.circles.some((item) => item.circleId === nextCircle.circleId)
        ? snapshot.circles.map((item) => item.circleId === nextCircle.circleId ? { ...item, ...nextCircle } : item)
        : [nextCircle, ...snapshot.circles];
      return {
        ...snapshot,
        circle: snapshot.circle?.circleId === nextCircle.circleId || !snapshot.circle ? nextCircle : snapshot.circle,
        circles,
      };
    }
    case 'joinCircle': {
      const targetCircleId = String(fields.circleId || '').trim();
      if (!targetCircleId) return snapshot;
      const withMember = (item: CircleView): CircleView => ({
        ...item,
        members: item.members?.some((member) => cleanHex(member) === sender)
          ? item.members
          : [...(item.members || []), sender],
      });
      return {
        ...snapshot,
        circle: snapshot.circle?.circleId === targetCircleId && snapshot.circle ? withMember(snapshot.circle) : snapshot.circle,
        circles: snapshot.circles.map((item) => item.circleId === targetCircleId ? withMember(item) : item),
      };
    }
    case 'leaveCircle': {
      const targetCircleId = String(fields.circleId || '').trim();
      if (!targetCircleId) return snapshot;
      const withoutMember = (item: CircleView): CircleView => ({
        ...item,
        members: (item.members || []).filter((member) => cleanHex(member) !== sender),
      });
      return {
        ...snapshot,
        role: snapshot.role?.circleId === targetCircleId ? null : snapshot.role,
        circle: snapshot.circle?.circleId === targetCircleId && snapshot.circle ? withoutMember(snapshot.circle) : snapshot.circle,
        circles: snapshot.circles.map((item) => item.circleId === targetCircleId ? withoutMember(item) : item),
      };
    }
    case 'createContribution': {
      const nextContribution: ContributionView = {
        contributionId: String(fields.contributionId || '').trim(),
        circleId: String(fields.circleId || '').trim(),
        authorAddress: sender,
        authorUsername: snapshot.profile?.username || shortHex(sender),
        title: String(fields.title || '').trim(),
        description: String(fields.description || ''),
        proofUrl: String(fields.proofUrl || ''),
        category: String(fields.category || ''),
        endorsementCount: 0,
        slashed: false,
      };
      if (!nextContribution.contributionId) return snapshot;
      const contributions = snapshot.contributions.some((item) => item.contributionId === nextContribution.contributionId)
        ? snapshot.contributions.map((item) => item.contributionId === nextContribution.contributionId ? { ...item, ...nextContribution } : item)
        : [nextContribution, ...snapshot.contributions];
      return { ...snapshot, contributions };
    }
    case 'endorseContribution': {
      const contributionId = String(fields.contributionId || '').trim();
      if (!contributionId) return snapshot;
      return {
        ...snapshot,
        contributions: snapshot.contributions.map((item) => item.contributionId === contributionId
          ? { ...item, endorsementCount: item.endorsementCount + 1 }
          : item),
      };
    }
    case 'slashEndorsement': {
      const endorsementId = String(fields.endorsementId || '').trim();
      if (!endorsementId) return snapshot;
      return {
        ...snapshot,
        endorsements: snapshot.endorsements.map((item) => item.endorsementId === endorsementId
          ? { ...item, slashed: true, slashReason: String(fields.reason || item.slashReason || 'Moderated') }
          : item),
      };
    }
    case 'claimRole':
      return snapshot.role ? { ...snapshot, role: { ...snapshot.role, claimedRole: true } } : snapshot;
    case 'endorseUser':
      return snapshot;
  }
}

function buildTxConfirmation(kind: TxKind, fields: Record<string, unknown>, senderAddress: string, activeCircleId: string, currentContributions: ContributionView[]): TxConfirmation {
  const contributionId = String(fields.contributionId || '').trim();
  const contribution = contributionId ? currentContributions.find((item) => item.contributionId === contributionId) : null;
  return {
    kind,
    fields,
    senderAddress: cleanHex(senderAddress),
    circleId: String(fields.circleId || contribution?.circleId || activeCircleId || '').trim(),
    baseline: contribution?.endorsementCount,
  };
}

async function waitForTxConfirmation(confirmation: TxConfirmation) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < TX_CONFIRM_TIMEOUT_MS) {
    if (await isTxConfirmed(confirmation)) return true;
    await sleep(TX_CONFIRM_POLL_MS);
  }
  return false;
}

async function isTxConfirmed({ kind, fields, senderAddress, circleId, baseline }: TxConfirmation) {
  const sender = cleanHex(senderAddress);
  switch (kind) {
    case 'createProfile': {
      const profile = await queryMaybe<ProfileView>('/v1/query/repuring/profile', { address: sender });
      return Boolean(profile && cleanHex(profile.address) === sender && profile.username === String(fields.username || '').trim());
    }
    case 'updateProfile': {
      const profile = await queryMaybe<ProfileView>('/v1/query/repuring/profile', { address: sender });
      return Boolean(profile && profile.bio === String(fields.bio || '') && profile.avatarUrl === String(fields.avatarUrl || ''));
    }
    case 'createCircle': {
      const targetCircleId = String(fields.circleId || '').trim();
      const circle = await queryMaybe<CircleView>('/v1/query/repuring/circle', { circleId: targetCircleId });
      return Boolean(circle && circle.circleId === targetCircleId && cleanHex(circle.creatorAddress) === sender && hasMember(circle, sender));
    }
    case 'joinCircle': {
      const circle = await queryMaybe<CircleView>('/v1/query/repuring/circle', { circleId });
      return Boolean(circle && hasMember(circle, sender));
    }
    case 'leaveCircle': {
      const circle = await queryMaybe<CircleView>('/v1/query/repuring/circle', { circleId });
      return Boolean(circle && !hasMember(circle, sender));
    }
    case 'createContribution': {
      const contributionId = String(fields.contributionId || '').trim();
      const contribution = await queryMaybe<ContributionView>('/v1/query/repuring/contribution', { contributionId });
      return Boolean(contribution && contribution.contributionId === contributionId && cleanHex(contribution.authorAddress) === sender);
    }
    case 'endorseUser': {
      const target = cleanHex(String(fields.targetAddress || ''));
      const endorsements = await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-for-user', { address: target });
      return Boolean(endorsements?.some((item) => item.circleId === circleId && cleanHex(item.fromAddress) === sender && cleanHex(item.targetAddress) === target && !item.contributionId));
    }
    case 'endorseContribution': {
      const contributionId = String(fields.contributionId || '').trim();
      const contribution = await queryMaybe<ContributionView>('/v1/query/repuring/contribution', { contributionId });
      if (contribution && typeof baseline === 'number' && contribution.endorsementCount > baseline) return true;
      const endorsements = circleId ? await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-in-circle', { circleId }) : [];
      return Boolean(endorsements?.some((item) => item.contributionId === contributionId && cleanHex(item.fromAddress) === sender));
    }
    case 'slashEndorsement': {
      const endorsementId = String(fields.endorsementId || '').trim();
      const endorsements = circleId ? await queryMaybe<EndorsementView[]>('/v1/query/repuring/endorsements-in-circle', { circleId }) : [];
      return Boolean(endorsements?.some((item) => item.endorsementId === endorsementId && item.slashed));
    }
    case 'claimRole': {
      const role = await queryMaybe<RoleView>('/v1/query/repuring/role', { address: sender, circleId });
      return Boolean(role?.claimedRole);
    }
  }
}

function hasMember(circle: CircleView, address: string) {
  const target = cleanHex(address);
  return Boolean(target && circle.members?.some((member) => cleanHex(member) === target));
}

function formatSubmitFailure(kind: TxKind, error: unknown) {
  const message = formatUserError(error, 'The local node did not provide details. Check the wallet, required fields, and community state, then try again.');
  const lower = message.toLowerCase();
  const step = lower.includes('wallet') || lower.includes('password') || lower.includes('unlock')
    ? 'wallet check'
    : lower.includes('community') || lower.includes('circle')
      ? 'community check'
      : lower.includes('proof') || lower.includes('contribution')
        ? 'proof-of-work check'
        : lower.includes('review') || lower.includes('endorsement')
          ? 'review check'
          : 'submission check';
  return `Could not complete ${actionCopy[kind].failureStep} at ${step}: ${message}`;
}

function formatUserError(error: unknown, fallback: string) {
  const raw = error instanceof Error ? error.message : String(error || '');
  return cleanUserError(raw, fallback);
}

function cleanUserError(raw: string, fallback: string) {
  const value = String(raw || '').trim();
  if (!value || value === '{}' || value === '[]' || value === 'null' || value === 'undefined') return fallback;
  const emptyStatusFailure = value.match(/^Status\s+([A-Za-z]+)\s+failed:\s*(\{\}|\[\]|null|undefined)?$/i);
  if (emptyStatusFailure) {
    return `${actionFailureLabel(emptyStatusFailure[1])} failed, but the local node did not provide details. Check the selected wallet, required fields, and current community state, then try again.`;
  }
  if (value.toLowerCase().includes('failed to fetch')) {
    return 'Cannot connect to the local services. Start the app, then try again.';
  }
  return value
    .split('RPC').join('service')
    .split('Tx').join('action')
    .split('Circle ID').join('Community reference')
    .split('circle ID').join('community')
    .split('Contribution ID').join('Proof reference')
    .split('Endorsement ID').join('Review reference');
}

function actionFailureLabel(kind: string) {
  const labels: Record<string, string> = {
    createProfile: 'Profile creation',
    updateProfile: 'Profile update',
    createCircle: 'Community creation',
    joinCircle: 'Community join',
    leaveCircle: 'Community leave',
    createContribution: 'Proof-of-work post',
    endorseUser: 'Member endorsement',
    endorseContribution: 'Peer review',
    slashEndorsement: 'Review moderation',
    claimRole: 'Role claim',
  };
  return labels[kind] || 'Action';
}

function errorFromResponse(parsed: unknown, fallback: string) {
  if (typeof parsed === 'string') return cleanUserError(parsed, fallback);
  if (parsed && typeof parsed === 'object') {
    const record = parsed as Record<string, unknown>;
    for (const key of ['error', 'message', 'detail', 'details']) {
      if (typeof record[key] === 'string' && record[key]) return cleanUserError(record[key], fallback);
    }
  }
  return fallback;
}

async function queryMaybe<T>(path: string, body: unknown): Promise<T | null> {
  const res = await fetch(`${QUERY_RPC}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (res.status === 404) return null;
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(errorFromResponse(parsed, 'Could not load RepuRing data from the local services.'));
  return parsed as T;
}

async function getSigner(address: string, password: string) {
  const parsed = await postJSON(`${ADMIN_RPC}/v1/admin/keystore-get`, { address, password }, 'Could not unlock the selected wallet. Check the wallet password and try again.');
  return {
    address: cleanHex(parsed.address || parsed.Address || address),
    publicKey: cleanHex(parsed.publicKey || parsed.PublicKey || parsed.public_key),
    privateKey: cleanHex(parsed.privateKey || parsed.PrivateKey || parsed.private_key),
  };
}

async function getHeight(): Promise<number> {
  const result = await postJSON(`${QUERY_RPC}/v1/query/height`, {}, 'Could not reach the local RepuRing node. Start the node and try again.');
  return Number(result.height || 0);
}

async function submitWithRetry(kind: TxKind, fields: Record<string, unknown>, signer: Signer): Promise<string> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < SUBMIT_RETRY_DELAYS_MS.length; attempt += 1) {
    const delay = SUBMIT_RETRY_DELAYS_MS[attempt];
    if (delay > 0) await sleep(delay);
    try {
      const height = await getHeight();
      const tx = buildTransaction(kind, fields, signer, height);
      const response = await postJSON(`${QUERY_RPC}/v1/tx`, tx, 'The local node rejected the action but did not explain why. Check the required fields and wallet password, then try again.');
      return typeof response === 'string' ? response : JSON.stringify(response);
    } catch (error) {
      lastError = error;
      if (!shouldRetrySubmit(error)) break;
    }
  }
  throw lastError;
}

function shouldRetrySubmit(error: unknown) {
  const message = formatUserError(error, '').toLowerCase();
  if (!message) return true;
  if (message.includes('password') || message.includes('unlock') || message.includes('unauthorized')) return false;
  if (message.includes('required') || message.includes('already') || message.includes('exists') || message.includes('not a member')) return false;
  return true;
}

function buildTransaction(kind: TxKind, fields: Record<string, unknown>, signer: Signer, height: number) {
  const msgBytes = encodeMessage(kind, { senderAddress: signer.address, ...fields });
  const time = Date.now() * 1000;
  const signBytes = encodeTransaction({
    messageType: kind,
    typeUrl: txMeta[kind].typeUrl,
    msgBytes,
    createdHeight: height,
    time,
    fee: FEE,
    networkID: NETWORK_ID,
    chainID: CHAIN_ID,
  });
  const signature = signBLS(signer.privateKey, signBytes);
  return {
    type: kind,
    msgTypeUrl: txMeta[kind].typeUrl,
    msgBytes: bytesToHex(msgBytes),
    signature: { publicKey: cleanHex(signer.publicKey), signature: bytesToHex(signature) },
    time,
    createdHeight: height,
    fee: FEE,
    memo: '',
    networkID: NETWORK_ID,
    chainID: CHAIN_ID,
  };
}

async function postJSON(url: string, body: unknown, fallback: string) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await res.text();
  const parsed = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(errorFromResponse(parsed, fallback));
  return parsed;
}

function encodeMessage(kind: TxKind, v: Record<string, unknown>): Uint8Array {
  const sender = hexToBytes(String(v.senderAddress));
  switch (kind) {
    case 'createProfile':
      return concat([fieldBytes(1, sender), fieldString(2, v.username), fieldString(3, v.bio), fieldString(4, v.avatarUrl)]);
    case 'updateProfile':
      return concat([fieldBytes(1, sender), fieldString(2, v.bio), fieldString(3, v.avatarUrl)]);
    case 'createCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId), fieldString(3, v.name), fieldString(4, v.description)]);
    case 'joinCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
    case 'leaveCircle':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
    case 'createContribution':
      return concat([fieldBytes(1, sender), fieldString(2, v.contributionId), fieldString(3, v.circleId), fieldString(4, v.title), fieldString(5, v.description), fieldString(6, v.proofUrl), fieldString(7, v.category)]);
    case 'endorseUser':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId), fieldBytes(3, hexToBytes(String(v.targetAddress))), fieldString(4, v.tag), fieldString(5, v.message)]);
    case 'endorseContribution':
      return concat([fieldBytes(1, sender), fieldString(2, v.contributionId), fieldString(3, v.tag), fieldString(4, v.message)]);
    case 'slashEndorsement':
      return concat([fieldBytes(1, sender), fieldString(2, v.endorsementId), fieldString(3, v.reason)]);
    case 'claimRole':
      return concat([fieldBytes(1, sender), fieldString(2, v.circleId)]);
  }
}

function encodeTransaction(v: { messageType: string; typeUrl: string; msgBytes: Uint8Array; createdHeight: number; time: number; fee: number; networkID: number; chainID: number }) {
  const anyMsg = concat([fieldString(1, v.typeUrl), fieldBytes(2, v.msgBytes)]);
  const fields = [
    fieldString(1, v.messageType),
    fieldBytes(2, anyMsg),
    fieldVarint(4, v.createdHeight),
    fieldVarint(5, v.time),
  ];
  if (v.fee !== 0) fields.push(fieldVarint(6, v.fee));
  fields.push(fieldVarint(8, v.networkID), fieldVarint(9, v.chainID));
  return concat(fields);
}

function signBLS(privateKeyHex: string, message: Uint8Array): Uint8Array {
  const hashedPoint = bls12_381.longSignatures.hash(message);
  const signaturePoint = bls12_381.longSignatures.sign(hashedPoint, hexToBytes(privateKeyHex));
  return bls12_381.longSignatures.Signature.toBytes(signaturePoint);
}

function fieldString(n: number, value: unknown) { return fieldBytes(n, new TextEncoder().encode(String(value ?? ''))); }
function fieldBytes(n: number, value: Uint8Array) { return concat([varint((n << 3) | 2), varint(value.length), value]); }
function fieldVarint(n: number, value: number) { return concat([varint((n << 3) | 0), varint(value)]); }
function varint(value: number): Uint8Array {
  let v = BigInt(Math.trunc(value));
  const out: number[] = [];
  while (v >= 0x80n) { out.push(Number((v & 0x7fn) | 0x80n)); v >>= 7n; }
  out.push(Number(v));
  return new Uint8Array(out);
}
function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0));
  let offset = 0;
  for (const p of parts) { out.set(p, offset); offset += p.length; }
  return out;
}
export function cleanHex(v: string) { return String(v || '').trim().replace(/^0x/, '').toLowerCase(); }
function shortHex(v: string) {
  const clean = cleanHex(v);
  return clean ? `${clean.slice(0, 6)}...${clean.slice(-6)}` : '';
}
function hexToBytes(hex: string) {
  const clean = cleanHex(hex);
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function bytesToHex(bytes: Uint8Array) { return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''); }
function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
