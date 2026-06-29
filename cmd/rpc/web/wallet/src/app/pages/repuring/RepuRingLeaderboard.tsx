import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge, Button, EmptyState, RepuRingPage, roleBadge, roleForReputation, shortAddress } from './components';
import { cleanHex } from './RepuRingProvider';
import { LeaderboardRow, useRepuRing } from './useRepuRing';

export default function RepuRingLeaderboard(): JSX.Element {
  const { currentAddress, profile, circleId, circles, leaderboard, circle, refreshState } = useRepuRing();
  const isMember = Boolean(currentAddress && circle?.members?.some((address) => cleanHex(address) === cleanHex(currentAddress)));
  const currentRole = roleBadge(roleForReputation(profile?.reputation || 0));
  const topTwo = leaderboard.slice(0, 2);
  const remainingRows = leaderboard.slice(2);
  const currentRankIndex = leaderboard.findIndex((row) => cleanHex(row.address) === cleanHex(currentAddress));
  const currentRankRow = currentRankIndex >= 0 ? leaderboard[currentRankIndex] : null;

  return (
    <RepuRingPage>
      <section className="relative min-h-[342px] overflow-hidden rounded-[30px] border border-[#54f3b3]/12 bg-[#05291f] px-6 py-8 shadow-[0_34px_120px_rgba(0,0,0,0.36)] sm:px-10 sm:py-10 lg:px-[42px] lg:py-[42px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(84,243,179,0.15),transparent_34%),linear-gradient(120deg,rgba(84,243,179,0.06),rgba(3,18,15,0)_52%),linear-gradient(160deg,transparent_52%,#02091a_100%)]" />
        <div className="relative grid min-h-[258px] gap-8 lg:grid-cols-[1fr_0.68fr] lg:items-center">
          <div className="max-w-[690px]">
            <p className="text-[12px] font-black uppercase tracking-[0.42em] text-[#54f3b3]">Reputation rankings</p>
            <h1 className="mt-6 max-w-[590px] text-5xl font-black leading-[0.98] text-[#f2fff8] sm:text-6xl lg:text-[64px]">
              <span className="block">Reputation</span>
              <span className="block">leaderboard</span>
            </h1>
            <p className="mt-7 max-w-[720px] text-lg font-semibold leading-8 text-[#a6bbb3] lg:text-[19px]">
              See contributors ranked by global profile reputation in the selected community context. Built for quick trust checks without the clutter.
            </p>
          </div>

          <div className="w-full max-w-[506px] justify-self-end rounded-[24px] border border-[#b8fff0]/12 bg-[#163b34]/82 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.30)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#76958b]">Live context</p>
                <h2 className="mt-3 text-[20px] font-black leading-tight text-white">Global profile reputation</h2>
              </div>
              <Button onClick={refreshState} className="shrink-0 gap-2 !rounded-full !px-6 !py-3 !shadow-[0_14px_34px_rgba(84,243,179,0.16)]">
                <RefreshCw size={15} strokeWidth={2.5} />
                Refresh rankings
              </Button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ContextTile label="Community" value={circle?.name || circleId || 'No community'} />
              <ContextTile label="Ranking mode" value="Reputation score" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-[22px] lg:grid-cols-[0.414fr_0.586fr]">
        <WalletRoleCard
          currentAddress={currentAddress}
          roleLabel={currentRole}
          isMember={isMember}
          hasProfile={Boolean(profile)}
        />
        <CommunitySummaryCard
          circleName={circle?.name || 'No community selected'}
          circleDescription={circle?.description}
          memberCount={circle?.members?.length || 0}
          circleCount={circles.length}
          season={new Date().getFullYear()}
        />
      </section>

      <section className="grid gap-9 xl:grid-cols-[0.32fr_0.68fr] xl:items-start">
        <div className="pt-1 xl:sticky xl:top-24">
          <p className="text-[12px] font-black uppercase tracking-[0.42em] text-[#54f3b3]">Leaderboard</p>
          <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-[38px]">Ranked contributors</h2>
          <p className="mt-6 max-w-[430px] text-base font-semibold leading-8 text-[#8fb0a5]">
            A cleaner view of reputation, movement and role signals. The highest confidence contributors are surfaced first.
          </p>
          <CurrentWalletRankCard
            currentAddress={currentAddress}
            currentRank={currentRankIndex >= 0 ? currentRankIndex + 1 : null}
            currentRow={currentRankRow}
            profileReputation={profile?.reputation || 0}
            roleLabel={currentRole}
          />
        </div>

        <div className="rounded-[28px] border border-[#54f3b3]/10 bg-[#062019]/62 p-4 shadow-[0_26px_90px_rgba(0,0,0,0.26)] sm:p-[18px]">
          {leaderboard.length === 0 ? (
            <EmptyState
              title="No reputation yet"
              copy="Reputation appears after another community member endorses a contribution proof."
              actions={<Button to="/repuring/community" variant="secondary">Open community</Button>}
            />
          ) : (
            <div className="space-y-4">
              {topTwo.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {topTwo.map((row, index) => (
                    <FeaturedRankCard key={row.address} row={row} rank={index + 1} currentAddress={currentAddress} />
                  ))}
                </div>
              )}
              <div className="grid gap-3">
                {remainingRows.map((row, index) => (
                  <CompactRankRow key={row.address} row={row} rank={index + 3} currentAddress={currentAddress} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </RepuRingPage>
  );
}

function CurrentWalletRankCard({
  currentAddress,
  currentRank,
  currentRow,
  profileReputation,
  roleLabel,
}: {
  currentAddress: string;
  currentRank: number | null;
  currentRow: LeaderboardRow | null;
  profileReputation: number;
  roleLabel: string;
}) {
  const score = currentRow?.reputation ?? profileReputation;
  const label = currentRow?.username || shortAddress(currentAddress) || 'No wallet selected';
  const rankLabel = currentRank ? `#${String(currentRank).padStart(2, '0')}` : '--';

  return (
    <section className="mt-10 min-h-[248px] max-w-[486px] rounded-[28px] border border-[#54f3b3]/12 bg-[#03120f]/72 p-6 shadow-[inset_0_1px_0_rgba(84,243,179,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#54f3b3]">Your wallet rank</p>
          <h3 className="mt-5 text-[42px] font-black leading-none text-white">{rankLabel}</h3>
        </div>
        <span className="rounded-full border border-[#54f3b3]/16 bg-[#10342c] px-3 py-1 text-xs font-black text-[#bdf8df]">
          {currentRank ? 'Ranked' : 'Unranked'}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <div className="rounded-[16px] border border-[#54f3b3]/10 bg-[#09251f] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#78968c]">Wallet</p>
          <p className="mt-3 truncate font-mono text-sm font-black text-white">{label}</p>
        </div>
        <div className="rounded-[16px] border border-[#54f3b3]/10 bg-[#09251f] p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#78968c]">Score</p>
          <p className="mt-3 text-xl font-black leading-none text-white">{formatScore(score)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#54f3b3]/10 pt-4">
        <p className="text-sm font-bold text-[#91aea4]">{roleLabel}</p>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#54f3b3]">Current wallet</p>
      </div>
    </section>
  );
}

function ContextTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[82px] rounded-[16px] border border-[#54f3b3]/10 bg-[#062d25]/78 px-4 py-4">
      <p className="text-[12px] font-black leading-none text-[#6f8f84]">{label}</p>
      <p className="mt-3 truncate text-base font-black text-white">{value}</p>
    </div>
  );
}

function WalletRoleCard({
  currentAddress,
  roleLabel,
  isMember,
  hasProfile,
}: {
  currentAddress: string;
  roleLabel: string;
  isMember: boolean;
  hasProfile: boolean;
}) {
  return (
    <section className="min-h-[309px] rounded-[28px] border border-[#54f3b3]/12 bg-[#062f25] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.24)] lg:p-[26px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] font-black uppercase tracking-[0.42em] text-[#54f3b3]">Active wallet / community role</p>
          <p className="mt-6 break-all font-mono text-sm font-black text-white">{shortAddress(currentAddress) || 'No wallet selected'}</p>
        </div>
        <Badge tone={hasProfile ? 'emerald' : 'zinc'}>{hasProfile ? 'Verified' : 'No profile'}</Badge>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Badge tone={hasProfile ? 'emerald' : 'zinc'}>{roleLabel}</Badge>
        <Badge tone={isMember ? 'emerald' : 'zinc'}>{isMember ? 'Circle member' : 'Not joined'}</Badge>
      </div>
      <div className="mt-7 border-t border-[#54f3b3]/10 pt-6">
        <p className="max-w-[470px] text-[15px] font-semibold leading-8 text-[#91aea4]">
          This wallet confirms actions for the selected community. Check the active wallet before submitting.
        </p>
      </div>
    </section>
  );
}

function CommunitySummaryCard({
  circleName,
  circleDescription,
  memberCount,
  circleCount,
  season,
}: {
  circleName: string;
  circleDescription?: string;
  memberCount: number;
  circleCount: number;
  season: number;
}) {
  return (
    <section className="flex min-h-[309px] flex-col justify-between rounded-[28px] border border-[#54f3b3]/10 bg-[#031511] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.28)] lg:p-[26px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[12px] font-black uppercase tracking-[0.42em] text-[#54f3b3]">Current community context</p>
          <h2 className="mt-6 break-words text-[26px] font-black leading-tight text-white">{circleName}</h2>
          <p className="mt-5 max-w-[650px] text-[15px] font-semibold leading-8 text-[#91aea4]">
            {circleDescription || 'Select a community to align posts, reviews, leaderboard, and roles.'}
          </p>
        </div>
        <Button to="/repuring/circles?view=involved" variant="secondary" className="shrink-0 !rounded-full !px-5 !py-3">Change community</Button>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <SummaryMetric label="Contributors" value={String(memberCount)} />
        <SummaryMetric label="Circles" value={String(circleCount)} />
        <SummaryMetric label="Season" value={String(season)} />
      </div>
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[92px] rounded-[16px] border border-[#54f3b3]/10 bg-[#12342d]/78 p-4">
      <p className="text-[28px] font-black leading-none text-white">{value}</p>
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.28em] text-[#78968c]">{label}</p>
    </div>
  );
}

function FeaturedRankCard({ row, rank, currentAddress }: { row: LeaderboardRow; rank: number; currentAddress: string }) {
  const isCurrent = cleanHex(row.address) === cleanHex(currentAddress);
  const role = roleBadge(row.role || roleForReputation(row.reputation));
  return (
    <article className={`flex min-h-[228px] flex-col rounded-[22px] border p-5 shadow-[0_18px_70px_rgba(0,0,0,0.22)] ${isCurrent ? 'border-[#54f3b3]/44 bg-[#103d31]' : rank === 1 ? 'border-[#54f3b3]/24 bg-[#0f4437]' : 'border-[#54f3b3]/14 bg-[#0d352c]'}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`${rank === 1 ? 'bg-[#54f3b3] text-[#03120f]' : 'border border-[#54f3b3]/16 bg-[#103d31] text-[#bdf8df]'} rounded-full px-3 py-1 text-xs font-black`}>#{String(rank).padStart(2, '0')}</span>
        <span className="font-mono text-sm font-black text-[#9bf8e8]">+{row.reputation}</span>
      </div>
      <h3 className="mt-8 break-words text-[26px] font-black leading-tight text-white">{row.username || 'Unnamed'}</h3>
      <p className="mt-3 text-sm font-semibold text-[#91aea4]">{role}</p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-7">
        <p className="text-[36px] font-black leading-none text-white">{formatScore(row.reputation)}</p>
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#78968c]">Score</p>
      </div>
    </article>
  );
}

function CompactRankRow({ row, rank, currentAddress }: { row: LeaderboardRow; rank: number; currentAddress: string }) {
  const isCurrent = cleanHex(row.address) === cleanHex(currentAddress);
  const role = roleBadge(row.role || roleForReputation(row.reputation));
  return (
    <article className={`flex min-h-[86px] min-w-0 items-center gap-4 rounded-[16px] border px-4 py-3 ${isCurrent ? 'border-[#54f3b3]/36 bg-[#103d31]' : 'border-[#54f3b3]/10 bg-[#031511]'}`}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#10342c] font-mono text-sm font-black text-[#bdf8df]">#{String(rank).padStart(2, '0')}</span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-black text-white">{row.username || 'Unnamed'}</h3>
        <p className="mt-1 truncate text-sm font-semibold text-[#78968c]">{role}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-lg font-black text-white">{formatScore(row.reputation)}</p>
        <p className="text-xs font-bold text-[#54f3b3]">+{row.reputation} this cycle</p>
      </div>
    </article>
  );
}

function formatScore(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}
