"use client";

import { useVestingSchedule } from "@/hooks/useVestingData";
import { useVestingTimer } from "@/hooks/useVestingTimer";
import { ProgressBar } from "./ProgressBar";
import { ClaimButton } from "./ClaimButton";
import { formatTokens, formatCountdown } from "@/lib/vesting";

interface VestingCardProps {
  vaultAddress: `0x${string}`;
}

export function VestingCard({ vaultAddress }: VestingCardProps) {
  const { params, isLoading, refetch } = useVestingSchedule(vaultAddress);
  const timer = useVestingTimer(params);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-gray-800 bg-gray-900/80 p-6 flex flex-col gap-5">
        <div className="h-5 w-1/3 rounded-md bg-gray-800" />
        <div className="h-20 rounded-xl bg-gray-800" />
        <div className="h-2.5 rounded-full bg-gray-800" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-lg bg-gray-800" />)}
        </div>
      </div>
    );
  }

  if (!params) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 text-center text-sm text-gray-500">
        No vesting schedule found.
      </div>
    );
  }

  const isInCliff = timer.secsUntilCliff > 0n;
  const isFullyVested = !isInCliff && timer.secsUntilEnd === 0n;

  const statusConfig = isInCliff
    ? { label: "CLIFF PERIOD", dot: "bg-amber-400", text: "text-amber-400", badge: "border-amber-800/50 bg-amber-950/40 text-amber-400" }
    : isFullyVested
    ? { label: "FULLY VESTED", dot: "bg-green-400", text: "text-green-400", badge: "border-green-800/50 bg-green-950/40 text-green-400" }
    : { label: "VESTING", dot: "bg-violet-400 animate-pulse", text: "text-violet-300", badge: "border-violet-800/50 bg-violet-950/40 text-violet-300" };

  const countdownBg = isInCliff
    ? "border-amber-800/30 bg-amber-950/20"
    : isFullyVested
    ? "border-green-800/30 bg-green-950/20"
    : "border-violet-800/30 bg-violet-950/20";

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-800 bg-gray-900/80 p-6 backdrop-blur">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">Your Equity Grant</h2>
          <p className="mt-0.5 truncate font-mono text-xs text-gray-600">
            {vaultAddress}
          </p>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-widest ${statusConfig.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>

      {/* Countdown — the star of the show */}
      <div className={`rounded-xl border p-4 ${countdownBg}`}>
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-gray-500">
          {isInCliff ? "Cliff ends in" : isFullyVested ? "Status" : "Fully vested in"}
        </p>
        <p className={`text-4xl font-black tracking-tight tabular-nums ${statusConfig.text}`}
          style={{ fontVariantNumeric: "tabular-nums" }}>
          {isInCliff
            ? formatCountdown(timer.secsUntilCliff)
            : isFullyVested
            ? "Complete"
            : formatCountdown(timer.secsUntilEnd)}
        </p>
      </div>

      {/* Progress */}
      <ProgressBar progress={timer.progress} label="Vested" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 text-sm">
        <Stat label="Total Allocation" value={`${formatTokens(params.totalAllocation)} HVE`} />
        <Stat label="Vested" value={`${formatTokens(timer.vested)} HVE`} accent="violet" />
        <Stat label="Claimable Now" value={`${formatTokens(timer.claimable)} HVE`} accent="violet" />
        <Stat label="Already Claimed" value={`${formatTokens(params.released)} HVE`} />
      </div>

      {/* Claim */}
      <ClaimButton
        vaultAddress={vaultAddress}
        claimable={timer.claimable}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "violet" | "green";
}) {
  return (
    <div className="rounded-lg border border-gray-800/60 bg-gray-800/40 px-3 py-2.5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-0.5 font-bold text-sm ${
        accent === "violet" ? "text-violet-400"
        : accent === "green" ? "text-green-400"
        : "text-white"
      }`}>
        {value}
      </p>
    </div>
  );
}
