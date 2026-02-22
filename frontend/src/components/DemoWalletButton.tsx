"use client";

import { useDemoWallet } from "@/contexts/DemoContext";
import { DEMO_EMPLOYER, DEMO_EMPLOYEE } from "@/lib/demoAccounts";

export function DemoWalletButton() {
  const { role, address, setRole, disconnect } = useDemoWallet();

  if (role) {
    const account = role === "employer" ? DEMO_EMPLOYER : DEMO_EMPLOYEE;
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-2 rounded-xl border border-gray-700/60 bg-gray-800/80 px-2.5 py-1.5 backdrop-blur">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-sm">{account.emoji}</span>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-medium text-gray-400">{account.label}</span>
            <span className="font-mono text-xs text-white">
              {address?.slice(0, 6)}…{address?.slice(-4)}
            </span>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="rounded-lg px-2 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-800 hover:text-white"
        >
          Switch
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      <button
        onClick={() => setRole("employer")}
        className="flex items-center gap-1.5 rounded-xl border border-violet-700/50 bg-violet-900/60 px-3 py-1.5 text-sm font-medium text-violet-200 transition-colors hover:bg-violet-800/70 hover:text-white"
      >
        🏢 Employer
      </button>
      <button
        onClick={() => setRole("employee")}
        className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/70 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
      >
        👤 Employee
      </button>
    </div>
  );
}
