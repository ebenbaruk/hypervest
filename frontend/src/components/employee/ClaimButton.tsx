"use client";

import { useState } from "react";
import { VAULT_ABI } from "@/lib/contracts";
import { writeEmployee, publicClient } from "@/lib/viemClients";

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

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClaim}
        disabled={claimable === 0n || isPending || isConfirming}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isPending
          ? "Signing transaction…"
          : isConfirming
          ? "Confirming on-chain…"
          : claimable === 0n
          ? "Nothing to claim yet"
          : "Claim Tokens"}
      </button>

      {isSuccess && (
        <p className="text-green-400 text-sm text-center">
          ✓ Claimed!{" "}
          <a
            href={`https://testnet.purrsec.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {hash?.slice(0, 10)}…
          </a>
        </p>
      )}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
}
