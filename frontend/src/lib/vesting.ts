/**
 * Pure vesting math — mirrors VestingVault.sol exactly.
 * Used by useVestingTimer to compute live values client-side.
 */

export interface VestingParams {
  start: bigint;      // unix seconds
  cliff: bigint;      // seconds
  duration: bigint;   // seconds
  totalAllocation: bigint; // 18-decimal tokens
  released: bigint;
}

/** Cumulative tokens vested at a given timestamp. */
export function vestedAmount(params: VestingParams, nowSec: bigint): bigint {
  const { start, cliff, duration, totalAllocation } = params;
  const elapsed = nowSec - start;

  if (elapsed < cliff) return 0n;
  if (elapsed >= duration) return totalAllocation;
  return (totalAllocation * elapsed) / duration;
}

/** Tokens claimable right now. */
export function releasable(params: VestingParams, nowSec: bigint): bigint {
  return vestedAmount(params, nowSec) - params.released;
}

/** Progress percentage (0–100) for the progress bar. */
export function vestingProgress(params: VestingParams, nowSec: bigint): number {
  const vested = vestedAmount(params, nowSec);
  if (params.totalAllocation === 0n) return 0;
  return Number((vested * 10000n) / params.totalAllocation) / 100;
}

/** Format a bigint (18 decimals) to a human-readable string. */
export function formatTokens(amount: bigint, decimals = 18): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const frac = amount % divisor;
  if (frac === 0n) return whole.toLocaleString();
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, 4).replace(/0+$/, "");
  return `${whole.toLocaleString()}.${fracStr}`;
}

/** Seconds until cliff ends (0 if already past). */
export function secondsUntilCliff(params: VestingParams, nowSec: bigint): bigint {
  const cliffEnd = params.start + params.cliff;
  return cliffEnd > nowSec ? cliffEnd - nowSec : 0n;
}

/** Seconds until fully vested (0 if already complete). */
export function secondsUntilFullyVested(params: VestingParams, nowSec: bigint): bigint {
  const end = params.start + params.duration;
  return end > nowSec ? end - nowSec : 0n;
}

/** Format seconds into a human-readable countdown string. */
export function formatCountdown(seconds: bigint): string {
  const s = Number(seconds);
  if (s <= 0) return "Complete";
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}
