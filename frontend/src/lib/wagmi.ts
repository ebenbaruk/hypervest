"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hyperEvmTestnet } from "./chain";

export const wagmiConfig = getDefaultConfig({
  appName: "HyperVest",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID",
  chains: [hyperEvmTestnet],
  ssr: true,
});
