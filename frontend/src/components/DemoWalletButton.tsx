"use client";

import { useDemoWallet } from "@/contexts/DemoContext";
import { DEMO_EMPLOYER, DEMO_EMPLOYEE } from "@/lib/demoAccounts";

export function DemoWalletButton() {
  const { role, address, setRole, disconnect } = useDemoWallet();

  if (role) {
    const account = role === "employer" ? DEMO_EMPLOYER : DEMO_EMPLOYEE;
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5">
          <span className="text-base">{account.emoji}</span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs text-gray-400">{account.label}</span>
            <span className="text-xs font-mono text-white">
              {address?.slice(0, 6)}…{address?.slice(-4)}
            </span>
          </div>
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1.5"
        >
          Switch
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setRole("employer")}
        className="flex items-center gap-1.5 bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
      >
        🏢 Employer
      </button>
      <button
        onClick={() => setRole("employee")}
        className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
      >
        👤 Employee
      </button>
    </div>
  );
}
