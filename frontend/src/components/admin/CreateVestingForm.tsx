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
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 font-mono text-sm"
        required
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {field("Employee Wallet Address", "beneficiary", "0x...")}

      <div className="grid grid-cols-2 gap-3">
        {field("Cliff (seconds)", "cliffSeconds", "60", "number")}
        {field("Duration (seconds)", "durationSeconds", "300", "number")}
      </div>

      {field("Token Allocation (HVE)", "allocation", "100000", "number")}

      <p className="text-xs text-gray-600">
        Multiple grants per employee are allowed — each creates an independent vault.
      </p>

      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="mt-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isPending
          ? "Signing transaction…"
          : isConfirming
          ? "Confirming on-chain…"
          : "Create Vesting Plan"}
      </button>

      {isSuccess && (
        <p className="text-green-400 text-sm text-center">
          ✓ Vesting plan created!{" "}
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
    </form>
  );
}
