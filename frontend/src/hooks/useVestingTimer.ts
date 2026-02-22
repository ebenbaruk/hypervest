"use client";

import { useState, useEffect } from "react";
import {
  vestedAmount,
  releasable,
  vestingProgress,
  secondsUntilCliff,
  secondsUntilFullyVested,
  type VestingParams,
} from "@/lib/vesting";

interface TimerState {
  nowSec: bigint;
  vested: bigint;
  claimable: bigint;
  progress: number;          // 0–100
  secsUntilCliff: bigint;
  secsUntilEnd: bigint;
}

/**
 * Drives a 1-second client-side interval to compute live vesting values
 * without hammering the RPC. The on-chain params are fetched every 30s by
 * useVestingData; this hook re-computes locally every second.
 */
export function useVestingTimer(params?: VestingParams): TimerState {
  const nowBig = () => BigInt(Math.floor(Date.now() / 1000));

  const compute = (p?: VestingParams): TimerState => {
    const now = nowBig();
    if (!p) {
      return {
        nowSec: now,
        vested: 0n,
        claimable: 0n,
        progress: 0,
        secsUntilCliff: 0n,
        secsUntilEnd: 0n,
      };
    }
    return {
      nowSec: now,
      vested: vestedAmount(p, now),
      claimable: releasable(p, now),
      progress: vestingProgress(p, now),
      secsUntilCliff: secondsUntilCliff(p, now),
      secsUntilEnd: secondsUntilFullyVested(p, now),
    };
  };

  const [state, setState] = useState<TimerState>(() => compute(params));

  useEffect(() => {
    setState(compute(params));
    const id = setInterval(() => setState(compute(params)), 1_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.start, params?.cliff, params?.duration, params?.totalAllocation, params?.released]);

  return state;
}
