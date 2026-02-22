"use client";

import { useState } from "react";

type TriggerId = "time" | "revenue" | "github" | "kpi";

type Trigger = {
  id: TriggerId;
  icon: string;
  label: string;
  desc: string;
  oracle: string | null;
  detail: string;
  accent: {
    border: string;
    bg: string;
    text: string;
    badge: string;
    badgeText: string;
  };
};

const TRIGGERS: Trigger[] = [
  {
    id: "time",
    icon: "⏱",
    label: "Time-based",
    desc: "Cliff + linear unlock",
    oracle: null,
    detail:
      "The cliff and duration define a fixed schedule. Tokens unlock continuously after the cliff period. This is the active mode — all transactions in this demo use this trigger.",
    accent: {
      border: "border-violet-600/60",
      bg: "bg-violet-950/40",
      text: "text-violet-300",
      badge: "bg-violet-900/60 border-violet-700/50",
      badgeText: "text-violet-300",
    },
  },
  {
    id: "revenue",
    icon: "📈",
    label: "Revenue Milestone",
    desc: "Stripe MRR oracle",
    oracle: "Stripe",
    detail:
      "When the company's MRR crosses a target, the oracle feeds the result on-chain. Cliff triggers at $10k MRR — full vesting at $100k MRR. No calendar. Pure performance.",
    accent: {
      border: "border-emerald-700/50",
      bg: "bg-emerald-950/30",
      text: "text-emerald-400",
      badge: "bg-emerald-900/40 border-emerald-800/40",
      badgeText: "text-emerald-400",
    },
  },
  {
    id: "github",
    icon: "⚡",
    label: "GitHub Activity",
    desc: "Commits & PRs merged",
    oracle: "GitHub",
    detail:
      "Every merged PR on the target repo triggers the oracle. 10 PRs = cliff reached. Each subsequent contribution unlocks a slice of equity. Code shipped = equity earned.",
    accent: {
      border: "border-blue-700/50",
      bg: "bg-blue-950/30",
      text: "text-blue-400",
      badge: "bg-blue-900/40 border-blue-800/40",
      badgeText: "text-blue-400",
    },
  },
  {
    id: "kpi",
    icon: "🎯",
    label: "Custom KPI",
    desc: "Any on-chain oracle metric",
    oracle: "Custom",
    detail:
      "NPS score, signups, sales calls, DAU — any measurable KPI piped via a custom oracle feed. The smart contract treats any verified numeric signal as a vesting trigger.",
    accent: {
      border: "border-amber-700/50",
      bg: "bg-amber-950/30",
      text: "text-amber-400",
      badge: "bg-amber-900/40 border-amber-800/40",
      badgeText: "text-amber-400",
    },
  },
];

export function PerformanceSelector() {
  const [selected, setSelected] = useState<TriggerId>("time");

  const active = TRIGGERS.find((t) => t.id === selected)!;
  const isDemo = selected === "time";

  return (
    <div className="flex flex-col gap-3">

      {/* Trigger grid */}
      <div className="grid grid-cols-2 gap-2">
        {TRIGGERS.map((trigger) => {
          const isActive = selected === trigger.id;
          return (
            <button
              key={trigger.id}
              type="button"
              onClick={() => setSelected(trigger.id)}
              className={`relative flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all duration-150 ${
                isActive
                  ? `${trigger.accent.border} ${trigger.accent.bg}`
                  : "border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-800/40"
              }`}
            >
              {/* Oracle badge */}
              {trigger.oracle && (
                <span
                  className={`absolute right-2 top-2 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isActive
                      ? `${trigger.accent.badge} ${trigger.accent.badgeText}`
                      : "border-gray-700 bg-gray-800 text-gray-500"
                  }`}
                >
                  {trigger.oracle}
                </span>
              )}
              {!trigger.oracle && isActive && (
                <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-violet-700/50 bg-violet-900/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              )}

              <span className="text-xl">{trigger.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${isActive ? active.accent.text : "text-gray-300"}`}>
                  {trigger.label}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{trigger.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div
        className={`rounded-xl border p-3.5 transition-all duration-200 ${
          isDemo
            ? "border-violet-800/30 bg-violet-950/20"
            : "border-gray-700/50 bg-gray-800/30"
        }`}
      >
        <p className="text-xs leading-relaxed text-gray-400">{active.detail}</p>
        {!isDemo && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Oracle not connected — demo uses time as a proxy for this trigger.
          </p>
        )}
      </div>

    </div>
  );
}
