"use client";

import { useState, useEffect, useCallback } from "react";
import { publicClient } from "@/lib/viemClients";
import { FACTORY_ABI, FACTORY_ADDRESS, VAULT_ABI } from "@/lib/contracts";
import type { VestingParams } from "@/lib/vesting";

/** Fetch all vault addresses for a given employer+employee pair. */
export function useVaultAddresses(
  employer?: `0x${string}`,
  employee?: `0x${string}`
) {
  const [data, setData] = useState<readonly `0x${string}`[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!employer || !employee) return;
    setIsLoading(true);
    try {
      const vaults = await publicClient.readContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "getVaultsForEmployee",
        args: [employer, employee],
      });
      setData(vaults as readonly `0x${string}`[]);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [employer, employee]);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 15_000);
    return () => clearInterval(id);
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

/** Full vesting schedule from a single vault address. */
export function useVestingSchedule(vaultAddress?: `0x${string}`) {
  const [data, setData] = useState<readonly unknown[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState<VestingParams | undefined>();

  const fetch = useCallback(async () => {
    if (!vaultAddress) return;
    setIsLoading(true);
    try {
      const result = await publicClient.readContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: "vestingSchedule",
      });
      setData(result as readonly unknown[]);

      const [, , _start, _cliff, _duration, _totalAllocation, _released] =
        result as [
          `0x${string}`,
          `0x${string}`,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
        ];

      setParams({
        start: _start,
        cliff: _cliff,
        duration: _duration,
        totalAllocation: _totalAllocation,
        released: _released,
      });
    } catch (e) {
      console.error("useVestingSchedule:", e);
    } finally {
      setIsLoading(false);
    }
  }, [vaultAddress]);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 30_000);
    return () => clearInterval(id);
  }, [fetch]);

  return { data, isLoading, params, refetch: fetch };
}
