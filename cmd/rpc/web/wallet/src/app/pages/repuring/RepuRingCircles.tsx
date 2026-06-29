import React from 'react';
import { ArrowUpRight, Check, Compass, Plus, RefreshCw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Button, Input, RepuRingPage, StatusPill, TxStatusCard, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { CircleView, useRepuRing } from './useRepuRing';

type WalletCircleStatus = 'Creator' | 'Joined' | 'Not joined' | 'No wallet selected' | 'Profile required';
type JoinErrorInfo = { title: string; detail: string };

export default function RepuRingCircles(): JSX.Element {
  const {
    currentAddress,
    password,
    setPassword,
    profile,
    circleId,
    setCircleId,
    circleForm,
    setCircleForm,
    circle,
    circles,
    status,
    lastTx,
    submittingKind,
    refreshState,
    submit,
  } = useRepuRing();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [advancedJoinOpen, setAdvancedJoinOpen] = React.useState(false);
  const [joinCircleId, setJoinCircleId] = React.useState('');
  const [newCircleId, setNewCircleId] = React.useState(slugifyCircleId(circleForm.name));
  const [involvedOnly, setInvolvedOnly] = React.useState(false);
  const [contextNotice, setContextNotice] = React.useState('');
  const [joinError, setJoinError] = React.useState<JoinErrorInfo | null>(null);
  const refreshStateRef = React.useRef(refreshState);
  const joinCardRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const joinPasswordRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
  const handledJoinTargetRef = React.useRef('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedJoinCircleId = searchParams.get('join')?.trim() || '';
  const requestedView = searchParams.get('view')?.trim() || '';

  React.useEffect(() => {
    refreshStateRef.current = refreshState;
  }, [refreshState]);

  const discoveredSelectedCircle = circles.find((item) => item.circleId === circleId) || null;
  const activeCircle = circle?.circleId === circleId ? circle : discoveredSelectedCircle;
  const activeCircleNeedsRefresh = Boolean(activeCircle && circle?.circleId !== activeCircle.circleId);
  const memberCount = activeCircle?.members?.length || 0;
  const totalMembers = circles.reduce((sum, item) => sum + (item.members?.length || 0), 0);
  const involvedCircles = circles.filter((item) => isCircleMember(item, currentAddress) || (item.creatorAddress && cleanHex(item.creatorAddress) === cleanHex(currentAddress)));
  const visibleCircles = involvedOnly ? involvedCircles : circles;
  const joinedCount = involvedCircles.length;
  const isMember = isCircleMember(activeCircle, currentAddress);
  const selectedStatus = walletStatus(activeCircle, currentAddress, Boolean(profile));
  const selectedStatusTone = statusTone(selectedStatus);
  const createDisabled = Boolean(submittingKind) || !currentAddress || !profile || !password || !newCircleId.trim() || !circleForm.name.trim();
  const manualJoinDisabled = Boolean(submittingKind) || !currentAddress || !profile || !password || !activeCircle?.circleId || isMember;
  const manualJoinHelp = !currentAddress
    ? 'Select a wallet first.'
    : !profile
      ? 'Create a profile first.'
      : !activeCircle?.circleId
        ? 'Open a community first.'
        : isMember
          ? 'Already joined.'
          : !password
            ? "Enter this wallet's password to join."
            : 'Ready to join this community.';

  React.useEffect(() => {
    setNewCircleId(slugifyCircleId(circleForm.name));
  }, [circleForm.name]);

  React.useEffect(() => {
    if (!requestedJoinCircleId || handledJoinTargetRef.current === requestedJoinCircleId) return;
    const discoveredCircle = circles.find((item) => item.circleId === requestedJoinCircleId);
    if (!discoveredCircle && circles.length === 0) return;
    handledJoinTargetRef.current = requestedJoinCircleId;
    setCircleId(requestedJoinCircleId);
    setJoinCircleId(discoveredCircle ? requestedJoinCircleId : '');
    setAdvancedJoinOpen(!discoveredCircle);
    setInvolvedOnly(false);
    setContextNotice(discoveredCircle
      ? 'Community selected. Enter your wallet password to join.'
      : 'Community selected by reference. Enter your wallet password in the join form.'
    );
  }, [circles, requestedJoinCircleId, setCircleId]);

  React.useEffect(() => {
    if (requestedJoinCircleId) return;
    if (requestedView === 'involved') setInvolvedOnly(true);
  }, [requestedJoinCircleId, requestedView]);

  React.useEffect(() => {
    if (!joinCircleId) return;
    const scrollToJoinCard = () => {
      const card = joinCardRefs.current[joinCircleId];
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      joinPasswordRefs.current[joinCircleId]?.focus({ preventScroll: true });
    };
    const firstFrame = window.requestAnimationFrame(() => {
      scrollToJoinCard();
      window.setTimeout(scrollToJoinCard, 160);
    });
    return () => window.cancelAnimationFrame(firstFrame);
  }, [joinCircleId]);

  async function setCurrentCircleContext(nextCircleId: string) {
    setCircleId(nextCircleId);
    setContextNotice('Community selected. Posts, reviews, leaderboard, and roles now use this community.');
    if (nextCircleId === circleId) {
      await refreshState();
    } else {
      window.setTimeout(() => { void refreshStateRef.current(); }, 0);
    }
  }

  async function openCommunity(nextCircleId: string) {
    await setCurrentCircleContext(nextCircleId);
    navigate('/repuring/community');
  }

  async function previewCommunity(nextCircleId: string) {
    await setCurrentCircleContext(nextCircleId);
    navigate('/repuring/community');
  }

  function prepareJoinCircle(nextCircleId: string, expanded: boolean) {
    void setCurrentCircleContext(nextCircleId);
    setJoinCircleId(expanded ? '' : nextCircleId);
  }

  async function joinDiscoveredCircle(targetCircleId: string, circleName?: string) {
    setJoinError(null);
    const joined = await submit('joinCircle', { circleId: targetCircleId });
    if (joined.ok) {
      setCircleId(targetCircleId);
      setContextNotice('Joined and confirmed. You can now post and review work in this community.');
      setJoinCircleId('');
      navigate('/repuring/community');
      return;
    }
    setJoinError(describeJoinCircleError(joined.error || 'Unknown error', targetCircleId, circleName));
  }

  async function createCommunity() {
    const created = await submit('createCircle', { circleId: newCircleId, ...circleForm });
    if (!created.ok) return;
    setCircleId(newCircleId);
    setContextNotice('Community created and selected. You can now invite members and organize work here.');
    navigate('/repuring/community');
  }

  async function joinCurrentCircle() {
    setJoinError(null);
    const joined = await submit('joinCircle', { circleId });
    if (joined.ok) {
      setCircleId(circleId);
      setContextNotice('Joined and confirmed. You can now post and review work in this community.');
      setJoinCircleId('');
      navigate('/repuring/community');
      return;
    }
    setJoinError(describeJoinCircleError(joined.error || 'Unknown error', circleId, activeCircle?.name));
  }

  const heroCommunityName = activeCircle?.name || circleId || 'No community selected';

  return (
    <RepuRingPage>
      <section className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#3af0ad]/15 bg-[#04120f] shadow-[0_44px_140px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(80,255,188,0.18),transparent_34%),radial-gradient(circle_at_84%_24%,rgba(122,207,164,0.12),transparent_30%),linear-gradient(110deg,rgba(255,255,255,0.06),transparent_46%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.09] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(0deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative grid min-h-[520px] gap-10 p-8 xl:grid-cols-[1.02fr_0.98fr] xl:p-12">
          <div className="flex max-w-4xl flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#54f3b3]/20 bg-[#54f3b3]/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#c9ffdf]">
                <Compass className="h-4 w-4" />
                Community command center
              </div>
              <h1 className="mt-8 max-w-4xl text-[88px] font-black leading-[0.88] text-[#f4fff8]">
                Community circles
              </h1>
              <p className="mt-8 max-w-[58ch] text-base font-semibold leading-8 text-[#9db9af]">
                Discover builder communities, create a new one, or move into the active workspace where posts, reviews, roles, and leaderboard context stay aligned.
              </p>
            </div>

            <div className="mt-10 grid max-w-3xl grid-cols-3 gap-3">
              <HeroStat label="discovered" value={String(circles.length)} />
              <HeroStat label="joined" value={String(joinedCount)} />
              <HeroStat label="members tracked" value={String(totalMembers)} />
            </div>
          </div>

          <aside className="relative self-stretch rounded-[30px] border border-white/10 bg-[#071c17]/86 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_90px_rgba(0,0,0,0.28)]">
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-[#54f3b3]/20 bg-[#54f3b3]/5" />
            <div className="absolute right-16 top-16 h-12 w-12 rounded-full bg-[#54f3b3]/20 blur-xl" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#68867b]">Active workspace</p>
                  <h2 className="mt-4 break-words text-4xl font-black leading-none text-white">{heroCommunityName}</h2>
                </div>
                <StatusPill tone={selectedStatusTone}>{selectedStatus}</StatusPill>
              </div>

              <div className="mt-10 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3">
                <SignalStep active={Boolean(currentAddress)} label="Wallet" />
                <span className="h-px bg-[#54f3b3]/20" />
                <SignalStep active={Boolean(profile)} label="Profile" />
                <span className="h-px bg-[#54f3b3]/20" />
                <SignalStep active={isMember} label="Member" />
              </div>

              <div className="mt-10 grid gap-3">
                <ContextRow label="Community reference" value={activeCircle?.circleId || circleId || 'Not selected'} />
                <ContextRow label="Creator" value={shortAddress(activeCircle?.creatorAddress || '') || 'Unknown'} />
                <ContextRow label="Members" value={`${memberCount} joined`} />
              </div>

              <div className="mt-auto pt-10">
                <p className="rounded-[22px] border border-[#54f3b3]/12 bg-black/20 p-4 text-sm font-semibold leading-6 text-[#9db9af]">
                  {manualJoinHelp}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => setCreateOpen(true)}>
                    <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Create community</span>
                  </Button>
                  <Button variant="secondary" onClick={refreshState}>
                    <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Refresh</span>
                  </Button>
                  <Button to="/repuring/community" variant="secondary">
                    <span className="inline-flex items-center gap-2">Open <ArrowUpRight className="h-4 w-4" /></span>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {joinError && (
        <section className="rounded-[28px] border border-red-300/25 bg-[#2b1010] p-6 text-red-50 shadow-[0_24px_80px_rgba(70,0,0,0.22)]" role="alert">
          <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-red-200">Join problem</p>
              <h2 className="mt-3 text-2xl font-black text-red-50">{joinError.title}</h2>
              <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-red-100/85">{joinError.detail}</p>
            </div>
            <Button variant="secondary" onClick={() => setJoinError(null)}>Dismiss</Button>
          </div>
        </section>
      )}

      {!profile && (
        <section className="relative overflow-hidden rounded-[30px] border border-amber-200/20 bg-[#201f0d] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.26)]">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_100%_50%,rgba(250,204,21,0.16),transparent_42%)]" />
          <div className="relative grid gap-6 xl:grid-cols-[1fr_auto] xl:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-amber-200/75">Before joining</p>
              <h2 className="mt-3 text-3xl font-black text-amber-50">Create your RepuRing profile first</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-amber-100/75">
                A profile connects your wallet to community actions, posts, reviews, and reputation.
              </p>
            </div>
            <Button to="/key-management" variant="secondary">Open My Account</Button>
          </div>
        </section>
      )}

      <section className="grid items-start gap-6 xl:grid-cols-[0.78fr_1.42fr_0.8fr]">
        <aside className="sticky top-24 hidden space-y-6 xl:block">
          <WorkspaceStatusCard
            activeCircle={activeCircle}
            circleId={circleId}
            currentAddress={currentAddress}
            profileName={profile?.username}
            selectedStatus={selectedStatus}
            selectedStatusTone={selectedStatusTone}
            isMember={isMember}
            activeCircleNeedsRefresh={activeCircleNeedsRefresh}
            contextNotice={contextNotice}
          />
          <ActionSequence profile={Boolean(profile)} activeCircle={Boolean(activeCircle)} member={isMember} />
        </aside>

        <main className="min-w-0 space-y-6">
          <section className="relative overflow-hidden rounded-[32px] border border-[#54f3b3]/14 bg-[#071c17]/88 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.32)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#54f3b3] via-[#b7f6d0] to-transparent" />
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#54f3b3]">Discover board</p>
                <h2 className="mt-3 text-4xl font-black leading-none text-white">{involvedOnly ? 'Your involved communities' : 'All Community'}</h2>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[#9db9af]">
                  {involvedOnly
                    ? 'These are the communities this wallet has joined or created. Open one to continue working in its workspace.'
                    : 'Browse available circles, inspect the member base, then join or open the community workspace.'}
                </p>
              </div>
              <Button variant="secondary" onClick={refreshState}>
                <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Refresh list</span>
              </Button>
            </div>

            <button
              className={`mt-7 flex w-full items-center justify-between gap-5 rounded-[26px] border p-5 text-left transition hover:-translate-y-0.5 ${involvedOnly ? 'border-[#54f3b3]/35 bg-[#54f3b3]/12' : 'border-white/10 bg-black/24 hover:border-[#54f3b3]/24'}`}
              onClick={() => setInvolvedOnly((value) => !value)}
              type="button"
            >
              <span>
                <span className="block text-xl font-black text-white">{involvedOnly ? 'All Community' : 'Community Involved'}</span>
                <span className="mt-2 block text-sm font-semibold leading-6 text-[#9db9af]">
                  {involvedOnly ? 'Show every discovered community again.' : 'Show only communities joined or created by this wallet.'}
                </span>
              </span>
              <Badge tone={involvedOnly ? 'emerald' : 'cyan'}>{involvedOnly ? `${circles.length} total` : `${joinedCount} involved`}</Badge>
            </button>

            {circles.length === 0 ? (
              <EmptyBoard onCreate={() => setCreateOpen(true)} />
            ) : visibleCircles.length === 0 ? (
              <EmptyBoard
                title="No involved communities"
                copy={currentAddress
                  ? 'Join or create a community, then it will appear in this involved view.'
                  : 'Select a wallet to see communities you have joined or created.'}
                actionLabel={currentAddress ? 'Show all communities' : 'Select wallet'}
                onCreate={() => currentAddress ? setInvolvedOnly(false) : navigate('/key-management')}
              />
            ) : (
              <div className="mt-8 grid gap-4">
                {visibleCircles.map((item, index) => {
                  const itemStatus = walletStatus(item, currentAddress, Boolean(profile));
                  const itemSelected = item.circleId === circleId;
                  const itemIsMember = itemStatus === 'Creator' || itemStatus === 'Joined';
                  const joinExpanded = joinCircleId === item.circleId;
                  const cardJoinDisabled = Boolean(submittingKind) || !currentAddress || !profile || !password || itemIsMember;
                  const primaryAction = itemIsMember
                    ? 'Open community'
                    : !currentAddress
                      ? 'View details'
                      : !profile
                        ? 'Create profile'
                        : 'Join community';
                  const cardJoinHelp = !currentAddress
                    ? 'Select a wallet in My Account to join.'
                    : !profile
                      ? 'Create a profile to join this community.'
                      : itemStatus === 'Creator'
                        ? 'You created this community.'
                        : itemIsMember
                          ? 'This community is open as a member.'
                          : !password
                            ? "Enter this wallet's password to join."
                            : 'Ready to join this community.';

                  return (
                    <CircleTile
                      key={item.circleId}
                      ref={(node) => { joinCardRefs.current[item.circleId] = node; }}
                      circle={item}
                      index={index}
                      selected={itemSelected}
                      status={<StatusPill tone={statusTone(itemStatus)}>{itemStatus}</StatusPill>}
                      cardJoinHelp={cardJoinHelp}
                      actions={(
                        <>
                          {itemIsMember || !currentAddress ? (
                            <Button variant={itemSelected ? 'primary' : 'secondary'} onClick={() => itemIsMember ? openCommunity(item.circleId) : previewCommunity(item.circleId)}>
                              {primaryAction}
                            </Button>
                          ) : !profile ? (
                            <Button variant="secondary" to="/key-management">Create profile</Button>
                          ) : (
                            <>
                              <Button onClick={() => prepareJoinCircle(item.circleId, joinExpanded)}>
                                {joinExpanded ? 'Hide join' : 'Join community'}
                              </Button>
                              <Button variant={itemSelected ? 'primary' : 'secondary'} onClick={() => previewCommunity(item.circleId)}>
                                Preview
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    >
                      {joinExpanded && !itemIsMember && (
                        <div className="mt-5 rounded-[22px] border border-[#54f3b3]/12 bg-black/30 p-4">
                          <Input
                            ref={(node) => { joinPasswordRefs.current[item.circleId] = node as HTMLInputElement | null; }}
                            label="Wallet password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            placeholder="Required for this wallet"
                          />
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Button disabled={cardJoinDisabled} onClick={() => joinDiscoveredCircle(item.circleId, item.name)}>
                              {submittingKind === 'joinCircle' ? 'Joining...' : 'Join community'}
                            </Button>
                            <Badge tone="cyan">{shortAddress(currentAddress) || 'No wallet'}</Badge>
                          </div>
                        </div>
                      )}
                    </CircleTile>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-6">
          <ManualJoinStudio
            advancedJoinOpen={advancedJoinOpen}
            setAdvancedJoinOpen={setAdvancedJoinOpen}
            circleId={circleId}
            setCircleId={setCircleId}
            password={password}
            setPassword={setPassword}
            manualJoinDisabled={manualJoinDisabled}
            joinCurrentCircle={joinCurrentCircle}
            submittingKind={submittingKind}
            manualJoinHelp={manualJoinHelp}
          />
        </aside>
      </section>

      {createOpen && (
        <CreateStudio
          setCreateOpen={setCreateOpen}
          password={password}
          setPassword={setPassword}
          circleForm={circleForm}
          setCircleForm={setCircleForm}
          createDisabled={createDisabled}
          createCommunity={createCommunity}
          submittingKind={submittingKind}
        />
      )}

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
  );
}

function WorkspaceStatusCard({
  activeCircle,
  circleId,
  currentAddress,
  profileName,
  selectedStatus,
  selectedStatusTone,
  isMember,
  activeCircleNeedsRefresh,
  contextNotice,
}: {
  activeCircle: CircleView | null;
  circleId: string;
  currentAddress: string;
  profileName?: string;
  selectedStatus: WalletCircleStatus;
  selectedStatusTone: 'success' | 'warning' | 'danger' | 'neutral';
  isMember: boolean;
  activeCircleNeedsRefresh: boolean;
  contextNotice: string;
}) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-[#54f3b3]/14 bg-[#071c17]/86 shadow-[0_24px_90px_rgba(0,0,0,0.26)]">
      <div className="border-b border-white/10 p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#54f3b3]">Current context</p>
        <h2 className="mt-3 break-words text-2xl font-black leading-tight text-white">{activeCircle?.name || 'No community selected'}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#9db9af]">
          {activeCircle?.description || 'Select a community to align posts, reviews, leaderboard, and roles.'}
        </p>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={selectedStatusTone}>{selectedStatus}</StatusPill>
          <Badge tone={isMember ? 'emerald' : 'zinc'}>{isMember ? 'Member' : 'Not joined'}</Badge>
          {activeCircleNeedsRefresh && <Badge tone="zinc">Refreshing context</Badge>}
        </div>
        <ContextRow label="Reference" value={activeCircle?.circleId || circleId || 'None'} />
        <ContextRow label="Creator" value={shortAddress(activeCircle?.creatorAddress || '') || 'Unknown'} />
        <ContextRow label="Wallet" value={shortAddress(currentAddress) || 'No wallet'} />
        <ContextRow label="Profile" value={profileName || 'Not created'} />
        {contextNotice && <p className="rounded-[18px] border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm font-bold leading-6 text-emerald-100/85">{contextNotice}</p>}
      </div>
    </section>
  );
}

function ActionSequence({ profile, activeCircle, member }: { profile: boolean; activeCircle: boolean; member: boolean }) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-[#041612] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.22)]">
      <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#68867b]">Next best action</p>
      <div className="mt-5 space-y-3">
        <FlowStep active={profile} index="01" title="Profile" copy={profile ? 'Contributor profile is ready.' : 'Create your contributor profile in My Account.'} />
        <FlowStep active={activeCircle} index="02" title="Community" copy={activeCircle ? 'Workspace context is selected.' : 'Choose a community from the board.'} />
        <FlowStep active={member} index="03" title="Membership" copy={member ? 'Posting and reviewing are available.' : 'Join the community before contributing.'} />
      </div>
    </section>
  );
}

const CircleTile = React.forwardRef<HTMLElement, {
  circle: CircleView;
  index: number;
  selected: boolean;
  status: React.ReactNode;
  cardJoinHelp: string;
  actions: React.ReactNode;
  children?: React.ReactNode;
}>(function CircleTile({
  circle,
  index,
  selected,
  status,
  cardJoinHelp,
  actions,
  children,
}, ref) {
  return (
    <article ref={ref} className={`group relative flex min-h-[240px] flex-col overflow-hidden rounded-[30px] border p-5 transition duration-300 hover:-translate-y-1 hover:border-[#54f3b3]/35 ${selected ? 'border-[#54f3b3]/38 bg-[#103d31] shadow-[0_30px_100px_rgba(84,243,179,0.13)]' : 'border-white/10 bg-[#041612]'}`}>
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#54f3b3]/10 blur-2xl transition group-hover:bg-[#54f3b3]/16" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] font-mono text-sm font-black text-[#54f3b3]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="break-words text-3xl font-black leading-[1.02] text-white">{circle.name || circle.circleId}</h3>
            <p className="mt-2 break-all font-mono text-xs text-[#68867b]">{circle.circleId}</p>
          </div>
        </div>
        {status}
      </div>

      <p className="relative mt-5 line-clamp-3 break-words text-sm font-semibold leading-7 text-[#9db9af]">{circle.description || 'No description provided.'}</p>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <MiniMetric label="Members" value={String(circle.members?.length || 0)} />
        <MiniMetric label="Creator" value={shortAddress(circle.creatorAddress || '') || 'Unknown'} />
      </div>

      {children}

      <div className="relative mt-auto grid gap-4 pt-6 2xl:grid-cols-[1fr_auto] 2xl:items-center">
        <p className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-xs font-bold leading-5 text-[#68867b]">{cardJoinHelp}</p>
        <div className="flex flex-wrap items-center gap-2 2xl:justify-end">{actions}</div>
      </div>
    </article>
  );
});

function CreateStudio({
  setCreateOpen,
  password,
  setPassword,
  circleForm,
  setCircleForm,
  createDisabled,
  createCommunity,
  submittingKind,
}: {
  setCreateOpen: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
  circleForm: { name: string; description: string };
  setCircleForm: (value: { name: string; description: string }) => void;
  createDisabled: boolean;
  createCommunity: () => Promise<void>;
  submittingKind: string | null;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#010806]/80 px-6 py-8 backdrop-blur-xl">
      <button className="absolute inset-0 cursor-default" aria-label="Close create community" onClick={() => setCreateOpen(false)} />
      <section className="relative max-h-[calc(100dvh-4rem)] w-full max-w-[520px] overflow-y-auto rounded-[32px] border border-[#54f3b3]/16 bg-[#0b211a] p-5 shadow-[0_40px_140px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_20%_0%,rgba(84,243,179,0.18),transparent_58%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#54f3b3]">Create</p>
              <h2 className="mt-3 text-3xl font-black leading-none text-white">New circle</h2>
            </div>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>Close</Button>
          </div>

          <div className="mt-6 space-y-4">
            <Input label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required to create a community" />
            <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} placeholder="Pharos Builders" />
            <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} multiline />
            <Button disabled={createDisabled} onClick={createCommunity}>
              {submittingKind === 'createCircle' ? 'Creating...' : 'Create community'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ManualJoinStudio({
  advancedJoinOpen,
  setAdvancedJoinOpen,
  circleId,
  setCircleId,
  password,
  setPassword,
  manualJoinDisabled,
  joinCurrentCircle,
  submittingKind,
  manualJoinHelp,
}: {
  advancedJoinOpen: boolean;
  setAdvancedJoinOpen: (value: boolean) => void;
  circleId: string;
  setCircleId: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  manualJoinDisabled: boolean;
  joinCurrentCircle: () => Promise<void>;
  submittingKind: string | null;
  manualJoinHelp: string;
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#041612] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.22)]">
      <details open={advancedJoinOpen} onToggle={(event) => setAdvancedJoinOpen(event.currentTarget.open)}>
        <summary className="cursor-pointer list-none">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#68867b]">Fallback join</p>
              <h2 className="mt-3 text-2xl font-black text-white">Join by reference</h2>
            </div>
            <span className="rounded-[14px] border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-[#9db9af]">{advancedJoinOpen ? 'Close' : 'Open'}</span>
          </div>
        </summary>
        <div className="mt-5 space-y-4">
          <p className="text-sm font-semibold leading-6 text-[#68867b]">Use this when a community does not appear in the discover board.</p>
          <Input label="Community reference" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
          <Input label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required to join a community" />
          <Button disabled={manualJoinDisabled} variant="secondary" onClick={() => { void joinCurrentCircle(); }}>
            {submittingKind === 'joinCircle' ? 'Joining...' : 'Join community'}
          </Button>
          <p className="rounded-[18px] border border-white/10 bg-white/[0.03] p-3 text-xs font-bold leading-5 text-[#68867b]">{manualJoinHelp}</p>
        </div>
      </details>
    </section>
  );
}

function EmptyBoard({
  onCreate,
  title = 'No community circles found',
  copy = 'Create the first community and it will become available for other members to discover and join.',
  actionLabel = 'Create the first community',
}: {
  onCreate: () => void;
  title?: string;
  copy?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mt-8 rounded-[30px] border border-dashed border-[#54f3b3]/18 bg-black/24 p-10">
      <div className="max-w-2xl">
        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#68867b]">Empty board</p>
        <h3 className="mt-4 text-4xl font-black text-white">{title}</h3>
        <p className="mt-4 text-sm font-semibold leading-7 text-[#9db9af]">
          {copy}
        </p>
        <div className="mt-6">
          <Button variant="secondary" onClick={onCreate}>{actionLabel}</Button>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <p className="font-mono text-4xl font-black tabular-nums text-[#f2fff8]">{value}</p>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#68867b]">{label}</p>
    </div>
  );
}

function SignalStep({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="text-center">
      <span className={`mx-auto flex h-10 w-10 items-center justify-center rounded-[16px] border ${active ? 'border-[#54f3b3]/35 bg-[#54f3b3] text-[#03120f]' : 'border-white/10 bg-white/[0.04] text-[#68867b]'}`}>
        <Check className="h-4 w-4" />
      </span>
      <p className={`mt-3 text-xs font-black ${active ? 'text-[#dfffe9]' : 'text-[#68867b]'}`}>{label}</p>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[0.8fr_1.2fr] gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-[#68867b]">{label}</span>
      <span className="min-w-0 break-words text-right text-sm font-black text-[#f2fff8]">{value}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#68867b]">{label}</p>
      <p className="mt-2 min-h-6 break-words text-lg font-black text-white">{value}</p>
    </div>
  );
}

function FlowStep({ active, index, title, copy }: { active: boolean; index: string; title: string; copy: string }) {
  return (
    <div className={`grid grid-cols-[auto_1fr] gap-3 rounded-[20px] border p-4 transition ${active ? 'border-emerald-300/25 bg-emerald-300/10' : 'border-white/10 bg-black/20'}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-[14px] font-mono text-xs font-black ${active ? 'bg-emerald-300 text-[#03120f]' : 'bg-white/10 text-[#9db9af]'}`}>
        {index}
      </span>
      <div className="min-w-0">
        <p className="font-black text-[#f2fff8]">{title}</p>
        <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#9db9af]">{copy}</p>
      </div>
    </div>
  );
}

function isCircleMember(circle: CircleView | null, currentAddress: string) {
  return Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
}

function walletStatus(circle: CircleView | null, currentAddress: string, hasProfile: boolean): WalletCircleStatus {
  if (!currentAddress) return 'No wallet selected';
  if (!hasProfile) return 'Profile required';
  if (circle?.creatorAddress && cleanHex(circle.creatorAddress) === cleanHex(currentAddress)) return 'Creator';
  if (isCircleMember(circle, currentAddress)) return 'Joined';
  return 'Not joined';
}

function statusTone(status: WalletCircleStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'Creator' || status === 'Joined') return 'success';
  if (status === 'No wallet selected' || status === 'Profile required') return 'warning';
  return 'neutral';
}

function describeJoinCircleError(error: string, circleId: string, circleName?: string): JoinErrorInfo {
  const lower = error.toLowerCase();
  const step = lower.includes('select an account')
    ? 'wallet selection'
    : lower.includes('password')
      ? 'wallet password'
      : lower.includes('circle id is required')
        ? 'community reference'
        : lower.includes('fetch') || lower.includes('network') || lower.includes('rpc')
          ? 'local services'
          : 'community join submission';
  const target = circleName ? `${circleName} (${circleId})` : circleId || 'the selected community';
  return {
    title: 'Unable to join this community',
    detail: `Problem at ${step} for ${target}: ${error}`,
  };
}

function slugifyCircleId(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'community';
}
