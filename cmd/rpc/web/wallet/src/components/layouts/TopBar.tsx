import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BadgeCheck, Blocks, Key, RadioTower } from 'lucide-react';
import { useDS } from '@/core/useDs';

const topBarButtonClass =
    "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive h-9 px-3 text-muted-foreground hover:text-white border border-white/15";

export const TopBar = (): JSX.Element => {
    const { data: blockHeight } = useDS<{ height: number }>('height', {}, {
        staleTimeMs: 10_000,
        refetchIntervalMs: 10_000,
    });

    return (
        <motion.header
            className="sticky top-0 z-[100] hidden h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-background px-6 lg:flex"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Link to="/" className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <BadgeCheck className="h-5 w-5" />
                </span>
                <span>
                    <span className="block text-sm font-semibold leading-tight text-white">RepuRing</span>
                    <span className="block text-xs text-muted-foreground">Onchain reputation circles</span>
                </span>
            </Link>

            <div className="flex items-center gap-2">
                <div className="hidden h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm text-muted-foreground sm:flex">
                    <RadioTower className="h-4 w-4 text-primary" />
                    <span>RPC 50002 / 50003</span>
                </div>

                <div className="flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm text-muted-foreground">
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <Blocks className="h-4 w-4 flex-shrink-0" />
                    <span className="num text-sm font-medium text-foreground">
                        {blockHeight != null ? `#${blockHeight.height.toLocaleString()}` : 'chain offline'}
                    </span>
                </div>

                <div className="hidden h-4 w-px bg-border/70 sm:block" />

                <Link to="/key-management" className={topBarButtonClass}>
                    <Key className="size-4 shrink-0" />
                    Signing Keys
                </Link>
            </div>
        </motion.header>
    );
};
