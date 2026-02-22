"use client";

interface ProgressBarProps {
  progress: number; // 0–100
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, progress));
  const isActive = pct > 0 && pct < 100;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400">{label}</span>
          <span className="font-bold tabular-nums text-violet-400">
            {pct.toFixed(2)}%
          </span>
        </div>
      )}

      <div className="relative h-2.5 overflow-hidden rounded-full bg-gray-800">
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #5b21b6, #7c3aed, #8b5cf6)",
          }}
        />

        {/* Shimmer when actively vesting */}
        {isActive && (
          <div
            className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
            style={{ width: `${pct}%` }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                animation: "shimmer 2.2s ease-in-out infinite",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
