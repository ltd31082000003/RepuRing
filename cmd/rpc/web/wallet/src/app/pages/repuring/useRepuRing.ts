import React from 'react';

export type TxKind =
  | 'createProfile'
  | 'createCircle'
  | 'joinCircle'
  | 'createContribution'
  | 'endorseUser'
  | 'endorseContribution'
  | 'slashEndorsement'
  | 'claimRole';

export type ProfileView = { address: string; username: string; bio: string; avatarUrl: string; reputation: number };
export type CircleView = { circleId: string; name: string; description: string; creatorAddress: string; members: string[] };
export type RoleView = { circleId: string; address: string; role: string; reputation: number; claimedRole: boolean };
export type ContributionView = {
  contributionId: string;
  circleId: string;
  authorAddress: string;
  authorUsername: string;
  title: string;
  description: string;
  proofUrl: string;
  category: string;
  endorsementCount: number;
  slashed: boolean;
};
export type EndorsementView = { endorsementId: string; fromAddress: string; targetAddress: string; contributionId: string; tag: string; message: string; slashed: boolean; slashReason: string };
export type LeaderboardRow = { address: string; username: string; reputation: number; role: string };

export type RepuRingContextValue = {
  selectedAccount: { address?: string } | null | undefined;
  currentAddress: string;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  circleId: string;
  setCircleId: React.Dispatch<React.SetStateAction<string>>;
  targetAddress: string;
  setTargetAddress: React.Dispatch<React.SetStateAction<string>>;
  endorsementId: string;
  setEndorsementId: React.Dispatch<React.SetStateAction<string>>;
  selectedContributionId: string;
  setSelectedContributionId: React.Dispatch<React.SetStateAction<string>>;
  profileForm: { username: string; bio: string; avatarUrl: string };
  setProfileForm: React.Dispatch<React.SetStateAction<{ username: string; bio: string; avatarUrl: string }>>;
  circleForm: { name: string; description: string };
  setCircleForm: React.Dispatch<React.SetStateAction<{ name: string; description: string }>>;
  contributionForm: { contributionId: string; title: string; description: string; proofUrl: string; category: string };
  setContributionForm: React.Dispatch<React.SetStateAction<{ contributionId: string; title: string; description: string; proofUrl: string; category: string }>>;
  endorse: { tag: string; message: string };
  setEndorse: React.Dispatch<React.SetStateAction<{ tag: string; message: string }>>;
  slashReason: string;
  setSlashReason: React.Dispatch<React.SetStateAction<string>>;
  lastTx: string;
  status: string;
  profile: ProfileView | null;
  role: RoleView | null;
  circle: CircleView | null;
  contributions: ContributionView[];
  endorsements: EndorsementView[];
  leaderboard: LeaderboardRow[];
  refreshState: () => Promise<void>;
  submit: (kind: TxKind, fields: Record<string, unknown>) => Promise<void>;
};

export const RepuRingContext = React.createContext<RepuRingContextValue | null>(null);

export function useRepuRing(): RepuRingContextValue {
  const value = React.useContext(RepuRingContext);
  if (!value) throw new Error('useRepuRing must be used inside RepuRingProvider');
  return value;
}
