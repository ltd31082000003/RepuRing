import React from 'react';
import {
  AccountStateSection,
  DashboardPreview,
  RepuRingFooter,
  RepuRingPage,
  ReputationModelSection,
  WorkspaceMapSection,
  roleForReputation,
} from './components';
import { cleanHex } from './RepuRingProvider';
import { useRepuRing } from './useRepuRing';

export default function RepuRingOverview(): JSX.Element {
  const { currentAddress, profile, role, circle, circles } = useRepuRing();
  const derivedRole = role?.role || roleForReputation(profile?.reputation || 0);
  const normalizedAddress = cleanHex(currentAddress);
  const isCircleMember = Boolean(normalizedAddress && circle?.members?.some((item) => cleanHex(item) === normalizedAddress));
  const isCircleCreator = Boolean(normalizedAddress && circle?.creatorAddress && cleanHex(circle.creatorAddress) === normalizedAddress);
  const hasActiveCommunity = Boolean(currentAddress && profile && circle && (isCircleMember || isCircleCreator));
  const joinedCircleIds = new Set<string>();
  for (const item of circles) {
    const isMember = Boolean(normalizedAddress && item.members?.some((member) => cleanHex(member) === normalizedAddress));
    const isCreator = Boolean(normalizedAddress && item.creatorAddress && cleanHex(item.creatorAddress) === normalizedAddress);
    if ((isMember || isCreator) && item.circleId) joinedCircleIds.add(item.circleId);
  }
  if (hasActiveCommunity && circle?.circleId) joinedCircleIds.add(circle.circleId);
  const joinedCount = currentAddress && profile ? joinedCircleIds.size : 0;
  const communityState = !currentAddress
    ? {
        value: 'Not selected',
        countLabel: '',
        helper: 'Select a wallet and join or open a community.',
        ctaLabel: 'Select Wallet',
        ctaTo: '/key-management',
        active: false,
      }
    : !profile
      ? {
          value: 'Locked',
          countLabel: '',
          helper: 'Create a profile before joining a community.',
          ctaLabel: 'Create Profile',
          ctaTo: '/key-management',
          active: false,
        }
      : joinedCount > 0
        ? {
            value: 'Participated',
            countLabel: String(joinedCount),
            helper: joinedCount === 1 ? '1 community joined.' : `${joinedCount} communities joined.`,
            ctaLabel: 'Open Community',
            ctaTo: '/repuring/community',
            active: true,
          }
        : {
            value: 'Not joined yet',
            countLabel: '',
            helper: 'Join or create a community circle to start contributing.',
            ctaLabel: 'Community circles',
            ctaTo: '/repuring/circles',
            active: false,
          };

  return (
    <RepuRingPage>
      <DashboardPreview
        currentAddress={currentAddress}
        profileName={profile?.username || ''}
        avatarUrl={profile?.avatarUrl || ''}
        hasProfile={Boolean(profile)}
        communityState={communityState}
        reputation={profile?.reputation || 0}
        role={derivedRole}
      />

      <WorkspaceMapSection />

      <ReputationModelSection
        currentAddress={currentAddress}
        reputation={profile?.reputation || 0}
        communityState={communityState}
        role={derivedRole}
        hasProfile={Boolean(profile)}
      />

      <AccountStateSection profileName={profile?.username || ''} hasProfile={Boolean(profile)} />

      <RepuRingFooter />
    </RepuRingPage>
  );
}
