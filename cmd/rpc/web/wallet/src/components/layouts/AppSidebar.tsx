import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircle,
    BadgeCheck,
    Users,
    PanelsTopLeft,
    ClipboardCheck,
    HeartHandshake,
    Trophy,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
} from 'lucide-react';

const navItems = [
    { name: 'Overview', path: '/repuring', icon: BadgeCheck },
    { name: 'My Account', path: '/key-management', icon: UserCircle },
    { name: 'Circles', path: '/repuring/circles', icon: Users },
    { name: 'Community', path: '/repuring/community', icon: PanelsTopLeft },
    { name: 'Post Work', path: '/repuring/contributions', icon: ClipboardCheck },
    { name: 'Review Work', path: '/repuring/endorse', icon: HeartHandshake },
    { name: 'Leaderboard', path: '/repuring/leaderboard', icon: Trophy },
    { name: 'Admin', path: '/repuring/admin', icon: ShieldCheck },
];

/** Matches canopy-frontend `MainNav` + shell: rounded-xl rows, zinc borders, white/active pill. */
function navLinkClass(isActive: boolean, collapsed: boolean): string {
    const base =
        'group relative flex w-full min-w-0 font-medium rounded-xl transition-all duration-200 text-[14px]';
    const layout = collapsed
        ? 'w-[57px] flex-col items-center justify-center gap-1 py-2'
        : 'items-center gap-3 px-3 py-2';
    const state = isActive
        ? 'text-white bg-primary/[0.12] ring-1 ring-primary/25 shadow-[0_0_22px_rgba(69,202,70,0.16)]'
        : 'text-zinc-400 bg-transparent hover:text-white hover:bg-white/5';
    return `${base} ${layout} ${state}`;
}

function navIconClass(isActive: boolean): string {
    const size = 'h-4 w-4 flex-shrink-0 transition-colors duration-200';
    if (isActive) {
        return `${size} text-primary drop-shadow-[0_0_10px_rgba(69,202,70,0.8)]`;
    }
    return `${size} text-zinc-400 group-hover:text-white`;
}

export const AppSidebar = (): JSX.Element => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarW = collapsed ? 90 : 240;

    return (
        <>
            <motion.aside
                className="relative z-30 hidden h-screen min-h-screen flex-shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-bg-secondary pb-4 lg:flex"
                animate={{ width: sidebarW }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
                <div
                    className={`flex h-16 flex-shrink-0 items-center border-b border-zinc-800 transition-all duration-300 ${
                        collapsed ? 'px-5' : 'px-4'
                    }`}
                >
                    <Link
                        to="/repuring"
                        className={`flex h-full w-full min-w-0 items-center overflow-hidden transition-all duration-300 ${
                            collapsed ? 'justify-center' : 'justify-start py-1 pl-4 pr-2'
                        }`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {collapsed ? (
                                <motion.div
                                    key="symbol"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
                                >
                                    <BadgeCheck className="h-5 w-5" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="logo"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex min-w-0 items-center gap-2"
                                >
                                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                                        <BadgeCheck className="h-5 w-5" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-lg font-semibold leading-tight text-white">RepuRing</span>
                                        <span className="block truncate text-[11px] font-medium uppercase tracking-[0.16em] text-primary">Social-Fi</span>
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                <nav
                    className={`flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto py-4 scrollbar-hide [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                        collapsed ? 'px-5' : 'px-4'
                    }`}
                >
                    {navItems.map(({ name, path, icon: Icon }) => (
                        <NavLink
                            key={name}
                            to={path}
                            end={path === '/repuring'}
                            title={collapsed ? name : undefined}
                            className={({ isActive }) => navLinkClass(isActive, collapsed)}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={navIconClass(isActive)} />
                                    <AnimatePresence>
                                        {!collapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.18 }}
                                                className={`truncate overflow-hidden whitespace-nowrap ${collapsed ? 'text-[10px]' : ''}`}
                                            >
                                                {name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div
                    className={`flex-shrink-0 border-t border-zinc-800 pb-2 pt-2 ${collapsed ? 'px-5' : 'px-4'}`}
                >
                    <button
                        type="button"
                        onClick={() => setCollapsed((c) => !c)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <>
                                <ChevronLeft className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="text-xs">Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.aside>

            <div className="lg:hidden">
                <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border/40 bg-bg-secondary px-4">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link to="/repuring" className="flex items-center px-1 py-1">
                        <span className="flex items-center gap-2 text-base font-semibold text-white">
                            <BadgeCheck className="h-5 w-5 text-primary" />
                            RepuRing
                        </span>
                    </Link>
                    <div className="w-9" />
                </header>

                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-40 bg-black/72 backdrop-blur-[2px]"
                                onClick={() => setMobileOpen(false)}
                            />
                            <motion.aside
                                key="drawer"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ duration: 0.26, ease: 'easeOut' }}
                                className="fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col border-r border-zinc-800 bg-bg-secondary"
                            >
                                <div className="flex h-16 flex-shrink-0 items-center border-b border-zinc-800 px-4">
                                    <div className="flex h-full w-full items-center justify-between">
                                        <Link
                                            to="/repuring"
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center px-1 py-1"
                                        >
                                            <span className="flex items-center gap-2 text-base font-semibold text-white">
                                                <BadgeCheck className="h-5 w-5 text-primary" />
                                                RepuRing
                                            </span>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setMobileOpen(false)}
                                            className="rounded-xl p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                                            aria-label="Close menu"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
                                    {navItems.map(({ name, path, icon: Icon }) => (
                                        <NavLink
                                            key={name}
                                            to={path}
                                            end={path === '/repuring'}
                                            onClick={() => setMobileOpen(false)}
                                            className={({ isActive }) => navLinkClass(isActive, false)}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <Icon className={navIconClass(isActive)} />
                                                    <span>{name}</span>
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </nav>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};
