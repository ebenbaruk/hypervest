"use client";

import Link from "next/link";
import { useDemoWallet } from "@/contexts/DemoContext";
import { DemoWalletButton } from "@/components/DemoWalletButton";
import { CreateVestingForm } from "@/components/admin/CreateVestingForm";

export default function AdminPage() {
  const { role } = useDemoWallet();
  const isConnected = role === "employer";

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Back
        </Link>
        <DemoWalletButton />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Issue equity vesting plans to employees as Soulbound Tokens.
        </p>
      </div>

      {isConnected ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-5">Create Vesting Plan</h2>
          <CreateVestingForm />
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <p className="text-gray-500 mb-4">Connect as Employer to create a vesting plan.</p>
          <DemoWalletButton />
        </div>
      )}
    </main>
  );
}
