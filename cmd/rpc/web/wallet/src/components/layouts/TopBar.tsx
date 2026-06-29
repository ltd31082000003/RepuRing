import React from 'react';
import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { BadgeCheck, Blocks, RadioTower, UserCircle } from 'lucide-react';
import { useDS } from '@/core/useDs';

const navItems = [
    { name: 'Overview', path: '/repuring', end: true },
    { name: 'Community circles', path: '/repuring/circles' },
    { name: 'Community', path: '/repuring/community' },
    { name: 'Leaderboard', path: '/repuring/leaderboard' },
    { name: 'Admin Community', path: '/repuring/admin' },
];

const pillBase = 'inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-[18px] border px-3 text-xs font-semibold transition';

export const TopBar = (): JSX.Element => {
    const { data: blockHeight } = useDS<{ height: number }>('height', {}, {
        staleTimeMs: 10_000,
        refetchIntervalMs: 10_000,
    });
    const chainOnline = blockHeight != null;
    const chainPillClass = chainOnline
        ? `${pillBase} border-[rgba(115,255,198,0.18)] bg-[#103d31] text-[#54f3b3]`
        : `${pillBase} border-[#3b2525] bg-[#3b2525] text-[#d8b6b6]`;

    return (
        <motion.header
            className="sticky top-0 z-[100] hidden flex-shrink-0 justify-center px-4 pt-4 lg:flex"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex h-[68px] w-full max-w-[1180px] items-center justify-between gap-4 rounded-[24px] border border-[rgba(115,255,198,0.12)] bg-[#071c17]/90 px-4 shadow-[0_20px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <Link to="/repuring" className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] border border-[rgba(115,255,198,0.12)] bg-[#103d31] text-[#54f3b3]">
                        <BadgeCheck className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold leading-tight text-[#f2fff8]">RepuRing</span>
                        <span className="block truncate text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#54f3b3]">Social-Fi</span>
                    </span>
                </Link>

                <nav className="no-scrollbar flex min-w-0 flex-1 items-center justify-center gap-2 overflow-x-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                [
                                    'rounded-[18px] px-4 py-2 text-xs font-bold text-[#9db9af] transition hover:bg-[#103d31] hover:text-[#f2fff8]',
                                    isActive ? 'bg-[#103d31] text-[#54f3b3] shadow-[0_0_24px_rgba(84,243,179,0.12)]' : '',
                                ].join(' ')
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <div className={`${pillBase} hidden border-[rgba(115,255,198,0.12)] bg-[#0a211b] text-[#9db9af] xl:flex`}>
                        <RadioTower className="h-4 w-4 text-[#54f3b3]" />
                        <span>Local services</span>
                    </div>

                    <div className={chainPillClass}>
                        <span className={`h-1.5 w-1.5 rounded-full ${chainOnline ? 'bg-[#54f3b3]' : 'bg-[#f59aa0]'}`} />
                        <Blocks className="h-4 w-4 flex-shrink-0" />
                        <span className="num text-xs font-bold">
                            {blockHeight != null ? `#${blockHeight.height.toLocaleString()}` : 'chain offline'}
                        </span>
                    </div>

                    <Link to="/key-management" className={`${pillBase} border-[rgba(115,255,198,0.12)] bg-[#0a211b] text-[#f2fff8] hover:border-[rgba(115,255,198,0.28)]`}>
                        <UserCircle className="size-4 shrink-0 text-[#9db9af]" />
                        My Account
                    </Link>
                </div>
            </div>
        </motion.header>
    );
};
