export type TxConfirmationResult =
  | { status: "skipped"; reason: "no-hash" | "not-a-transaction" }
  | { status: "confirmed"; hash: string; tx: any }
  | { status: "failed"; hash: string; failedTx: any; error: string }
  | { status: "timeout"; hash: string; lastTx: any | null };

const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_POLL_MS = 1200;

export function isTransactionSubmitPath(path: string) {
  const value = String(path || "").trim();
  return value === "/v1/tx" || value === "/v1/txs" || value.startsWith("/v1/admin/tx-");
}

export function extractTxHash(response: unknown): string {
  if (typeof response === "string") return normalizeTxHashCandidate(response);
  if (!response || typeof response !== "object") return "";

  const record = response as Record<string, any>;
  const candidates = [
    record.hash,
    record.txHash,
    record.tx_hash,
    record.transactionHash,
    record.transaction_hash,
    record.data?.hash,
    record.data?.txHash,
    record.result?.hash,
    record.result?.txHash,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const hash = normalizeTxHashCandidate(candidate);
    if (hash) return hash;
  }
  return "";
}

export async function waitForTransactionCommit({
  rpcBase,
  txHash,
  senderAddress,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  pollMs = DEFAULT_POLL_MS,
}: {
  rpcBase: string;
  txHash: string;
  senderAddress?: string;
  timeoutMs?: number;
  pollMs?: number;
}): Promise<TxConfirmationResult> {
  const hash = normalizeTxHashCandidate(txHash);
  if (!hash) return { status: "skipped", reason: "no-hash" };
  if (!rpcBase) return { status: "timeout", hash, lastTx: null };

  const startedAt = Date.now();
  let lastTx: any = null;
  while (Date.now() - startedAt < timeoutMs) {
    const tx = await queryTxByHash(rpcBase, hash);
    if (tx) {
      lastTx = tx;
      if (isCommittedTx(tx)) return { status: "confirmed", hash, tx };
    }
    const failedTx = senderAddress ? await queryFailedTxByHash(rpcBase, senderAddress, hash) : null;
    if (failedTx) {
      return { status: "failed", hash, failedTx, error: extractFailedTxError(failedTx) };
    }
    await sleep(pollMs);
  }
  return { status: "timeout", hash, lastTx };
}

function isCommittedTx(tx: any) {
  const height = Number(tx?.height ?? tx?.Height ?? 0);
  const txHash = tx?.txHash ?? tx?.TxHash ?? tx?.hash ?? tx?.Hash;
  return Boolean(txHash && Number.isFinite(height) && height > 0);
}

async function queryTxByHash(rpcBase: string, hash: string) {
  try {
    const response = await fetch(`${rpcBase}/v1/query/tx-by-hash`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function queryFailedTxByHash(rpcBase: string, senderAddress: string, hash: string) {
  try {
    const response = await fetch(`${rpcBase}/v1/query/failed-txs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: senderAddress,
        pageNumber: 1,
        perPage: 50,
      }),
    });
    if (!response.ok) return null;
    const page = await response.json();
    const results = Array.isArray(page?.results) ? page.results : [];
    return results.find((item: any) => normalizeTxHashCandidate(String(item?.hash ?? item?.Hash ?? "")) === hash) ?? null;
  } catch {
    return null;
  }
}

function extractFailedTxError(failedTx: any) {
  const raw = failedTx?.error ?? failedTx?.Error;
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    for (const key of ["message", "Message", "error", "Error", "msg", "Msg"]) {
      if (typeof raw[key] === "string" && raw[key]) return raw[key];
    }
  }
  return "The transaction was rejected while being applied to the block.";
}

function normalizeTxHashCandidate(value: string) {
  const clean = String(value || "")
    .trim()
    .replace(/^"|"$/g, "")
    .replace(/^0x/i, "");
  return /^[a-fA-F0-9]{16,}$/.test(clean) ? clean.toLowerCase() : "";
}

function sleep(ms: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}
