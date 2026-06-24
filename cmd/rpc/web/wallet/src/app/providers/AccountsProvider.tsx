'use client'

import React, { useCallback, useMemo } from 'react'
import { AccountsListProvider, useAccountsList, Account, EncryptedAccountImport } from './AccountsListProvider'
import { SelectedAccountProvider, useSelectedAccount } from './SelectedAccountProvider'

// Re-export Account type for backward compatibility
export type { Account }

// Legacy combined context type for backward compatibility
type AccountsContextValue = {
    accounts: Account[]
    selectedId: string | null
    selectedAccount: Account | null
    selectedAddress?: string
    loading: boolean
    error: string | null
    isReady: boolean

    switchAccount: (id: string | null) => void
    createNewAccount: (nickname: string, password: string) => Promise<string>
    importRawAccount: (nickname: string, password: string, privateKey: string) => Promise<string>
    importEncryptedAccount: (account: EncryptedAccountImport) => Promise<string>
    deleteAccount: (accountId: string, password: string) => Promise<void>
    refetch: () => Promise<any>
    disconnectAccount: () => void
}

/**
 * Composed provider that wraps AccountsListProvider and SelectedAccountProvider.
 * This maintains backward compatibility while allowing components to use
 * more granular hooks (useAccountsList, useSelectedAccount) for better performance.
 */
export function AccountsProvider({ children }: { children: React.ReactNode }) {
    return (
        <AccountsListProvider>
            <SelectedAccountProvider>
                {children}
            </SelectedAccountProvider>
        </AccountsListProvider>
    )
}

/**
 * Legacy hook that combines both contexts.
 * Use this for backward compatibility, but prefer useAccountsList() or useSelectedAccount()
 * for components that only need part of the data.
 */
export function useAccounts(): AccountsContextValue {
    const list = useAccountsList()
    const selected = useSelectedAccount()

    // Wrap deleteAccount to integrate with switchAccount
    const deleteAccount = useCallback(async (accountId: string, password: string): Promise<void> => {
        await list.deleteAccount(accountId, password, (nextAccountId: string | null) => {
            if (selected.selectedId === accountId && nextAccountId) {
                selected.switchAccount(nextAccountId)
            }
        })
    }, [list, selected])

    return useMemo(() => ({
        // From AccountsListProvider
        accounts: list.accounts,
        loading: list.loading,
        error: list.error,
        isReady: list.isReady,
        refetch: list.refetch,
        createNewAccount: list.createNewAccount,
        importRawAccount: list.importRawAccount,
        importEncryptedAccount: list.importEncryptedAccount,
        deleteAccount,

        // From SelectedAccountProvider
        selectedId: selected.selectedId,
        selectedAccount: selected.selectedAccount,
        selectedAddress: selected.selectedAddress,
        switchAccount: selected.switchAccount,
        disconnectAccount: selected.disconnectAccount,
    }), [list, selected, deleteAccount])
}

// Re-export granular hooks for direct use
export { useAccountsList } from './AccountsListProvider'
export { useSelectedAccount } from './SelectedAccountProvider'
