import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BadgeCheck, ExternalLink, MessageSquare, Pencil, UserPlus } from 'lucide-react';
import { CurrentWallet } from '@/components/key-management/CurrentWallet';
import { ImportWallet } from '@/components/key-management/ImportWallet';
import { NewKey } from '@/components/key-management/NewKey';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { useDS } from '@/core/useDs';
import { downloadJson } from '@/helpers/download';
import { useToast } from '@/toast/ToastContext';
import { PageHeader } from '@/components/layouts/PageHeader';
import { ContributionView, useRepuRing } from '@/app/pages/repuring/useRepuRing';
import { AvatarFallback, roleBadge, shortAddress } from '@/app/pages/repuring/components';
import { cleanHex } from '@/app/pages/repuring/RepuRingProvider';

type KeyManagementModal = 'import' | 'create' | null;

export const KeyManagement = (): JSX.Element => {
    const toast = useToast();
    const { data: keystore } = useDS('keystore', {});
    const { currentAddress, profile } = useRepuRing();
    const [activeModal, setActiveModal] = React.useState<KeyManagementModal>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const handleDownloadKeys = () => {
        if (!keystore) {
            toast.error({
                title: 'No keys available',
                description: 'Keystore data has not loaded yet.',
            });
            return;
        }

        downloadJson(keystore, 'keystore');
        toast.success({
            title: 'Download started',
            description: 'Your keystore JSON is on its way.',
        });
    };

    return (
        <div className="space-y-4 pb-16 lg:space-y-6 lg:pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
            >
                <PageHeader
                    title="My Account"
                    subtitle="Manage your contributor profile and the wallet used for RepuRing actions."
                    className="w-full"
                />
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-4 lg:gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <CurrentWallet
                    avatarLabel={profile?.username || currentAddress}
                    avatarUrl={profile?.avatarUrl}
                    onDownloadFullKeystore={handleDownloadKeys}
                    onOpenCreate={() => setActiveModal('create')}
                    onOpenImport={() => setActiveModal('import')}
                />
                <RepuRingProfileCard />
                <AccountPostsSection />
                <ProfileStatusFooter />
            </motion.div>

            <Dialog open={activeModal !== null} onOpenChange={(open) => !open && setActiveModal(null)}>
                <DialogContent
                    title={
                        activeModal === 'import'
                                ? 'Import Wallet'
                                : 'Create New Key'
                    }
                    className="max-h-[90vh] max-w-[min(96vw,56rem)] gap-0 overflow-hidden border-[#272729] bg-[#171717] p-0"
                >
                    <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
                        {activeModal === 'import' ? <ImportWallet embedded onSuccess={() => setActiveModal(null)} /> : null}
                        {activeModal === 'create' ? <NewKey embedded onSuccess={() => setActiveModal(null)} /> : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

function RepuRingProfileCard(): JSX.Element {
    const {
        currentAddress,
        password,
        setPassword,
        profile,
        profileForm,
        setProfileForm,
        role,
        status,
        submittingKind,
        submit,
    } = useRepuRing();
    const [profileModalOpen, setProfileModalOpen] = React.useState(false);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [editProfileForm, setEditProfileForm] = React.useState({ bio: '', avatarUrl: '' });

    React.useEffect(() => {
        if (profile) setProfileModalOpen(false);
    }, [profile]);

    React.useEffect(() => {
        if (!profile || editModalOpen) return;
        setEditProfileForm({ bio: profile.bio || '', avatarUrl: profile.avatarUrl || '' });
    }, [editModalOpen, profile]);

    const openEditProfile = () => {
        if (!profile) return;
        setEditProfileForm({ bio: profile.bio || '', avatarUrl: profile.avatarUrl || '' });
        setEditModalOpen(true);
    };

    const submitUpdateProfile = async () => {
        const result = await submit('updateProfile', editProfileForm);
        if (result.ok) setEditModalOpen(false);
    };

    const submitCreateProfile = async () => {
        const result = await submit('createProfile', profileForm);
        if (result.ok) setProfileModalOpen(false);
    };

    const initial = profile?.username?.slice(0, 1).toUpperCase() || currentAddress.slice(0, 1).toUpperCase() || 'R';

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_18px_48px_rgba(0,0,0,0.22)] lg:rounded-3xl"
        >
            <div className="border-b border-white/10 bg-gradient-to-br from-primary/10 via-transparent to-cyan-400/10 p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <AvatarFallback
                            label={profile?.username || initial}
                            src={profile?.avatarUrl}
                            className="h-11 w-11 rounded-xl border-primary/25 bg-primary/10 text-base text-primary sm:h-14 sm:w-14 sm:rounded-2xl sm:text-xl"
                        />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">RepuRing Profile</p>
                            <h2 className="mt-1 break-words text-xl font-semibold text-foreground sm:text-2xl">
                                {profile ? profile.username : 'Create your RepuRing Profile'}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                                {profile
                                    ? profile.bio || 'Your contributor identity is active for community circles, proof-of-work posts, peer reviews, and profile reputation.'
                                    : 'Create the contributor profile required for circles, contribution proofs, reviews, reputation, and roles.'}
                            </p>
                        </div>
                    </div>
                    {profile ? (
                        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Profile active
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-end lg:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                    <ProfileMetric label="Wallet" value={shortAddress(currentAddress) || 'No account selected'} />
                    <ProfileMetric label="Reputation" value={String(profile?.reputation ?? 0)} />
                    <ProfileMetric label="Role" value={role ? roleBadge(role.role) : 'Not claimed'} />
                </div>

                {profile ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button type="button" variant="secondary" className="h-11 w-full sm:w-auto" onClick={openEditProfile}>
                            <Pencil className="h-4 w-4" />
                            Edit Profile
                        </Button>
                        <Button asChild variant="outline" className="h-11 w-full sm:w-auto">
                            <Link to="/repuring/circles">Go to Circles</Link>
                        </Button>
                        <Button asChild className="h-11 w-full sm:w-auto">
                            <Link to="/repuring/community">Open Community</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Button className="h-11 w-full sm:w-auto" onClick={() => setProfileModalOpen(true)} disabled={!currentAddress}>
                            <UserPlus className="h-4 w-4" />
                            Create Profile
                        </Button>
                        <span className="flex items-center text-xs text-muted-foreground">
                            Required before joining circles or posting contributions.
                        </span>
                    </div>
                )}
            </div>

            <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                <DialogContent title="Create your RepuRing Profile" className="max-w-[min(96vw,34rem)] border-[#272729] bg-[#171717]">
                    <DialogHeader>
                        <DialogTitle>Create your RepuRing Profile</DialogTitle>
                        <DialogDescription>
                            Create the profile other members will see in communities, proof-of-work posts, reviews, and rankings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <AccountInput label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required to create your profile" />
                        <AccountInput label="Username" value={profileForm.username} onChange={(username) => setProfileForm({ ...profileForm, username })} placeholder="alice_builder" />
                        <AccountInput label="Bio" value={profileForm.bio} onChange={(bio) => setProfileForm({ ...profileForm, bio })} placeholder="Pharos ecosystem contributor" multiline />
                        <AccountInput label="Avatar URL" value={profileForm.avatarUrl} onChange={(avatarUrl) => setProfileForm({ ...profileForm, avatarUrl })} placeholder="https://..." />
                        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                            <p className="mt-1 break-words text-sm text-muted-foreground">{status}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setProfileModalOpen(false)}>Cancel</Button>
                        <Button type="button" disabled={submittingKind === 'createProfile'} onClick={() => void submitCreateProfile()}>
                            {submittingKind === 'createProfile' ? 'Creating profile...' : 'Create profile'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent title="Edit RepuRing Profile" className="max-w-[min(96vw,34rem)] border-[#272729] bg-[#171717]">
                    <DialogHeader>
                        <DialogTitle>Edit RepuRing Profile</DialogTitle>
                        <DialogDescription>
                            Update the public details shown with your RepuRing profile. Username and reputation stay unchanged.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <AccountInput label="Wallet password" type="password" value={password} onChange={setPassword} placeholder="Required to save profile changes" />
                        <AccountInput label="Username" value={profile?.username || ''} onChange={() => undefined} disabled helperText="Username is permanent in this demo." />
                        <AccountInput label="Bio" value={editProfileForm.bio} onChange={(bio) => setEditProfileForm({ ...editProfileForm, bio })} placeholder="Update your contributor bio" multiline />
                        <AccountInput label="Avatar URL" value={editProfileForm.avatarUrl} onChange={(avatarUrl) => setEditProfileForm({ ...editProfileForm, avatarUrl })} placeholder="https://..." />
                        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                            <p className="mt-1 break-words text-sm text-muted-foreground">{status}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button type="button" disabled={submittingKind === 'updateProfile'} onClick={() => void submitUpdateProfile()}>
                            {submittingKind === 'updateProfile' ? 'Saving...' : 'Save profile changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.section>
    );
}

function AccountPostsSection(): JSX.Element {
    const { currentAddress, profile, contributions, endorsements, circle, circles, refreshState } = useRepuRing();
    const accountPosts = React.useMemo(
        () => contributions.filter((item) => cleanHex(item.authorAddress) === cleanHex(currentAddress)),
        [contributions, currentAddress],
    );
    const circleNames = React.useMemo(() => {
        const values = new Map<string, string>();
        circles.forEach((item) => values.set(item.circleId, item.name || item.circleId));
        if (circle) values.set(circle.circleId, circle.name || circle.circleId);
        return values;
    }, [circle, circles]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_18px_48px_rgba(0,0,0,0.22)] lg:rounded-3xl"
        >
            <div className="flex flex-col gap-4 border-b border-white/10 bg-black/20 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account posts</p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">Posts from this account</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        Proof-of-work posts currently loaded for {profile?.username || shortAddress(currentAddress) || 'the selected wallet'}.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" className="h-10" onClick={() => void refreshState()}>
                        Refresh
                    </Button>
                    <Button asChild variant="outline" className="h-10">
                        <Link to="/repuring/community">Open Community</Link>
                    </Button>
                </div>
            </div>

            {!currentAddress ? (
                <AccountPostsEmpty
                    title="No wallet selected"
                    copy="Select or create a wallet to view posts from that account."
                    action={<Button asChild className="h-10"><Link to="/key-management">Select wallet</Link></Button>}
                />
            ) : accountPosts.length === 0 ? (
                <AccountPostsEmpty
                    title="No posts yet"
                    copy="When this account posts proof-of-work in the loaded community, those posts will appear here."
                    action={<Button asChild className="h-10"><Link to="/repuring/community">Open Community</Link></Button>}
                />
            ) : (
                <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:p-6">
                    {accountPosts.map((item) => {
                        const reviewCount = endorsements.filter((review) => review.contributionId === item.contributionId).length;
                        return (
                            <AccountPostCard
                                key={item.contributionId}
                                item={item}
                                circleName={circleNames.get(item.circleId) || item.circleId || 'Current community'}
                                reviewCount={reviewCount}
                            />
                        );
                    })}
                </div>
            )}
        </motion.section>
    );
}

function ProfileStatusFooter(): JSX.Element {
    const { status, lastTx, refreshState } = useRepuRing();

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:px-5 sm:py-4 lg:rounded-3xl lg:px-6"
        >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0" aria-live="polite">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Profile status</p>
                    <p className="mt-1 break-words text-sm text-muted-foreground">{status}</p>
                    {lastTx ? <p className="mt-1 text-xs text-muted-foreground">{lastTx}</p> : null}
                </div>
                <Button type="button" variant="secondary" className="h-10 self-start lg:self-center" onClick={() => void refreshState()}>
                    Refresh Profile
                </Button>
            </div>
        </motion.section>
    );
}

function AccountPostCard({ item, circleName, reviewCount }: { item: ContributionView; circleName: string; reviewCount: number }) {
    return (
        <article className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.category || 'Proof-of-work'}</p>
                    <h3 className="mt-2 break-words text-lg font-semibold text-foreground">{item.title || 'Untitled post'}</h3>
                    <p className="mt-1 break-words text-xs text-muted-foreground">{circleName}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${item.slashed ? 'border-[#ff1845]/30 bg-[#ff1845]/10 text-[#ff6b84]' : 'border-primary/25 bg-primary/10 text-primary'}`}>
                    {item.slashed ? 'Slashed' : 'Active'}
                </span>
            </div>
            <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-muted-foreground">
                {item.description || 'No description provided.'}
            </p>
            <div className="mt-4 grid gap-2 rounded-xl border border-white/10 bg-black/25 p-3 text-xs">
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <span className="text-muted-foreground">Endorsements</span>
                    <span className="font-semibold text-foreground">{item.endorsementCount || 0}</span>
                </div>
                <div className="flex min-w-0 items-center justify-between gap-3">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {reviewCount}
                    </span>
                </div>
                <div className="min-w-0">
                    <span className="text-muted-foreground">Proof reference</span>
                    <p className="mt-1 break-all font-mono text-[11px] text-foreground/80">{item.contributionId}</p>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {item.proofUrl ? (
                    <Button asChild variant="outline" className="h-10">
                        <a href={item.proofUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open Proof
                        </a>
                    </Button>
                ) : null}
                <Button asChild variant="secondary" className="h-10">
                    <Link to="/repuring/community">View in Community</Link>
                </Button>
            </div>
        </article>
    );
}

function AccountPostsEmpty({ title, copy, action }: { title: string; copy: string; action: React.ReactNode }) {
    return (
        <div className="p-4 sm:p-5 lg:p-6">
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-5">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy}</p>
                <div className="mt-4">{action}</div>
            </div>
        </div>
    );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0 rounded-xl border border-white/10 bg-black/25 p-3 sm:rounded-2xl sm:p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
            <p className="mt-2 break-all text-sm font-semibold text-foreground">{value}</p>
        </div>
    );
}

function AccountInput({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    multiline = false,
    disabled = false,
    helperText,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    multiline?: boolean;
    disabled?: boolean;
    helperText?: string;
}) {
    const className = 'w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60';
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground/80">{label}</span>
            {multiline ? (
                <textarea className={`${className} min-h-24 resize-y`} value={value} placeholder={placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
            ) : (
                <input className={className} type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
            )}
            {helperText ? <span className="mt-2 block text-xs text-muted-foreground">{helperText}</span> : null}
        </label>
    );
}
