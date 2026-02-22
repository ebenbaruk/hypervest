import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 p-8 overflow-hidden">

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(109,40,217,0.15), transparent)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(circle, #1f2937 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Hero */}
      <div className="relative flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-800/50 bg-violet-950/50 px-3 py-1 text-xs text-violet-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          Live on HyperEVM · Chain ID 998 · Hackin&apos;Dau 2026
        </span>

        <h1 className="text-6xl font-black tracking-tight sm:text-7xl">
          <span className="text-white">Hyper</span>
          <span style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Vest
          </span>
        </h1>

        <p className="max-w-xs text-base text-gray-400 leading-relaxed sm:text-lg">
          Equity that unlocks with{" "}
          <span className="font-semibold text-white">performance</span>.
          Not just with time.
        </p>
      </div>

      {/* Role cards */}
      <div className="relative flex w-full max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row">
        <Link
          href="/admin"
          className="group flex flex-1 flex-col items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/70 p-8 backdrop-blur transition-all duration-200 hover:border-violet-600/50 hover:bg-gray-900"
          style={{ "--hover-shadow": "0 0 30px rgba(109,40,217,0.12)" } as React.CSSProperties}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-800/40 bg-violet-950/50 text-2xl transition-transform duration-200 group-hover:scale-110">
            🏢
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold text-white transition-colors group-hover:text-violet-300">
              Employer
            </span>
            <span className="mt-0.5 block text-sm text-gray-500">
              Issue programmable equity
            </span>
          </div>
        </Link>

        <Link
          href="/employee"
          className="group flex flex-1 flex-col items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900/70 p-8 backdrop-blur transition-all duration-200 hover:border-violet-600/50 hover:bg-gray-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-700/50 bg-gray-800/60 text-2xl transition-transform duration-200 group-hover:scale-110">
            👤
          </div>
          <div className="text-center">
            <span className="block text-lg font-bold text-white transition-colors group-hover:text-violet-300">
              Employee
            </span>
            <span className="mt-0.5 block text-sm text-gray-500">
              Track and claim your equity
            </span>
          </div>
        </Link>
      </div>

    </main>
  );
}
