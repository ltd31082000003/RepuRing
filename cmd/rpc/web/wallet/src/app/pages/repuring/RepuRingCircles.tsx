import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveWalletBanner, Badge, Button, EmptyState, Input, MemberList, MetricCard, PageHeader, Panel, RepuRingPage, SectionHeader, StatusPill, TxStatusCard, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { CircleView, useRepuRing } from './useRepuRing';

type WalletCircleStatus = 'Creator' | 'Joined' | 'Not joined' | 'No wallet selected' | 'Profile required';

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
    refreshState,
    submit,
  } = useRepuRing();
  const [createOpen, setCreateOpen] = React.useState(!circle);
  const [advancedJoinOpen, setAdvancedJoinOpen] = React.useState(false);
  const [joinCircleId, setJoinCircleId] = React.useState('');
  const [contextNotice, setContextNotice] = React.useState('');
  const currentContextRef = React.useRef<HTMLElement | null>(null);
  const refreshStateRef = React.useRef(refreshState);
  const navigate = useNavigate();

  React.useEffect(() => {
    refreshStateRef.current = refreshState;
  }, [refreshState]);

  const discoveredSelectedCircle = circles.find((item) => item.circleId === circleId) || null;
  const activeCircle = circle?.circleId === circleId ? circle : discoveredSelectedCircle;
  const activeCircleNeedsRefresh = Boolean(activeCircle && circle?.circleId !== activeCircle.circleId);
  const memberCount = activeCircle?.members?.length || 0;
  const isMember = isCircleMember(activeCircle, currentAddress);
  const selectedStatus = walletStatus(activeCircle, currentAddress, Boolean(profile));
  const selectedStatusTone = statusTone(selectedStatus);
  const createDisabled = !currentAddress || !profile || !password || !circleId.trim() || !circleForm.name.trim();
  const manualJoinDisabled = !currentAddress || !profile || !password || !activeCircle?.circleId || isMember;
  const manualJoinHelp = !currentAddress
    ? 'Select a wallet first.'
    : !profile
      ? 'Create a profile first.'
      : !activeCircle?.circleId
        ? 'Open a circle first.'
        : isMember
          ? 'Already joined.'
          : !password
            ? "Enter this wallet's password to join."
            : 'Ready to join this circle.';

  async function setCurrentCircleContext(nextCircleId: string, scrollToContext: boolean) {
    setCircleId(nextCircleId);
    setContextNotice('This circle is now the current context. The feed, endorsements, leaderboard, and roles use this circle.');
    if (scrollToContext) currentContextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (nextCircleId === circleId) {
      await refreshState();
    } else {
      window.setTimeout(() => { void refreshStateRef.current(); }, 0);
    }
  }

  async function openCommunity(nextCircleId: string) {
    await setCurrentCircleContext(nextCircleId, false);
    navigate('/repuring/community');
  }

  async function previewCommunity(nextCircleId: string) {
    await setCurrentCircleContext(nextCircleId, true);
  }

  function prepareJoinCircle(nextCircleId: string, expanded: boolean) {
    void setCurrentCircleContext(nextCircleId, false);
    setJoinCircleId(expanded ? '' : nextCircleId);
  }

  async function joinDiscoveredCircle(targetCircleId: string) {
    setCircleId(targetCircleId);
    setContextNotice('This circle is now the current context. The feed, endorsements, leaderboard, and roles use this circle.');
    const joined = await submit('joinCircle', { circleId: targetCircleId });
    if (joined) {
      setJoinCircleId('');
      await refreshStateRef.current();
      navigate('/repuring/community');
    }
  }

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Project circles"
        title="Project communities for contribution reputation."
        copy="Create a new project community, or join an existing one from Discover Circles. Circle creators start new communities here; members join existing circles from Discover Circles."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh current context</Button>}
      />

      <ActiveWalletBanner
        currentAddress={currentAddress}
        username={profile?.username}
        circleName={activeCircle?.name}
        isMember={isMember}
        hasProfile={Boolean(profile)}
      />

      {!profile && (
        <Panel className="border-amber-300/20 bg-amber-300/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-amber-100">Create your RepuRing profile first</h2>
              <p className="mt-2 text-sm leading-6 text-amber-100/80">
                Profiles live in My Account because they represent your Social-Fi identity.
              </p>
            </div>
            <Button to="/key-management" variant="secondary">Open My Account</Button>
          </div>
        </Panel>
      )}

      <Panel className="overflow-hidden">
        <section ref={currentContextRef} className="scroll-mt-20">
          <SectionHeader
            eyebrow="Current circle context"
            title={activeCircle?.name || 'No project circle loaded'}
            copy="This circle is used by the contribution feed, endorsement review, leaderboard, and role actions."
            actions={<Button variant="secondary" onClick={refreshState}>Refresh current context</Button>}
          />
        </section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Circle ID" value={activeCircle?.circleId || circleId || 'None'} detail="Current project community key." tone="cyan" />
          <MetricCard label="Description" value={activeCircle?.description ? 'Loaded' : 'None'} detail={activeCircle?.description || 'No current circle description.'} />
          <MetricCard label="Creator" value={shortAddress(activeCircle?.creatorAddress || '') || 'Unknown'} detail={activeCircle?.creatorAddress || 'Create or open a circle to load creator.'} />
          <MetricCard label="Members" value={String(memberCount)} detail="Profiles joined to this circle." tone="emerald" />
          <MetricCard label="Wallet status" value={selectedStatus} detail={currentAddress || 'Select a signing key in My Account.'} tone={selectedStatusTone === 'success' ? 'emerald' : 'neutral'} />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={selectedStatusTone}>{selectedStatus}</StatusPill>
          <Badge tone="cyan">Current context: {activeCircle?.circleId || circleId || 'none'}</Badge>
          {activeCircle?.name && <Badge tone="zinc">{activeCircle.name}</Badge>}
          {activeCircleNeedsRefresh && <Badge tone="zinc">Refreshing current context</Badge>}
        </div>
        {contextNotice && <p className="text-sm leading-6 text-emerald-100/80">{contextNotice}</p>}
        {!activeCircle && (
          <EmptyState
            title="No project circle loaded"
            copy="Open a discovered circle to use it across contributions, endorsements, leaderboard, and role actions."
            actions={<Button variant="secondary" onClick={() => setCreateOpen(true)}>Create new community</Button>}
          />
        )}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Discover circles"
          title="Discover project communities"
          copy="Open a community to make it the current context, or join from the card when your profile is ready."
          actions={<Button variant="secondary" onClick={refreshState}>Refresh circles</Button>}
        />
        {circles.length === 0 ? (
          <EmptyState
            title="No project communities found"
            copy="Create the first project community, then other members can discover and join it."
            actions={<Button variant="secondary" onClick={() => setCreateOpen(true)}>Create the first project community</Button>}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {circles.map((item) => {
              const itemStatus = walletStatus(item, currentAddress, Boolean(profile));
              const itemSelected = item.circleId === circleId;
              const itemIsMember = itemStatus === 'Creator' || itemStatus === 'Joined';
              const joinExpanded = joinCircleId === item.circleId;
              const cardJoinDisabled = !currentAddress || !profile || !password || itemIsMember;
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
                <div key={item.circleId} className={['rounded-3xl border p-4 shadow-xl shadow-black/20', itemSelected ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-white/[0.04]'].join(' ')}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-semibold text-white">{item.name || item.circleId}</h3>
                      <p className="mt-1 break-all font-mono text-xs text-zinc-500">{item.circleId}</p>
                    </div>
                    <StatusPill tone={statusTone(itemStatus)}>{itemStatus}</StatusPill>
                  </div>
                  <p className="mt-3 break-words text-sm leading-6 text-zinc-400">{item.description || 'No description provided.'}</p>
                  <div className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
                    <div>Members <span className="font-semibold text-zinc-200">{item.members?.length || 0}</span></div>
                    <div>Creator <span className="font-mono text-zinc-300">{shortAddress(item.creatorAddress)}</span></div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
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
                          Preview community
                        </Button>
                      </>
                    )}
                    <Badge tone="zinc">JoinCircleTx</Badge>
                  </div>
                  {joinExpanded && !itemIsMember && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                      <Input label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required for this wallet signature" />
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button disabled={cardJoinDisabled} onClick={() => joinDiscoveredCircle(item.circleId)}>Confirm JoinCircleTx</Button>
                        <Badge tone="cyan">{shortAddress(currentAddress) || 'No wallet'}</Badge>
                      </div>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-zinc-500">{cardJoinHelp}</p>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Create new community"
          title="Create a new project community"
          copy="Start a new project circle. Existing members should join from Discover Circles."
          actions={<Button variant="secondary" onClick={() => setCreateOpen((open) => !open)}>{createOpen ? 'Hide create' : 'Open create'}</Button>}
        />
        {createOpen ? (
          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
            <Input label="Signing password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
            <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} placeholder="Pharos Builders" />
            <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} multiline />
            <div className="flex flex-wrap gap-3">
              <Button disabled={createDisabled} onClick={() => { void submit('createCircle', { circleId, ...circleForm }); }}>Create community</Button>
              <Badge tone="zinc">CreateCircleTx</Badge>
            </div>
            <p className="text-sm text-zinc-500">Circle creators start new communities here. Members join existing circles from Discover Circles.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Badge tone="zinc">CreateCircleTx</Badge>
            <Badge tone="cyan">Circle ID: {circleId || 'not set'}</Badge>
          </div>
        )}

        <details className="rounded-3xl border border-white/10 bg-black/20 p-4" open={advancedJoinOpen} onToggle={(event) => setAdvancedJoinOpen(event.currentTarget.open)}>
          <summary className="cursor-pointer text-sm font-semibold text-zinc-200">Advanced: join by circle ID</summary>
          <div className="mt-4 space-y-4">
            <p className="text-sm leading-6 text-zinc-500">Use this only if a circle does not appear in Discover Circles.</p>
            <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
            <Input label="Signing password" type="password" value={password} onChange={setPassword} placeholder="Required for JoinCircleTx" />
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled={manualJoinDisabled} variant="secondary" onClick={() => { void submit('joinCircle', { circleId }); }}>JoinCircleTx</Button>
              <Badge tone="zinc">Manual fallback</Badge>
            </div>
            <p className="text-sm text-zinc-500">{manualJoinHelp}</p>
          </div>
        </details>
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Members"
          title="Circle member graph"
          copy="Creator and current-account badges make the loaded membership state explicit."
        />
        {activeCircle ? (
          <MemberList values={activeCircle.members || []} currentAddress={currentAddress} creatorAddress={activeCircle.creatorAddress} />
        ) : (
          <EmptyState
            title="No members to show"
            copy="Open or create a project circle, then members can join and appear here."
            actions={<Button variant="secondary" onClick={refreshState}>Refresh members</Button>}
          />
        )}
      </Panel>

      <TxStatusCard status={status} lastTx={lastTx} onRefresh={refreshState} />
    </RepuRingPage>
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
