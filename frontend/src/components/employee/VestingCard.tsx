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
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-800 rounded w-full mb-2" />
        <div className="h-3 bg-gray-800 rounded w-2/3" />
      </div>
    );
  }

  if (!params) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-gray-500 text-center">
        No vesting schedule found.
      </div>
    );
  }

  const isInCliff = timer.secsUntilCliff > 0n;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Your Equity Vest</h2>
        <p className="text-xs text-gray-500 mt-1 font-mono break-all">{vaultAddress}</p>
      </div>

      {/* Live progress bar */}
      <ProgressBar progress={timer.progress} label="Vested" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Stat label="Total Allocation" value={`${formatTokens(params.totalAllocation)} HVE`} />
        <Stat label="Vested" value={`${formatTokens(timer.vested)} HVE`} highlight />
        <Stat label="Claimable Now" value={`${formatTokens(timer.claimable)} HVE`} highlight />
        <Stat label="Already Claimed" value={`${formatTokens(params.released)} HVE`} />
        <Stat
          label={isInCliff ? "Cliff ends in" : "Fully vested in"}
          value={isInCliff ? formatCountdown(timer.secsUntilCliff) : formatCountdown(timer.secsUntilEnd)}
        />
        <Stat label="Status" value={isInCliff ? "In cliff period" : timer.secsUntilEnd === 0n ? "Fully vested" : "Vesting"} />
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
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-gray-800 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-semibold text-sm mt-0.5 ${highlight ? "text-violet-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
