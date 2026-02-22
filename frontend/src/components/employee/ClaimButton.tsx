"use client";

import { useState } from "react";
import { VAULT_ABI } from "@/lib/contracts";
import { writeEmployee, publicClient } from "@/lib/viemClients";
import { formatTokens } from "@/lib/vesting";

interface ClaimButtonProps {
  vaultAddress: `0x${string}`;
  claimable: bigint;
  onSuccess?: () => void;
}

export function ClaimButton({ vaultAddress, claimable, onSuccess }: ClaimButtonProps) {
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setError(null);
    setIsSuccess(false);
    setIsPending(true);

    try {
      const txHash = await writeEmployee({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "release",
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setIsConfirming(false);
      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message.slice(0, 200));
      setIsPending(false);
      setIsConfirming(false);
    }
  };

  const hasTokens = claimable > 0n;
  const isDisabled = !hasTokens || isPending || isConfirming;

  return (
    <div className="flex flex-col gap-2.5">
      <button
        onClick={handleClaim}
        disabled={isDisabled}
        className={`relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-sm tracking-wide transition-all duration-200 ${
          hasTokens && !isPending && !isConfirming
            ? "text-white shadow-lg shadow-violet-900/30 hover:shadow-violet-800/40 hover:brightness-110"
            : "cursor-not-allowed text-gray-500 bg-gray-800 border border-gray-700"
        }`}
        style={
          hasTokens && !isPending && !isConfirming
            ? { background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)" }
            : {}
        }
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing…
          </span>
        ) : isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Confirming on-chain…
          </span>
        ) : hasTokens ? (
          `Claim ${formatTokens(claimable)} HVE`
        ) : (
          "Nothing to claim yet"
        )}
      </button>

      {isSuccess && (
        <div className="rounded-lg border border-green-800/50 bg-green-950/40 px-3 py-2 text-center text-sm text-green-400">
          Claimed!{" "}
          <a
            href={`https://testnet.purrsec.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 opacity-80 hover:opacity-100"
          >
            View tx
          </a>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-950/40 px-3 py-2 text-center text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
