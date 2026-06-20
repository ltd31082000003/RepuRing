import React from 'react';
import { Badge, Button, EmptyState, Input, MemberList, MetricCard, PageHeader, Panel, RepuRingPage, SectionHeader, StatusPill, TxStatusCard, shortAddress } from './components';
import { useRepuRing } from './useRepuRing';

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
    status,
    lastTx,
    refreshState,
    submit,
  } = useRepuRing();
  const [actionsOpen, setActionsOpen] = React.useState(!circle);
  const memberCount = circle?.members?.length || 0;
  const isMember = Boolean(currentAddress && circle?.members?.includes(currentAddress));

  return (
    <RepuRingPage>
      <PageHeader
        eyebrow="Project circles"
        title="Project communities for contribution reputation."
        copy="A circle is the project/community hub that connects members, contribution proofs, peer endorsements, and role claims."
        actions={<Button variant="secondary" onClick={refreshState}>Refresh circle</Button>}
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

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="overflow-hidden">
          <SectionHeader
            eyebrow="Project context"
            title={circle?.name || 'No project circle loaded'}
            copy={circle?.description || 'Enter a circle ID and refresh, or create a new project circle from Circle Actions.'}
            actions={<StatusPill tone={isMember ? 'success' : 'neutral'}>{isMember ? 'You are a member' : 'Not joined'}</StatusPill>}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Circle ID" value={circle?.circleId || circleId || 'None'} detail="Shared project community key." tone="cyan" />
            <MetricCard label="Members" value={String(memberCount)} detail="Profiles joined to this circle." tone="emerald" />
            <MetricCard label="Creator" value={shortAddress(circle?.creatorAddress || '') || 'Unknown'} detail={circle?.creatorAddress || 'Create the circle to set admin.'} />
            <MetricCard label="Selected account" value={shortAddress(currentAddress) || 'No account'} detail={currentAddress || 'Select a signing key in My Account.'} />
          </div>
          {!circle && (
            <EmptyState
              title="No project circle loaded"
              copy="Enter an existing circle ID and refresh, or open Circle Actions to create a Web3 project community."
              actions={<Button variant="secondary" onClick={() => setActionsOpen(true)}>Open circle actions</Button>}
            />
          )}
        </Panel>

        <Panel>
          <SectionHeader
            eyebrow="Circle actions"
            title="Create or join a project."
            copy="Select a local wallet and enter its password to sign real circle transactions through RPC 50002/50003."
            actions={<Button variant="secondary" onClick={() => setActionsOpen((open) => !open)}>{actionsOpen ? 'Hide actions' : 'Open actions'}</Button>}
          />
          {actionsOpen ? (
            <div className="space-y-4 rounded-3xl border border-white/10 bg-black/20 p-4">
              <Input label="Signing key password" type="password" value={password} onChange={setPassword} placeholder="Required for BLS signing" />
              <Input label="Circle ID" value={circleId} onChange={setCircleId} placeholder="pharos-builders" />
              <Input label="Name" value={circleForm.name} onChange={(name) => setCircleForm({ ...circleForm, name })} placeholder="Pharos Builders" />
              <Input label="Description" value={circleForm.description} onChange={(description) => setCircleForm({ ...circleForm, description })} multiline />
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => { void submit('createCircle', { circleId, ...circleForm }); }}>Create project circle</Button>
                <Button variant="secondary" onClick={() => { void submit('joinCircle', { circleId }); }}>Join project circle</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="zinc">CreateCircleTx</Badge>
                <Badge tone="zinc">JoinCircleTx</Badge>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Badge tone="zinc">CreateCircleTx</Badge>
              <Badge tone="zinc">JoinCircleTx</Badge>
              <Badge tone="cyan">Circle ID: {circleId || 'not set'}</Badge>
            </div>
          )}
        </Panel>
      </section>

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
