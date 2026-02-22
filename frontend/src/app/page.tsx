import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          Hyper<span className="text-violet-500">Vest</span>
        </h1>
        <p className="mt-3 text-gray-400 text-lg">
          On-chain equity vesting — Soulbound Tokens on HyperEVM
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          href="/admin"
          className="flex-1 flex flex-col items-center gap-2 bg-gray-900 border border-gray-800 hover:border-violet-500 rounded-2xl p-8 transition-colors group"
        >
          <span className="text-4xl">🏢</span>
          <span className="font-bold text-white text-xl group-hover:text-violet-400 transition-colors">
            Employer
          </span>
          <span className="text-gray-500 text-sm text-center">
            Create and manage vesting plans
          </span>
        </Link>

        <Link
          href="/employee"
          className="flex-1 flex flex-col items-center gap-2 bg-gray-900 border border-gray-800 hover:border-violet-500 rounded-2xl p-8 transition-colors group"
        >
          <span className="text-4xl">👤</span>
          <span className="font-bold text-white text-xl group-hover:text-violet-400 transition-colors">
            Employee
          </span>
          <span className="text-gray-500 text-sm text-center">
            Track your vest and claim tokens
          </span>
        </Link>
      </div>

      <p className="text-gray-600 text-xs">HyperEVM Testnet · Chain ID 998</p>
    </main>
  );
}
