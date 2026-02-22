import {
  createPublicClient,
  custom,
  encodeFunctionData,
  parseGwei,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hyperEvmTestnet } from "./chain";
import { DEMO_EMPLOYER, DEMO_EMPLOYEE } from "./demoAccounts";

const RPC_URL = "/api/rpc";

let reqId = 0;
function hyperEvmTransport() {
  return custom({
    async request({ method, params }) {
      // HyperEVM does not support the "pending" block tag
      const patched = (params as unknown[])?.map((p) =>
        p === "pending" ? "latest" : p
      );
      const res = await fetch(RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: ++reqId,
          method,
          params: patched ?? params,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);
      return json.result;
    },
  });
}

export const publicClient = createPublicClient({
  chain: hyperEvmTestnet,
  transport: hyperEvmTransport(),
});

const employerAccount = privateKeyToAccount(DEMO_EMPLOYER.privateKey);
const employeeAccount = privateKeyToAccount(DEMO_EMPLOYEE.privateKey);

/**
 * Sign and send a legacy transaction directly.
 * Bypasses viem's prepareTransactionRequest entirely — only 2 RPC calls:
 *   1. eth_getTransactionCount (with "latest", not "pending")
 *   2. eth_sendRawTransaction
 */
async function sendLegacyTx(
  account: ReturnType<typeof privateKeyToAccount>,
  to: `0x${string}`,
  data: `0x${string}`,
  gas: bigint
): Promise<`0x${string}`> {
  const nonce = await publicClient.getTransactionCount({
    address: account.address,
    blockTag: "latest",
  });

  const signedTx = await account.signTransaction({
    chainId: hyperEvmTestnet.id,
    to,
    data,
    nonce,
    gas,
    gasPrice: parseGwei("0.1"),
    type: "legacy",
    value: 0n,
  });

  return publicClient.request({
    method: "eth_sendRawTransaction",
    params: [signedTx],
  }) as Promise<`0x${string}`>;
}

interface TxParams {
  address: `0x${string}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abi: any;
  functionName: string;
  args?: readonly unknown[];
}

/** Send a write transaction as the employer. */
export async function writeEmployer(params: TxParams): Promise<`0x${string}`> {
  const data = encodeFunctionData(params);
  return sendLegacyTx(employerAccount, params.address, data, 3_000_000n);
}

/** Send a write transaction as the employee. */
export async function writeEmployee(params: TxParams): Promise<`0x${string}`> {
  const data = encodeFunctionData(params);
  return sendLegacyTx(employeeAccount, params.address, data, 300_000n);
}
