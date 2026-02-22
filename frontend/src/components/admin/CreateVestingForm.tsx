"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { FACTORY_ABI, FACTORY_ADDRESS } from "@/lib/contracts";
import { writeEmployer, publicClient } from "@/lib/viemClients";
import { DEMO_EMPLOYEE } from "@/lib/demoAccounts";

export function CreateVestingForm() {
  const [form, setForm] = useState({
    beneficiary: DEMO_EMPLOYEE.address,
    cliffSeconds: "60",
    durationSeconds: "300",
    allocation: "100000",
  });

  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);
    setIsPending(true);

    try {
      const txHash = await writeEmployer({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "createVesting",
        args: [
          form.beneficiary as `0x${string}`,
          BigInt(form.cliffSeconds),
          BigInt(form.durationSeconds),
          parseEther(form.allocation),
        ],
      });

      setHash(txHash);
      setIsPending(false);
      setIsConfirming(true);

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setIsConfirming(false);
      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message.slice(0, 200));
      setIsPending(false);
      setIsConfirming(false);
    }
  };

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder: string,
    type = "text"
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="rounded-lg border border-gray-700/60 bg-gray-800/60 px-3.5 py-2.5 font-mono text-sm text-white placeholder-gray-600 transition-colors focus:border-violet-500/80 focus:outline-none focus:bg-gray-800"
        required
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {field("Employee Wallet Address", "beneficiary", "0x…")}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {field("Cliff (seconds)", "cliffSeconds", "60", "number")}
          {field("Total Duration (seconds)", "durationSeconds", "300", "number")}
        </div>
        <p className="text-xs text-gray-600">
          Cliff = lock-up period before any tokens unlock. Duration = full vesting period from start.
        </p>
      </div>

      {field("Token Allocation (HVE)", "allocation", "100000", "number")}

      <p className="text-xs text-gray-700">
        Multiple grants per employee are allowed — each deploys an independent vault.
      </p>

      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="relative mt-1 overflow-hidden rounded-xl py-3 font-bold text-sm tracking-wide text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #6d28d9, #7c3aed, #8b5cf6)" }}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing transaction…
          </span>
        ) : isConfirming ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Confirming on-chain…
          </span>
        ) : (
          "Create Vesting Plan"
        )}
      </button>

      {isSuccess && (
        <div className="rounded-lg border border-green-800/50 bg-green-950/40 px-3 py-2.5 text-center text-sm text-green-400">
          Vesting plan created!{" "}
          <a
            href={`https://testnet.purrsec.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 opacity-80 hover:opacity-100"
          >
            View on explorer
          </a>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-950/40 px-3 py-2 text-center text-xs text-red-400">
          {error}
        </div>
      )}
    </form>
  );
}
