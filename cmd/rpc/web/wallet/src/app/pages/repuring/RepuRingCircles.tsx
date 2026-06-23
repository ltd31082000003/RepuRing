import React from 'react';
import { ActiveWalletBanner, Badge, Button, EmptyState, Input, MemberList, MetricCard, PageHeader, Panel, RepuRingPage, SectionHeader, StatusPill, TxStatusCard, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { CircleView, useRepuRing } from './useRepuRing';

type WalletCircleStatus = 'Creator' | 'Joined' | 'Not joined' | 'No wallet selected' | 'No profile';

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
  const refreshStateRef = React.useRef(refreshState);

  React.useEffect(() => {
    refreshStateRef.current = refreshState;
  }, [refreshState]);

  const memberCount = circle?.members?.length || 0;
  const isMember = isCircleMember(circle, currentAddress);
  const selectedStatus = walletStatus(circle, currentAddress, Boolean(profile));
  const selectedStatusTone = statusTone(selectedStatus);
  const createDisabled = !currentAddress || !profile || !password || !circleId.trim() || !circleForm.name.trim();
  const manualJoinDisabled = !currentAddress || !profile || !password || !circle?.circleId || isMember;
  const manualJoinHelp = !currentAddress
    ? 'Select a wallet first.'
    : !profile
      ? 'Create a profile first.'
      : !circle?.circleId
        ? 'Select a circle first.'
        : isMember
          ? 'Already joined.'
          : !password
            ? "Enter this wallet's password to join."
            : 'Ready to join this circle.';

  async function selectCircle(nextCircleId: string) {
    setCircleId(nextCircleId);
    if (nextCircleId === circleId) await refreshState();
  }

  async function joinDiscoveredCircle(targetCircleId: string) {
    setCircleId(targetCircleId);
    const joined = await submit('joinCircle', { circleId: targetCircleId });
    if (joined) {
      setJoinCircleId('');
      await refreshStateRef.current();
    }
  }

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Project circles"
        title="Project communities for contribution reputation."
        copy="Alice creates a circle here. Bob uses Discover Circles to join it. Do not use Create Circle when you only want to join."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh selected circle</Button>}
      />

      <ActiveWalletBanner
        currentAddress={currentAddress}
        username={profile?.username}
        circleName={circle?.name}
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
        <SectionHeader
          eyebrow="Active / selected circle"
          title={circle?.name || 'No project circle loaded'}
          copy={circle?.description || 'Select a circle from Discover Circles, or create the first project circle as Alice.'}
          actions={<Button variant="secondary" onClick={refreshState}>Refresh selected circle</Button>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Circle ID" value={circle?.circleId || circleId || 'None'} detail="Selected project community key." tone="cyan" />
          <MetricCard label="Description" value={circle?.description ? 'Loaded' : 'None'} detail={circle?.description || 'No selected circle description.'} />
          <MetricCard label="Creator" value={shortAddress(circle?.creatorAddress || '') || 'Unknown'} detail={circle?.creatorAddress || 'Create or select a circle to load creator.'} />
          <MetricCard label="Members" value={String(memberCount)} detail="Profiles joined to this circle." tone="emerald" />
          <MetricCard label="Wallet status" value={selectedStatus} detail={currentAddress || 'Select a signing key in My Account.'} tone={selectedStatusTone === 'success' ? 'emerald' : 'neutral'} />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone={selectedStatusTone}>{selectedStatus}</StatusPill>
          <Badge tone="cyan">Selected: {circle?.circleId || circleId || 'none'}</Badge>
          {circle?.name && <Badge tone="zinc">{circle.name}</Badge>}
        </div>
        {!circle && (
          <EmptyState
            title="No project circle loaded"
            copy="Select a discovered circle to load its context. If no circles exist yet, Alice should create the first one below."
            actions={<Button variant="secondary" onClick={() => setCreateOpen(true)}>Open Create Circle</Button>}
          />
        )}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Discover circles"
          title="Select and join existing project groups"
          copy="Use these cards for existing circles. Selecting a circle loads that circle context automatically; joining happens inside the card."
          actions={<Button variant="secondary" onClick={refreshState}>Refresh circles</Button>}
        />
        {circles.length === 0 ? (
          <EmptyState
            title="No project circles yet"
            copy="No project circles yet. Create the first one as Alice."
            actions={<Button variant="secondary" onClick={() => setCreateOpen(true)}>Create the first circle</Button>}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {circles.map((item) => {
              const itemStatus = walletStatus(item, currentAddress, Boolean(profile));
              const itemSelected = item.circleId === circleId;
              const itemIsMember = itemStatus === 'Creator' || itemStatus === 'Joined';
              const joinExpanded = joinCircleId === item.circleId;
              const cardJoinDisabled = !currentAddress || !profile || !password || itemIsMember;
              const cardJoinHelp = !currentAddress
                ? 'Select a wallet first.'
                : !profile
                  ? 'Create a profile first.'
                  : itemIsMember
                    ? 'Already joined.'
                    : !password
                      ? "Enter this wallet's password to join."
                      : 'Ready to join this circle.';
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
                    <Button variant={itemSelected ? 'primary' : 'secondary'} onClick={() => selectCircle(item.circleId)}>
                      {itemSelected ? 'Selected' : 'Select'}
                    </Button>
                    {!itemIsMember && (
                      <Button variant="secondary" disabled={!currentAddress || !profile} onClick={() => setJoinCircleId(joinExpanded ? '' : item.circleId)}>
                        {joinExpanded ? 'Hide join' : 'Join'}
                      </Button>
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
          eyebrow="Create circle"
          title="Create a new project circle"
          copy="Use this flow only when Alice is starting a new project community. Bob should join from Discover Circles instead."
          actions={<Button variant="secondary" onClick={() => setCreateOpen((open) => !open)}>{createOpen ? 'Hide create' : 'Open create'}</Button>}
        />
        {createOpen ? (
          <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
            <Input label="Signing password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
            <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
            <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} placeholder="Pharos Builders" />
            <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} multiline />
            <div className="flex flex-wrap gap-3">
              <Button disabled={createDisabled} onClick={() => { void submit('createCircle', { circleId, ...circleForm }); }}>Create project circle</Button>
              <Badge tone="zinc">CreateCircleTx</Badge>
            </div>
            <p className="text-sm text-zinc-500">Alice creates a circle here. Do not use Create Circle when you only want to join.</p>
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
        {circle ? (
          <MemberList values={circle.members || []} currentAddress={currentAddress} creatorAddress={circle.creatorAddress} />
        ) : (
          <EmptyState
            title="No members to show"
            copy="Load or create a project circle, then join it with a second wallet to prepare the contribution endorsement demo."
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
  if (!hasProfile) return 'No profile';
  if (circle?.creatorAddress && cleanHex(circle.creatorAddress) === cleanHex(currentAddress)) return 'Creator';
  if (isCircleMember(circle, currentAddress)) return 'Joined';
  return 'Not joined';
}

function statusTone(status: WalletCircleStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'Creator' || status === 'Joined') return 'success';
  if (status === 'No wallet selected' || status === 'No profile') return 'warning';
  return 'neutral';
}
