'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAccountsList, Account } from './AccountsListProvider'

type SelectedAccountContextValue = {
    selectedId: string | null
    selectedAccount: Account | null
    selectedAddress?: string
    switchAccount: (id: string | null) => void
    disconnectAccount: () => void
}

const SelectedAccountContext = createContext<SelectedAccountContextValue | undefined>(undefined)

const STORAGE_KEY = 'activeAccountId'
const DISCONNECTED_KEY = 'accountManuallyDisconnected'

export function SelectedAccountProvider({ children }: { children: React.ReactNode }) {
    const { accounts, isReady: accountsReady } = useAccountsList()

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) setSelectedId(e.newValue ?? null)
            if (e.key === DISCONNECTED_KEY && e.newValue === 'true') setSelectedId(null)
        }

        try {
            const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
            const disconnected = typeof window !== 'undefined' ? localStorage.getItem(DISCONNECTED_KEY) === 'true' : false
            if (disconnected) {
                setSelectedId(null)
            } else if (saved) {
                setSelectedId(saved)
            }
        } finally {
            setIsInitialized(true)
        }

        // Listen for changes from other tabs
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    // Keep selection valid as the keystore changes, unless the user manually disconnected.
    useEffect(() => {
        if (!isInitialized || !accountsReady) return
        const disconnected = typeof window !== 'undefined' && localStorage.getItem(DISCONNECTED_KEY) === 'true'
        if (disconnected) return

        const selectedExists = selectedId ? accounts.some(account => account.id === selectedId) : false
        if (selectedExists) return

        const nextId = accounts[0]?.id ?? null
        setSelectedId(nextId)

        if (typeof window !== 'undefined') {
            if (nextId) {
                localStorage.setItem(STORAGE_KEY, nextId)
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }, [isInitialized, accountsReady, selectedId, accounts])

    const selectedAccount = useMemo(
        () => accounts.find(a => a.id === selectedId) ?? null,
        [accounts, selectedId]
    )

    const selectedAddress = useMemo(() => selectedAccount?.address, [selectedAccount])

    const switchAccount = useCallback((id: string | null) => {
        setSelectedId(id)
        if (typeof window !== 'undefined') {
            if (id) {
                localStorage.setItem(STORAGE_KEY, id)
                localStorage.removeItem(DISCONNECTED_KEY)
            } else {
                localStorage.removeItem(STORAGE_KEY)
            }
        }
    }, [])

    const disconnectAccount = useCallback(() => {
        setSelectedId(null)
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY)
            localStorage.setItem(DISCONNECTED_KEY, 'true')
        }
    }, [])

    const value: SelectedAccountContextValue = useMemo(() => ({
        selectedId,
        selectedAccount,
        selectedAddress,
        switchAccount,
        disconnectAccount,
    }), [selectedId, selectedAccount, selectedAddress, switchAccount, disconnectAccount])

    return (
        <SelectedAccountContext.Provider value={value}>
            {children}
        </SelectedAccountContext.Provider>
    )
}

export function useSelectedAccount() {
    const ctx = useContext(SelectedAccountContext)
    if (!ctx) throw new Error('useSelectedAccount must be used within <SelectedAccountProvider>')
    return ctx
}
