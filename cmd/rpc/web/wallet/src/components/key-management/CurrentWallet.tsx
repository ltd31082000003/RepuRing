import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Key,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileDown,
  Import,
  LogOut,
  Pencil,
  PlusCircle,
  Trash2,
  UserCircle,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useToast } from "@/toast/ToastContext";
import { useAccounts } from "@/app/providers/AccountsProvider";
import { useDSFetcher } from "@/core/dsFetch";
import { useDS } from "@/core/useDs";
import { downloadJson } from "@/helpers/download";
import { useQueryClient } from "@tanstack/react-query";

type CurrentWalletProps = {
  embedded?: boolean;
  onDownloadFullKeystore?: () => void;
  onOpenCreate?: () => void;
  onOpenImport?: () => void;
};

export const CurrentWallet = ({
  embedded = false,
  onDownloadFullKeystore,
  onOpenCreate,
  onOpenImport,
}: CurrentWalletProps): JSX.Element => {
  const { accounts, selectedAccount, switchAccount, disconnectAccount } = useAccounts();

  const [privateKey, setPrivateKey] = useState("");
  const [privateKeyVisible, setPrivateKeyVisible] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFetchingKey, setIsFetchingKey] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameNickname, setRenameNickname] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const { copyToClipboard } = useCopyToClipboard();
  const toast = useToast();
  const dsFetch = useDSFetcher();
  const queryClient = useQueryClient();
  const { data: keystore } = useDS("keystore", {});

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const truncateMiddle = (value: string, start = 12, end = 10) => {
    if (!value) return "";
    if (value.length <= start + end + 3) return value;
    return `${value.slice(0, start)}...${value.slice(-end)}`;
  };

  const selectedKeyEntry = useMemo(() => {
    if (!keystore || !selectedAccount) return null;
    return keystore.addressMap?.[selectedAccount.address] ?? null;
  }, [keystore, selectedAccount]);

  useEffect(() => {
    setPrivateKey("");
    setPrivateKeyVisible(false);
    setShowPasswordModal(false);
    setPassword("");
    setPasswordError("");
    setIsRenameOpen(false);
    setRenameNickname(selectedKeyEntry?.keyNickname || selectedAccount?.nickname || "");
  }, [selectedAccount?.id, selectedAccount?.nickname, selectedKeyEntry?.keyNickname]);

  const invalidateKeystore = async () => {
    const invalidate = () =>
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "ds" &&
          query.queryKey[2] === "keystore",
      });

    await invalidate();
    setTimeout(() => {
      void invalidate();
    }, 500);
  };

  const handleDownloadKeyfile = () => {
    if (!selectedAccount) {
      toast.error({
        title: "No Account Selected",
        description: "Please select an active account first",
      });
      return;
    }

    if (!keystore) {
      toast.error({
        title: "Keyfile Unavailable",
        description: "Keystore data is not ready yet.",
      });
      return;
    }

    if (!selectedKeyEntry) {
      toast.error({
        title: "Keyfile Unavailable",
        description: "Selected wallet data is missing in the keystore.",
      });
      return;
    }

    const nickname = selectedKeyEntry.keyNickname || selectedAccount.nickname;
    const nicknameValue =
      (keystore.nicknameMap ?? {})[nickname] ?? selectedKeyEntry.keyAddress;
    const keyfilePayload = {
      addressMap: {
        [selectedKeyEntry.keyAddress]: selectedKeyEntry,
      },
      nicknameMap: {
        [nickname]: nicknameValue,
      },
    };

    downloadJson(keyfilePayload, `keyfile-${nickname}`);
    toast.success({
      title: "Download Started",
      description: "Your keyfile JSON is downloading.",
    });
  };

  const handleDisconnect = () => {
    disconnectAccount();
    setPrivateKey("");
    setPrivateKeyVisible(false);
    toast.success({
      title: "Disconnected",
      description: "No account is currently selected.",
    });
  };

  const handleRevealPrivateKeys = () => {
    if (!selectedAccount) {
      toast.error({
        title: "No Account Selected",
        description: "Please select an active account first",
      });
      return;
    }

    if (privateKeyVisible) {
      setPrivateKey("");
      setPrivateKeyVisible(false);
      toast.success({
        title: "Private Key Hidden",
        description: "Your private key is hidden again.",
        icon: <EyeOff className="h-5 w-5" />,
      });
      return;
    }

    setPassword("");
    setPasswordError("");
    setShowPasswordModal(true);
  };

  const handleFetchPrivateKey = async () => {
    if (!selectedAccount) return;
    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    setIsFetchingKey(true);
    setPasswordError("");

    try {
      const response = await dsFetch("keystoreGet", {
        address: selectedKeyEntry?.keyAddress ?? selectedAccount.address,
        password,
        nickname: selectedKeyEntry?.keyNickname,
      });
      const extracted =
        (response as any)?.privateKey ??
        (response as any)?.private_key ??
        (response as any)?.PrivateKey ??
        (response as any)?.Private_key ??
        (typeof response === "string" ? response.replace(/"/g, "") : "");

      if (!extracted) {
        throw new Error("Private key not found.");
      }

      setPrivateKey(extracted);
      setPrivateKeyVisible(true);
      setShowPasswordModal(false);
      setPassword("");
      toast.success({
        title: "Private Key Revealed",
        description: "Be careful! Your private key is now visible.",
        icon: <Eye className="h-5 w-5" />,
      });
    } catch (error) {
      setPasswordError("Unable to unlock with that password.");
      toast.error({
        title: "Unlock Failed",
        description: String(error),
      });
    } finally {
      setIsFetchingKey(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!selectedAccount) {
      toast.error({
        title: "No Account Selected",
        description: "Please select an account to delete",
      });
      return;
    }

    setDeletePassword("");
    setDeletePasswordError("");
    setShowDeleteModal(true);
  };

  const handleRenameAccount = async () => {
    if (!selectedAccount || !selectedKeyEntry) return;

    const nextNickname = renameNickname.trim();
    const currentNickname = selectedKeyEntry.keyNickname || selectedAccount.nickname;

    if (!nextNickname) {
      toast.error({
        title: "Missing wallet name",
        description: "Please enter a nickname.",
      });
      return;
    }

    if (nextNickname === currentNickname) {
      setIsRenameOpen(false);
      return;
    }

    setIsRenaming(true);
    try {
      await dsFetch("keystoreImport", {
        nickname: nextNickname,
        address: selectedKeyEntry.keyAddress,
        publicKey: selectedKeyEntry.publicKey,
        salt: selectedKeyEntry.salt,
        encrypted: selectedKeyEntry.encrypted,
        keyAddress: selectedKeyEntry.keyAddress,
      });

      await invalidateKeystore();

      toast.success({
        title: "Nickname updated",
        description: `Wallet renamed to "${nextNickname}".`,
      });
      setIsRenameOpen(false);
    } catch (error) {
      toast.error({
        title: "Rename failed",
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsRenaming(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;

    if (!deletePassword) {
      setDeletePasswordError("Password is required.");
      return;
    }

    setIsDeleting(true);
    setDeletePasswordError("");

    try {
      const nickname = selectedKeyEntry?.keyNickname || selectedAccount.nickname;

      await dsFetch("keystoreDelete", {
        address: selectedKeyEntry?.keyAddress ?? selectedAccount.address,
        password: deletePassword,
      });

      await invalidateKeystore();

      toast.success({
        title: "Account Deleted",
        description: `Account "${nickname}" has been permanently deleted.`,
      });

      setShowDeleteModal(false);
      setDeletePassword("");

      const otherAccounts = accounts.filter((acc) => acc.id !== selectedAccount.id);
      if (otherAccounts.length > 0) {
        setTimeout(() => {
          switchAccount(otherAccounts[0].id);
        }, 500);
      } else {
        switchAccount(null);
      }
    } catch (error) {
      setDeletePasswordError("Unable to delete with that password.");
      toast.error({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const content = (
    <>
      <div className="space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.22)] sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary sm:h-11 sm:w-11 sm:rounded-2xl">
                <UserCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Connected Account</p>
                <h2 className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
                  {selectedAccount ? (selectedKeyEntry?.keyNickname || selectedAccount.nickname) : "No account connected"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedAccount ? "Selected for RepuRing signing and local demo transactions." : "Use the account selector in the top bar, or create/import a wallet to start using RepuRing."}
                </p>
              </div>
            </div>
            {selectedAccount ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Selected
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0 rounded-xl border border-border bg-muted px-3 py-2.5">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Active signing wallet</p>
              <p className="mt-1 truncate text-sm font-semibold text-foreground">
                {selectedAccount ? (selectedKeyEntry?.keyNickname || selectedAccount.nickname) : "No account selected"}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                {selectedAccount?.address || (accounts.length ? "Choose an account from the top bar selector." : "Create or import a wallet first.")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" className="h-11" onClick={() => selectedAccount && copyToClipboard(selectedAccount.address, "Wallet address")} disabled={!selectedAccount}>
                <Copy className="h-4 w-4" />
                Copy address
              </Button>
              <Button type="button" variant="secondary" className="h-11" onClick={handleDisconnect} disabled={!selectedAccount}>
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>

          {isRenameOpen && (
            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:flex-row">
              <input
                type="text"
                value={renameNickname}
                onChange={(e) => setRenameNickname(e.target.value)}
                placeholder="Wallet nickname"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                autoFocus
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" className="h-10" onClick={handleRenameAccount} disabled={isRenaming}>
                  {isRenaming ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-10"
                  onClick={() => {
                    setIsRenameOpen(false);
                    setRenameNickname(selectedKeyEntry?.keyNickname || selectedAccount?.nickname || "");
                  }}
                  disabled={isRenaming}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {selectedAccount ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">
                  Wallet address
                </label>
                <div className="relative">
                  <div className="min-w-0 rounded-xl border border-border bg-muted px-3 py-2.5 pr-11 text-sm text-foreground" title={selectedAccount.address}>
                    <span className="block truncate font-mono">{truncateMiddle(selectedAccount.address, 14, 12)}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedAccount.address, "Wallet address")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/70 transition-colors hover:text-white"
                    aria-label="Copy wallet address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground/80">
                  Public key
                </label>
                <div className="relative">
                  <div className="min-w-0 rounded-xl border border-border bg-muted px-3 py-2.5 pr-11 text-sm text-foreground" title={selectedAccount.publicKey}>
                    <span className="block truncate font-mono">{truncateMiddle(selectedAccount.publicKey, 14, 12)}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedAccount.publicKey, "Public key")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/70 transition-colors hover:text-white"
                    aria-label="Copy public key"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 text-center sm:p-5">
              <p className="text-base font-semibold text-foreground">No account connected</p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Select an existing account or create a new one to start using RepuRing.
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-primary/15 bg-primary/[0.06] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <WalletCards className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">RepuRing Identity</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">Social-Fi signing context</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Use this account to create profiles, join community circles, post proof-of-work, and submit peer reviews.
                </p>
                <p className="mt-3 break-all rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-foreground/80">
                  {selectedAccount?.address || "No selected account address"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Local Demo Wallet Tools</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">Create or bring an identity</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <Button type="button" className="h-11 w-full justify-start" onClick={onOpenCreate}>
                <PlusCircle className="h-4 w-4" />
                Create New Key
              </Button>
              <Button type="button" variant="secondary" className="h-11 w-full justify-start" onClick={onOpenImport}>
                <Import className="h-4 w-4" />
                Import Wallet
              </Button>
              <Button type="button" variant="outline" className="h-11 w-full justify-start" onClick={handleDownloadKeyfile} disabled={!selectedAccount}>
                <Download className="h-4 w-4" />
                Download Keyfile
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#ff1845]/25 bg-[#ff1845]/[0.045] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-[#ff6b84]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff6b84]">Advanced Security Tools</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">Local demo only</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Local demo only. Never reveal private keys in production.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 border-white/10 bg-black/20"
              onClick={() => {
                setRenameNickname(selectedKeyEntry?.keyNickname || selectedAccount?.nickname || "");
                setIsRenameOpen((value) => !value);
              }}
              disabled={!selectedAccount || !selectedKeyEntry}
            >
              <Pencil className="h-4 w-4" />
              Rename
            </Button>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-foreground/80">
              Private key
            </label>
            <div className="relative flex items-center justify-between gap-2">
              <input
                type={privateKeyVisible ? "text" : "password"}
                value={privateKeyVisible ? privateKey : ""}
                readOnly
                placeholder="Hidden until unlocked"
                className="w-full rounded-xl border border-border bg-muted px-3 py-2.5 pr-10 text-foreground placeholder:text-muted-foreground"
              />
              {privateKeyVisible && (
                <button
                  onClick={() => copyToClipboard(privateKey, "Private key")}
                  className="rounded-lg border border-[#272729] bg-[#0f0f0f] px-3 py-2.5 text-white/70 transition-colors hover:bg-[#272729] hover:text-white"
                  aria-label="Copy private key"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleRevealPrivateKeys}
                className="rounded-lg border border-[#272729] bg-[#0f0f0f] px-3 py-2 text-white/70 transition-colors hover:bg-[#272729] hover:text-white"
                disabled={!selectedAccount}
                aria-label={privateKeyVisible ? "Hide private key" : "Reveal private key"}
              >
                {privateKeyVisible ? <EyeOff className="h-4 w-4 text-foreground" /> : <Eye className="h-4 w-4 text-foreground" />}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button type="button" onClick={handleRevealPrivateKeys} variant="secondary" className="h-11 w-full" disabled={!selectedAccount}>
              <Key className="h-4 w-4" />
              {privateKeyVisible ? "Hide Private Key" : "Reveal Private Key"}
            </Button>
            <Button type="button" onClick={onDownloadFullKeystore} variant="secondary" className="h-11 w-full">
              <FileDown className="h-4 w-4" />
              Download Full Keystore
            </Button>
            <Button
              type="button"
              onClick={handleDeleteAccount}
              variant="secondary"
              className="h-11 w-full border-[#ff1845]/30 bg-[#ff1845]/10 text-[#ff6b84] shadow-none hover:border-[#ff1845]/40 hover:bg-[#ff1845]/14 hover:text-[#ff7f96]"
              disabled={!selectedAccount}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </section>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[#0f0f0f]/80 backdrop-blur-md p-3 sm:p-4">
          <div className="w-full max-w-sm max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] bg-[#171717] border border-[#272729] rounded-2xl p-4 sm:p-5 shadow-[0_24px_72px_rgba(0,0,0,0.55)] overflow-y-auto">
            <h3 className="text-lg text-foreground font-semibold mb-2">
              Unlock Private Key
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your wallet password to reveal the private key.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0f0f0f] text-foreground border border-[#272729] rounded-lg px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35cd48]/25"
            />
            {passwordError && (
              <div className="text-sm text-[#ff1845] mt-2">{passwordError}</div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 rounded-lg border border-[#272729] bg-[#0f0f0f] text-white hover:bg-[#272729]"
                disabled={isFetchingKey}
              >
                Cancel
              </button>
              <button
                onClick={handleFetchPrivateKey}
                className="px-4 py-2 rounded-lg bg-[#35cd48] text-[#0f0f0f] hover:bg-[#35cd48]/90"
                disabled={isFetchingKey}
              >
                {isFetchingKey ? "Unlocking..." : "Unlock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[#0f0f0f]/80 backdrop-blur-md p-3 sm:p-4">
          <div className="w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] bg-[#171717] border border-[#ff1845]/35 rounded-2xl p-4 sm:p-6 shadow-[0_24px_72px_rgba(0,0,0,0.55)] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#ff1845]/12 rounded-full">
                <AlertTriangle className="w-6 h-6 text-[#ff1845]" />
              </div>
              <h3 className="text-xl text-foreground font-semibold">
                Delete Account
              </h3>
            </div>

            <div className="bg-[#ff1845]/10 border border-[#ff1845]/25 rounded-lg p-4 mb-4">
              <p className="text-[#ff1845] text-sm font-medium mb-2">
                This action is permanent and irreversible
              </p>
              <p className="text-[#ff1845] text-sm">
                Make sure you have backed up your private key before deleting this account.
                You will lose access to all funds if you haven't saved your private key.
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Enter your wallet password to confirm deletion of <span className="font-semibold text-foreground">
                {selectedKeyEntry?.keyNickname || selectedAccount?.nickname}
              </span>:
            </p>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0f0f0f] text-foreground border border-[#272729] rounded-lg px-3 py-2.5 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1845]/25"
              autoFocus
            />
            {deletePasswordError && (
              <div className="text-sm text-[#ff1845] mb-2">{deletePasswordError}</div>
            )}

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeletePasswordError("");
                }}
                className="px-4 py-2 rounded-lg border border-[#272729] bg-[#0f0f0f] text-white hover:bg-[#272729]"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-[#ff1845] text-white hover:bg-[#ff1845]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting || !deletePassword}
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="w-full">{content}</div>;
  }

  return (
    <motion.div
      variants={panelVariants}
      className="bg-card rounded-2xl border border-border/80 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.2)] sm:p-6"
    >
      {content}
    </motion.div>
  );
};
