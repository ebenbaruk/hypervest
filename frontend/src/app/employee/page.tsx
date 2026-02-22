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
    <main className="relative min-h-screen p-5 sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-50"
        style={{ background: "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(109,40,217,0.08), transparent)" }} />

      <div className="relative mx-auto flex max-w-lg flex-col gap-6">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-white"
          >
            <span className="text-base">←</span>
            <span className="font-medium">
              Hyper<span className="text-violet-400">Vest</span>
            </span>
          </Link>
          <DemoWalletButton />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Employee Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Track your equity vesting and claim earned tokens.
          </p>
        </div>

        {/* Content */}
        {isConnected ? (
          <>
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-700 border-t-violet-500" />
                Looking up vaults…
              </div>
            )}

            {!isLoading && !latestVault && (
              <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-10 text-center backdrop-blur">
                <p className="text-sm text-gray-500">
                  No vesting vault found yet.
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Ask the employer to create a plan first.
                </p>
              </div>
            )}

            {latestVault && (
              <VestingCard vaultAddress={latestVault as `0x${string}`} />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-800 bg-gray-900/70 p-12 text-center backdrop-blur">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-700/50 bg-gray-800/60 text-3xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-white">Connect as Employee</p>
              <p className="mt-1 text-sm text-gray-500">
                Select the Employee role to view your vesting schedule.
              </p>
            </div>
            <DemoWalletButton />
          </div>
        )}

      </div>
    </main>
  );
}
