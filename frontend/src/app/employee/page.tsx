"use client";

import Link from "next/link";
import { useDemoWallet } from "@/contexts/DemoContext";
import { DemoWalletButton } from "@/components/DemoWalletButton";
import { useVaultAddresses } from "@/hooks/useVestingData";
import { VestingCard } from "@/components/employee/VestingCard";
import { DEMO_EMPLOYER } from "@/lib/demoAccounts";

export default function EmployeePage() {
  const { role, address } = useDemoWallet();
  const isConnected = role === "employee";

  const { data: vaultAddresses, isLoading } = useVaultAddresses(
    DEMO_EMPLOYER.address,
    address
  );

  const allVaults = (vaultAddresses ?? []).filter(
    (v) => v !== "0x0000000000000000000000000000000000000000"
  );
  const latestVault = allVaults.at(-1);

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Back
        </Link>
        <DemoWalletButton />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Track your vesting schedules and claim earned equity.
        </p>
      </div>

      {isConnected ? (
        <>
          {isLoading && (
            <p className="text-center text-gray-500 text-sm">Looking up vaults…</p>
          )}

          {!isLoading && !latestVault && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-gray-500 text-sm">
              No vesting vault found yet. Ask the employer to create one first.
            </div>
          )}

          {latestVault && (
            <VestingCard vaultAddress={latestVault as `0x${string}`} />
          )}
        </>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <p className="text-gray-500 mb-4">Connect as Employee to view your vesting schedules.</p>
          <DemoWalletButton />
        </div>
      )}
    </main>
  );
}
