"use client";

interface ProgressBarProps {
  progress: number; // 0–100
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, progress));
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex justify-between text-sm text-gray-400">
          <span>{label}</span>
          <span>{pct.toFixed(2)}%</span>
        </div>
      )}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
