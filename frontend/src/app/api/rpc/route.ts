import { NextRequest, NextResponse } from "next/server";

// Verified working endpoints (api.hyperliquid-testnet.xyz/evm returns 404)
const RPC_ENDPOINTS = [
  "https://rpcs.chain.link/hyperevm/testnet",
  "https://spectrum-01.simplystaking.xyz/hyperliquid-tn-rpc/evm",
  "https://rpc.hyperliquid-testnet.xyz/evm",
];

export async function POST(req: NextRequest) {
  const body = await req.text();

  let lastError: unknown;
  for (const url of RPC_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const upstream = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: controller.signal,
      });

      const text = await upstream.text();

      try {
        JSON.parse(text);
      } catch {
        lastError = new Error(`Non-JSON from ${url}: ${text.slice(0, 120)}`);
        continue;
      }

      return new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }

  const msg = lastError instanceof Error ? lastError.message : String(lastError);
  return NextResponse.json(
    { jsonrpc: "2.0", id: null, error: { code: -32603, message: `RPC unavailable: ${msg}` } },
    { status: 503 }
  );
}
