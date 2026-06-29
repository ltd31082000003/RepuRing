import React from 'react';
import { Check, ExternalLink, RefreshCw, ShieldCheck, TriangleAlert, UserRoundPlus, X } from 'lucide-react';
import { Badge, Button, EmptyState, Input, RepuRingPage, StatusPill, roleBadge, roleForReputation, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { EndorsementView, useRepuRing } from './useRepuRing';

export default function RepuRingAdmin(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    circleId,
    endorsementId,
    setEndorsementId,
    slashReason,
    setSlashReason,
    profile,
    role,
    circle,
    circles,
    contributions,
    endorsements,
    status,
    lastTx,
    submittingKind,
    refreshState,
    submit,
  } = useRepuRing();

  const [slashConfirmOpen, setSlashConfirmOpen] = React.useState(false);
  const claimableRole = roleForReputation(profile?.reputation || 0);
  const activeCircleId = circle?.circleId || circleId;
  const adminCircles = React.useMemo(
    () => getAdminCircles(currentAddress, circles, circle),
    [currentAddress, circles, circle],
  );
  const canAccessAdmin = adminCircles.length > 0;
  const creatorSelected = Boolean(currentAddress && circle?.creatorAddress && cleanHex(currentAddress) === cleanHex(circle.creatorAddress));
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const selectedReview = endorsements.find((item) => item.endorsementId === endorsementId) || null;
  const linkedContribution = selectedReview?.contributionId ? contributions.find((item) => item.contributionId === selectedReview.contributionId) || null : null;
  const pendingReviews = endorsements.filter((item) => !item.slashed).length;
  const totalEndorsements = endorsements.length;
  const memberCount = circle?.members?.length || 0;
  const claimDisabled = Boolean(submittingKind) || !currentAddress || !profile || !isMember || !password || !activeCircleId.trim();
  const slashDisabled = Boolean(submittingKind) || !creatorSelected || !endorsementId.trim() || !slashReason.trim() || !password || Boolean(selectedReview?.slashed);

  async function claimRole() {
    await submit('claimRole', { circleId: activeCircleId });
  }

  async function confirmSlash() {
    const result = await submit('slashEndorsement', { endorsementId, reason: slashReason });
    if (result.ok) {
      setSlashConfirmOpen(false);
    }
  }

  React.useEffect(() => {
    setSlashConfirmOpen(false);
  }, [endorsementId, slashReason, currentAddress]);

  if (!canAccessAdmin) {
    return (
      <RepuRingPage>
        <AdminAccessDenied currentAddress={currentAddress} onRefresh={refreshState} />
      </RepuRingPage>
    );
  }

  return (
    <RepuRingPage>
      <section className="relative overflow-hidden px-1 pt-1">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54f3b3]/12 bg-[#062d25] px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-[#54f3b3]">
              <span className="h-2 w-2 rounded-full bg-[#13d8a0]" />
              Moderation center
            </div>
            <h1 className="mt-7 text-5xl font-black leading-none text-white sm:text-[64px]">
              Moderation <span className="text-[#09d69b]">&amp;</span> Roles
            </h1>
            <p className="mt-7 max-w-[650px] text-[19px] font-semibold leading-8 text-[#9db9af]">
              Claim a role for the selected circle from current profile reputation, or moderate an invalid endorsement as the circle creator/admin.
            </p>
          </div>
          <Button variant="secondary" onClick={refreshState} className="gap-3 !rounded-[14px] !px-7 !py-4 lg:mt-2">
            <RefreshCw size={18} strokeWidth={2.4} />
            Refresh moderation state
          </Button>
        </div>
      </section>

      <section className="admin-grid-primary">
        <AdminCard className="admin-card-tall">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Active wallet / community role</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-[8px] border border-[#54f3b3]/10 bg-[#0a3028] px-4 py-2 font-mono text-sm font-semibold text-[#7da599]">
                  {shortAddress(currentAddress) || 'No wallet'}
                </span>
                <Badge tone={profile ? 'emerald' : 'zinc'}>{roleBadge(claimableRole)}</Badge>
                <Badge tone={isMember ? 'emerald' : 'zinc'}>{isMember ? 'Circle member' : 'Not joined'}</Badge>
              </div>
            </div>
            <Button to="/key-management" variant="secondary" className="gap-2 !rounded-[12px] !px-5 !py-3">
              <ExternalLink size={15} strokeWidth={2.4} />
              Open My Account
            </Button>
          </div>
          <div className="mt-6 rounded-[14px] border border-[#54f3b3]/8 bg-[#041a15] px-5 py-4 text-sm font-semibold text-[#7da599]">
            This wallet confirms actions for {circle?.name || 'the selected community'}. Check the active wallet before submitting.
          </div>
        </AdminCard>

        <QuickStatsCard
          className="admin-card-tall"
          pendingReviews={pendingReviews}
          activeMembers={memberCount}
          totalEndorsements={totalEndorsements}
        />
      </section>

      <section className="admin-grid-secondary">
        <CommunityContextPanel
          className="admin-card-context"
          circleName={circle?.name || 'No community selected'}
          circleDescription={circle?.description}
          circleCount={circles.length}
          adminCount={adminCircles.length}
          memberCount={memberCount}
        />
        <RecentActivityPanel
          className="admin-card-context"
          endorsements={endorsements}
          selectedReviewId={endorsementId}
          onSelectReview={(id) => setEndorsementId(id)}
        />
      </section>

      <RoleManagementPanel
        currentRole={role?.claimedRole ? roleBadge(role.role) : roleBadge(claimableRole)}
        claimableRole={roleBadge(claimableRole)}
        memberCount={memberCount}
        creatorSelected={creatorSelected}
        claimDisabled={claimDisabled}
        onClaimRole={claimRole}
        submittingClaim={submittingKind === 'claimRole'}
      />

      <ModerationActionPanel
        creatorSelected={creatorSelected}
        selectedReview={selectedReview}
        linkedContributionTitle={linkedContribution?.title}
        password={password}
        setPassword={setPassword}
        slashReason={slashReason}
        setSlashReason={setSlashReason}
        slashDisabled={slashDisabled}
        slashConfirmOpen={slashConfirmOpen}
        submittingSlash={submittingKind === 'slashEndorsement'}
        onOpenConfirm={() => setSlashConfirmOpen(true)}
        onCancelConfirm={() => setSlashConfirmOpen(false)}
        onConfirmSlash={confirmSlash}
      />

      <StatusFooter status={status} lastTx={lastTx} onRefresh={refreshState} />
      <AdminFooter />
    </RepuRingPage>
  );
}

function AdminCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[16px] border border-[#54f3b3]/10 bg-[#071f19]/80 p-6 shadow-[0_22px_70px_rgba(0,0,0,0.24)] ${className}`}>
      {children}
    </section>
  );
}

function AdminAccessDenied({ currentAddress, onRefresh }: { currentAddress: string; onRefresh: () => Promise<void> }) {
  return (
    <section className="rounded-[28px] border border-[#ff5576]/20 bg-[#2a1016]/80 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:p-8 lg:p-10" role="alert">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff5576]/20 bg-[#3a0b1b] px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#ff8aa0]">
            <TriangleAlert size={14} strokeWidth={2.6} />
            Access denied
          </div>
          <h1 className="mt-6 break-words text-4xl font-black leading-tight text-white sm:text-5xl">
            Admin page is restricted
          </h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[#f0b9b9]">
            Only wallets that are admin/creator of at least one community circle can access this page. The selected wallet does not currently administer any group.
          </p>
          <p className="mt-5 break-all rounded-[14px] border border-[#ff5576]/14 bg-black/20 px-4 py-3 font-mono text-xs text-[#d8b6b6]">
            {currentAddress || 'No wallet selected'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:flex-col">
          <Button to="/repuring/circles" variant="secondary" className="!rounded-[12px] !px-5 !py-3">
            Open Circles
          </Button>
          <Button to="/key-management" variant="secondary" className="!rounded-[12px] !px-5 !py-3">
            Switch Wallet
          </Button>
          <Button onClick={onRefresh} className="!rounded-[12px] !px-5 !py-3">
            Refresh Access
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <EmptyState
          title="No admin community found"
          copy="Create a new community circle or switch to a wallet that created one. Member-only wallets cannot open moderation tools."
        />
      </div>
    </section>
  );
}

function QuickStatsCard({
  pendingReviews,
  activeMembers,
  totalEndorsements,
  className = '',
}: {
  pendingReviews: number;
  activeMembers: number;
  totalEndorsements: number;
  className?: string;
}) {
  const stats = [
    { label: 'Pending Reviews', value: pendingReviews, progress: Math.min(100, Math.max(26, pendingReviews * 9)) },
    { label: 'Active Members', value: activeMembers, progress: Math.min(100, Math.max(42, activeMembers ? 72 : 18)) },
    { label: 'Total Endorsements', value: totalEndorsements, progress: Math.min(100, Math.max(54, totalEndorsements ? 88 : 22)) },
  ];

  return (
    <AdminCard className={className}>
      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Quick stats</p>
      <div className="mt-5 space-y-7">
        {stats.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-[15px] font-semibold text-[#8caf9f]">{item.label}</p>
              <p className="text-xl font-black text-white">{formatNumber(item.value)}</p>
            </div>
            <div className="mt-5 h-1 rounded-full bg-[#0a3028]">
              <div className="h-full rounded-full bg-[#10c993]" style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function CommunityContextPanel({
  className = '',
  circleName,
  circleDescription,
  circleCount,
  adminCount,
  memberCount,
}: {
  className?: string;
  circleName: string;
  circleDescription?: string;
  circleCount: number;
  adminCount: number;
  memberCount: number;
}) {
  return (
    <AdminCard className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Current community context</p>
          <h2 className="mt-5 text-2xl font-black text-white">{circleName}</h2>
          <p className="mt-4 max-w-[390px] text-base font-semibold leading-7 text-[#7da599]">
            {circleDescription || 'Select a community to align posts, reviews, leaderboard, and roles.'}
          </p>
        </div>
        <Button to="/repuring/circles?view=involved" variant="secondary" className="!rounded-[12px] !px-6 !py-3">
          Change community
        </Button>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <SmallMetric label="Circles" value={formatNumber(circleCount)} />
        <SmallMetric label="Admins" value={formatNumber(adminCount || 1)} />
        <SmallMetric label="Members" value={formatShort(memberCount)} />
      </div>
    </AdminCard>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[#54f3b3]/8 bg-[#041a15] p-5 text-center">
      <p className="text-xl font-black text-white">{value}</p>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.26em] text-[#008a66]">{label}</p>
    </div>
  );
}

function RecentActivityPanel({
  className = '',
  endorsements,
  selectedReviewId,
  onSelectReview,
}: {
  className?: string;
  endorsements: EndorsementView[];
  selectedReviewId: string;
  onSelectReview: (id: string) => void;
}) {
  const visible = endorsements.slice(0, 4);

  return (
    <AdminCard className={className}>
      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Recent moderation activity</p>
      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No moderation activity" copy="Endorsements appear here after members review community posts." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visible.map((item, index) => (
            <button
              key={item.endorsementId}
              type="button"
              onClick={() => onSelectReview(item.endorsementId)}
              className={`flex w-full items-center gap-4 rounded-[14px] border p-4 text-left transition hover:border-[#54f3b3]/24 ${selectedReviewId === item.endorsementId ? 'border-[#54f3b3]/32 bg-[#0a3028]' : 'border-[#54f3b3]/8 bg-[#041a15]'}`}
            >
              <ActivityIcon state={item.slashed ? 'rejected' : index === 0 ? 'approved' : 'pending'} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-white">{item.slashed ? 'Invalid endorsement removed' : item.message || 'Endorsement flagged for review'}</p>
                <p className="mt-1 text-sm font-semibold text-[#6fa08e]">{index === 0 ? '2 hours ago' : index === 1 ? '5 hours ago' : index === 2 ? '1 day ago' : '2 days ago'}</p>
              </div>
              <ActivityStatus state={item.slashed ? 'rejected' : index === 0 ? 'approved' : 'pending'} />
            </button>
          ))}
        </div>
      )}
    </AdminCard>
  );
}

function ActivityIcon({ state }: { state: 'approved' | 'pending' | 'rejected' }) {
  const styles = {
    approved: 'bg-[#043c2e] text-[#13d8a0]',
    pending: 'bg-[#4a3306] text-[#ffc107]',
    rejected: 'bg-[#3a0b1b] text-[#ff3d65]',
  };
  const Icon = state === 'approved' ? Check : state === 'pending' ? TriangleAlert : X;
  return (
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles[state]}`}>
      <Icon size={16} strokeWidth={2.6} />
    </span>
  );
}

function ActivityStatus({ state }: { state: 'approved' | 'pending' | 'rejected' }) {
  const styles = {
    approved: 'bg-[#063d2d] text-[#13d8a0]',
    pending: 'bg-[#463507] text-[#ffc107]',
    rejected: 'bg-[#3a0b1b] text-[#ff5576]',
  };
  const labels = { approved: 'Approved', pending: 'Pending', rejected: 'Rejected' };
  return <span className={`rounded-full px-3 py-1 text-[11px] font-black ${styles[state]}`}>{labels[state]}</span>;
}

function RoleManagementPanel({
  currentRole,
  claimableRole,
  memberCount,
  creatorSelected,
  claimDisabled,
  onClaimRole,
  submittingClaim,
}: {
  currentRole: string;
  claimableRole: string;
  memberCount: number;
  creatorSelected: boolean;
  claimDisabled: boolean;
  onClaimRole: () => Promise<void>;
  submittingClaim: boolean;
}) {
  const rows = [
    { name: 'Circle Admin', members: creatorSelected ? 1 : 0, permissions: 'Full Access', status: 'Active', color: '#00e3a2', pill: 'emerald' },
    { name: 'Moderator', members: creatorSelected ? 1 : 0, permissions: 'Moderate', status: creatorSelected ? 'Active' : 'Paused', color: '#4aa3ff', pill: 'blue' },
    { name: 'Circle Member', members: memberCount, permissions: 'Read & Endorse', status: 'Active', color: '#9b6cff', pill: 'purple' },
    { name: 'Contributor', members: Math.max(0, memberCount - 1), permissions: 'Submit & View', status: 'Paused', color: '#ffc107', pill: 'amber' },
  ];

  return (
    <AdminCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Role management</p>
          <h2 className="mt-4 text-xl font-black text-white">Circle Roles &amp; Permissions</h2>
          <p className="mt-2 text-sm font-semibold text-[#7da599]">Current role: {currentRole}. Claimable role: {claimableRole}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" disabled={claimDisabled} onClick={onClaimRole} className="!rounded-[12px] !px-5 !py-3">
            {submittingClaim ? 'Assigning...' : 'Assign Role'}
          </Button>
          <Button disabled={claimDisabled} onClick={onClaimRole} className="!rounded-[12px] !px-5 !py-3">
            Create Role
          </Button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#54f3b3]/10 text-left">
              <TableHead>Role name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-[#54f3b3]/6 last:border-b-0">
                <td className="py-5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-black text-white">{row.name}</span>
                  </div>
                </td>
                <td className="py-5 pr-4 text-sm font-semibold text-[#8caf9f]">{formatNumber(row.members)}</td>
                <td className="py-5 pr-4"><PermissionPill tone={row.pill}>{row.permissions}</PermissionPill></td>
                <td className="py-5 pr-4 text-sm font-black text-[#13d8a0]">{row.status}</td>
                <td className="py-5 text-right text-sm font-semibold text-[#7da599]">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}

function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`pb-4 pr-4 text-[11px] font-black uppercase tracking-[0.28em] text-[#008a66] ${className}`}>{children}</th>;
}

function PermissionPill({ children, tone }: { children: React.ReactNode; tone: string }) {
  const tones: Record<string, string> = {
    emerald: 'bg-[#063d2d] text-[#13d8a0]',
    blue: 'bg-[#0a2c52] text-[#4aa3ff]',
    purple: 'bg-[#25185d] text-[#9b6cff]',
    amber: 'bg-[#463507] text-[#ffc107]',
  };
  return <span className={`rounded-[6px] px-3 py-1 text-xs font-black ${tones[tone]}`}>{children}</span>;
}

function ModerationActionPanel({
  creatorSelected,
  selectedReview,
  linkedContributionTitle,
  password,
  setPassword,
  slashReason,
  setSlashReason,
  slashDisabled,
  slashConfirmOpen,
  submittingSlash,
  onOpenConfirm,
  onCancelConfirm,
  onConfirmSlash,
}: {
  creatorSelected: boolean;
  selectedReview: EndorsementView | null;
  linkedContributionTitle?: string;
  password: string;
  setPassword: (value: string) => void;
  slashReason: string;
  setSlashReason: (value: string) => void;
  slashDisabled: boolean;
  slashConfirmOpen: boolean;
  submittingSlash: boolean;
  onOpenConfirm: () => void;
  onCancelConfirm: () => void;
  onConfirmSlash: () => Promise<void>;
}) {
  return (
    <AdminCard>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Moderation action</p>
          <h2 className="mt-4 text-xl font-black text-white">Selected review impact</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#7da599]">
            Select a recent activity item, enter a reason, then review impact before marking the endorsement invalid.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill tone={creatorSelected ? 'success' : 'warning'}>{creatorSelected ? 'Creator wallet selected' : 'Creator/admin required'}</StatusPill>
          <Button variant="danger" disabled={slashDisabled} onClick={onOpenConfirm}>Review slash impact</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <DetailTile label="Review reference" value={selectedReview?.endorsementId || 'No review selected'} mono />
        <DetailTile label="Target contributor" value={selectedReview ? shortAddress(selectedReview.targetAddress) || selectedReview.targetAddress : 'Not selected'} mono />
        <DetailTile label="Linked contribution" value={linkedContributionTitle || selectedReview?.contributionId || 'No linked contribution'} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Input label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required for role and moderation actions" />
        <Input label="Slash reason" value={slashReason} onChange={setSlashReason} placeholder="Reason for invalid review" />
      </div>

      {slashConfirmOpen && selectedReview && (
        <div className="mt-5 rounded-[16px] border border-[#ff5576]/18 bg-[#3a0b1b]/26 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#ff5576]">Confirm slash</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#f0b9b9]">
                This permanently marks the selected review as invalid. Target reputation decreases by 2 with a floor of 0.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="danger" disabled={slashDisabled} onClick={onConfirmSlash}>
                {submittingSlash ? 'Submitting...' : 'Confirm slash'}
              </Button>
              <Button variant="secondary" onClick={onCancelConfirm}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </AdminCard>
  );
}

function DetailTile({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-[14px] border border-[#54f3b3]/8 bg-[#041a15] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#008a66]">{label}</p>
      <p className={`mt-3 break-words text-sm font-semibold text-white ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function StatusFooter({ status, lastTx, onRefresh }: { status: string; lastTx: string; onRefresh: () => Promise<void> }) {
  return (
    <AdminCard>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div aria-live="polite">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">Action status</p>
          <p className="mt-3 text-sm font-semibold text-[#9db9af]">{status}</p>
          <p className="mt-2 break-all font-mono text-xs text-[#68867b]">{lastTx || 'No action submitted yet'}</p>
        </div>
        <Button variant="secondary" onClick={onRefresh}>Refresh status</Button>
      </div>
    </AdminCard>
  );
}

function AdminFooter() {
  return (
    <footer className="border-t border-[#54f3b3]/10 pt-12">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#54f3b3]/18 bg-[#063d2d] text-[#13d8a0]">
              <ShieldCheck size={16} />
            </span>
            <p className="font-black text-white">RepuRing Social</p>
          </div>
          <p className="mt-6 max-w-[290px] text-sm font-semibold leading-6 text-[#6f8f84]">
            Decentralized reputation and community management for the next generation of builders.
          </p>
        </div>
        <FooterLinks title="Platform" items={['Overview', 'Community circles', 'Leaderboard', 'Local services']} />
        <FooterLinks title="Community" items={['Documentation', 'Discord', 'Twitter / X', 'GitHub']} />
        <FooterLinks title="Legal" items={['Privacy Policy', 'Terms of Service', 'Cookie Policy']} />
      </div>
    </footer>
  );
}

function FooterLinks({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#00c994]">{title}</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <p key={item} className="text-sm font-semibold text-[#8caf9f]">{item}</p>
        ))}
      </div>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatShort(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return formatNumber(value);
}

function getAdminCircles(
  currentAddress: string,
  circles: Array<{ circleId?: string; creatorAddress?: string }>,
  activeCircle: { circleId?: string; creatorAddress?: string } | null,
) {
  const normalizedAddress = cleanHex(currentAddress);
  if (!normalizedAddress) return [];

  const byId = new Map<string, { circleId?: string; creatorAddress?: string }>();
  [...circles, activeCircle].forEach((item) => {
    if (!item?.creatorAddress || cleanHex(item.creatorAddress) !== normalizedAddress) return;
    byId.set(item.circleId || item.creatorAddress, item);
  });
  return Array.from(byId.values());
}
