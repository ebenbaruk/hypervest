"use client";

import Link from "next/link";
import { useDemoWallet } from "@/contexts/DemoContext";
import { DemoWalletButton } from "@/components/DemoWalletButton";
import { CreateVestingForm } from "@/components/admin/CreateVestingForm";
import { PerformanceSelector } from "@/components/admin/PerformanceSelector";

export default function AdminPage() {
  const { role } = useDemoWallet();
  const isConnected = role === "employer";

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
            Employer Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Issue programmable equity vesting plans on-chain.
          </p>
        </div>

        {/* Content */}
        {isConnected ? (
          <div className="flex flex-col gap-4">
            {/* Performance trigger selector */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5 backdrop-blur">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-violet-500" />
                <h2 className="font-semibold text-white">Performance Trigger</h2>
              </div>
              <PerformanceSelector />
            </div>

            {/* Vesting plan form */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 backdrop-blur"
              style={{ boxShadow: "0 0 0 1px rgba(109,40,217,0.06) inset" }}>
              <div className="mb-5 flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-violet-500" />
                <h2 className="font-semibold text-white">Grant Parameters</h2>
              </div>
              <CreateVestingForm />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-800 bg-gray-900/70 p-12 text-center backdrop-blur">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-800/40 bg-violet-950/50 text-3xl">
              🏢
            </div>
            <div>
              <p className="font-semibold text-white">Connect as Employer</p>
              <p className="mt-1 text-sm text-gray-500">
                Select the Employer role to create vesting plans.
              </p>
            </div>
            <DemoWalletButton />
          </div>
        )}

      </div>
    </main>
  );
}
