import { defineChain } from "viem";

export const hyperEvmTestnet = defineChain({
  id: 998,
  name: "HyperEVM Testnet",
  nativeCurrency: {
    name: "HYPE",
    symbol: "HYPE",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://rpcs.chain.link/hyperevm/testnet",
        "https://spectrum-01.simplystaking.xyz/hyperliquid-tn-rpc/evm",
        "https://rpc.hyperliquid-testnet.xyz/evm",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Purrsec",
      url: "https://testnet.purrsec.com",
    },
  },
  testnet: true,
});
