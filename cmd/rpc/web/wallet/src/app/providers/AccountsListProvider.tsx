'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDS } from "@/core/useDs"
import { useDSFetcher } from "@/core/dsFetch"

type KeystoreResponse = {
    addressMap: Record<string, {
        publicKey: string
        salt: string
        encrypted: string
        keyAddress: string
        keyNickname: string
    }>
    nicknameMap: Record<string, string>
}

export type Account = {
    id: string
    address: string
    nickname: string
    publicKey: string
    isActive?: boolean
}

type AccountsListContextValue = {
    accounts: Account[]
    loading: boolean
    error: string | null
    isReady: boolean
    pendingCreatedAccountId: string | null
    clearPendingCreatedAccount: () => void
    refetch: () => Promise<any>
    createNewAccount: (nickname: string, password: string) => Promise<string>
    importRawAccount: (nickname: string, password: string, privateKey: string) => Promise<string>
    importEncryptedAccount: (account: EncryptedAccountImport) => Promise<string>
    deleteAccount: (accountId: string, password: string, onDeleted?: (nextAccountId: string | null) => void) => Promise<void>
}

export type EncryptedAccountImport = {
    nickname: string
    address: string
    publicKey: string
    salt: string
    encrypted: string
    keyAddress: string
}

const AccountsListContext = createContext<AccountsListContextValue | undefined>(undefined)
const WALLET_NAME_REGISTRY_KEY = 'repuringWalletNamesByAddress'

const readWalletNameRegistry = (): Record<string, string> => {
    if (typeof window === 'undefined') return {}
    try {
        const raw = localStorage.getItem(WALLET_NAME_REGISTRY_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

const writeWalletNameRegistry = (registry: Record<string, string>) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(WALLET_NAME_REGISTRY_KEY, JSON.stringify(registry))
}

const accountsFromKeystore = (ks?: KeystoreResponse, walletNames: Record<string, string> = {}): Account[] => {
    const map = ks?.addressMap ?? {}
    return Object.entries(map).map(([address, entry]) => ({
        id: address,
        address,
        nickname: (entry as any).keyNickname || walletNames[address] || `Account ${address.slice(0, 8)}...`,
        publicKey: (entry as any).publicKey ?? (entry as any).public_key ?? '',
    }))
}

const normalizeCreatedAccountId = (response: unknown): string | null => {
    if (typeof response === 'string') return response.replace(/"/g, '').trim() || null
    if (response && typeof response === 'object') {
        const value = (response as any).address ?? (response as any).keyAddress ?? (response as any).id
        return typeof value === 'string' ? value.trim() || null : null
    }
    return null
}

const firstNewAccountId = (beforeIds: Set<string>, refreshedAccounts: Account[]): string | null =>
    refreshedAccounts.find(account => !beforeIds.has(account.id))?.id ?? null

const rememberWalletName = (
    setRegistry: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    address: string | null,
    nickname: string | null,
) => {
    if (!address || !nickname) return
    setRegistry((current) => {
        const next = { ...current, [address]: nickname }
        writeWalletNameRegistry(next)
        return next
    })
}

export function AccountsListProvider({ children }: { children: React.ReactNode }) {
    const { data: ks, isLoading, isFetching, error, refetch, isFetched } =
        useDS<KeystoreResponse>('keystore', {}, { refetchIntervalMs: 30 * 1000 })

    const dsFetch = useDSFetcher()
    const [pendingCreatedAccountId, setPendingCreatedAccountId] = useState<string | null>(null)
    const [walletNameRegistry, setWalletNameRegistry] = useState<Record<string, string>>(() => readWalletNameRegistry())

    const accounts: Account[] = useMemo(() => accountsFromKeystore(ks, walletNameRegistry), [ks, walletNameRegistry])

    useEffect(() => {
        if (!ks?.addressMap) return
        const next = { ...walletNameRegistry }
        let changed = false

        Object.entries(ks.addressMap as KeystoreResponse['addressMap']).forEach(([address, entry]) => {
            if (entry.keyNickname && next[address] !== entry.keyNickname) {
                next[address] = entry.keyNickname
                changed = true
            }
        })

        if (changed) {
            writeWalletNameRegistry(next)
            setWalletNameRegistry(next)
        }
    }, [ks, walletNameRegistry])

    const stableError = useMemo(
        () => (error ? ((error as any).message ?? 'Error') : null),
        [error]
    )

    // Only show loading on initial load, not during background refetch
    const loading = isLoading && !isFetched
    const isReady = isFetched || !!ks

    const clearPendingCreatedAccount = useCallback(() => {
        setPendingCreatedAccountId(null)
    }, [])

    const createNewAccount = useCallback(async (nickname: string, password: string): Promise<string> => {
        try {
            const beforeIds = new Set(accounts.map(account => account.id))
            const response = await dsFetch<string>('keystoreNewKey', {
                nickname,
                password
            })
            const result = await refetch()
            const refreshedAccounts = accountsFromKeystore(result.data as KeystoreResponse | undefined, walletNameRegistry)
            const createdAccountId =
                normalizeCreatedAccountId(response) ??
                firstNewAccountId(beforeIds, refreshedAccounts) ??
                null

            if (createdAccountId) {
                rememberWalletName(setWalletNameRegistry, createdAccountId, nickname)
                setPendingCreatedAccountId(createdAccountId)
            }

            return createdAccountId ?? ''
        } catch (err) {
            console.error('Error creating account:', err)
            throw err
        }
    }, [accounts, dsFetch, refetch, walletNameRegistry])

    const importRawAccount = useCallback(async (nickname: string, password: string, privateKey: string): Promise<string> => {
        try {
            const beforeIds = new Set(accounts.map(account => account.id))
            const response = await dsFetch<string>('keystoreImportRaw', {
                nickname,
                password,
                privateKey,
            })
            const result = await refetch()
            const refreshedKs = result.data as KeystoreResponse | undefined
            const refreshedAccounts = accountsFromKeystore(refreshedKs, walletNameRegistry)
            const importedAccountId =
                normalizeCreatedAccountId(response) ??
                firstNewAccountId(beforeIds, refreshedAccounts) ??
                null

            if (importedAccountId) {
                const rememberedNickname = walletNameRegistry[importedAccountId]
                const entry = refreshedKs?.addressMap?.[importedAccountId]
                if (rememberedNickname && entry && !entry.keyNickname) {
                    await dsFetch('keystoreImport', {
                        nickname: rememberedNickname,
                        address: entry.keyAddress,
                        publicKey: entry.publicKey,
                        salt: entry.salt,
                        encrypted: entry.encrypted,
                        keyAddress: entry.keyAddress,
                    })
                    await refetch()
                } else if (nickname) {
                    rememberWalletName(setWalletNameRegistry, importedAccountId, nickname)
                }
                setPendingCreatedAccountId(importedAccountId)
            }

            return importedAccountId ?? ''
        } catch (err) {
            console.error('Error importing raw account:', err)
            throw err
        }
    }, [accounts, dsFetch, refetch, walletNameRegistry])

    const importEncryptedAccount = useCallback(async (account: EncryptedAccountImport): Promise<string> => {
        try {
            const beforeIds = new Set(accounts.map(existing => existing.id))
            const response = await dsFetch<string>('keystoreImport', account)
            const result = await refetch()
            const refreshedAccounts = accountsFromKeystore(result.data as KeystoreResponse | undefined, walletNameRegistry)
            const importedAccountId =
                normalizeCreatedAccountId(response) ??
                refreshedAccounts.find(existing => existing.id === account.address || existing.id === account.keyAddress)?.id ??
                firstNewAccountId(beforeIds, refreshedAccounts) ??
                null

            if (importedAccountId) {
                rememberWalletName(setWalletNameRegistry, importedAccountId, account.nickname)
                setPendingCreatedAccountId(importedAccountId)
            }

            return importedAccountId ?? ''
        } catch (err) {
            console.error('Error importing encrypted account:', err)
            throw err
        }
    }, [accounts, dsFetch, refetch, walletNameRegistry])

    const deleteAccount = useCallback(async (
        accountId: string,
        password: string,
        onDeleted?: (nextAccountId: string | null) => void
    ): Promise<void> => {
        try {
            const account = accounts.find(acc => acc.id === accountId)
            if (!account) {
                throw new Error('Account not found')
            }

            await dsFetch('keystoreDelete', {
                address: account.address,
                password,
            })

            // Notify caller about which account to switch to
            if (onDeleted) {
                const nextAccount = accounts.find(acc => acc.id !== accountId)
                onDeleted(nextAccount?.id ?? null)
            }

            await refetch()
        } catch (err) {
            console.error('Error deleting account:', err)
            throw err
        }
    }, [accounts, dsFetch, refetch])

    const value: AccountsListContextValue = useMemo(() => ({
        accounts,
        loading,
        error: stableError,
        isReady,
        pendingCreatedAccountId,
        clearPendingCreatedAccount,
        refetch,
        createNewAccount,
        importRawAccount,
        importEncryptedAccount,
        deleteAccount,
    }), [accounts, loading, stableError, isReady, pendingCreatedAccountId, clearPendingCreatedAccount, refetch, createNewAccount, importRawAccount, importEncryptedAccount, deleteAccount])

    return (
        <AccountsListContext.Provider value={value}>
            {children}
        </AccountsListContext.Provider>
    )
}

export function useAccountsList() {
    const ctx = useContext(AccountsListContext)
    if (!ctx) throw new Error('useAccountsList must be used within <AccountsListProvider>')
    return ctx
}
