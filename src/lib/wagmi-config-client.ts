"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

// Lightweight chain configuration to reduce memory usage
const optimizedBaseSepolia = {
  ...baseSepolia,
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ||
          "https://base-sepolia-rpc.publicnode.com",
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ||
          "https://base-sepolia-rpc.publicnode.com",
      ],
    },
  },
};

let clientConfig: any = null;

export function createClientWagmiConfig() {
  // Only create the config on the client side
  if (typeof window === "undefined") {
    return null;
  }

  // Return cached config to prevent recreation
  if (clientConfig) {
    return clientConfig;
  }

  clientConfig = getDefaultConfig({
    appName: "AI Agent Payment System",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [optimizedBaseSepolia],
    ssr: false, // Disable SSR to prevent indexedDB errors
    transports: {
      [baseSepolia.id]: http(
        process.env.NEXT_PUBLIC_RPC_URL ||
          "https://base-sepolia-rpc.publicnode.com",
        {
          // Optimize HTTP transport
          batch: true,
          fetchOptions: {
            keepalive: false,
          },
          retryCount: 2,
          retryDelay: 1000,
        }
      ),
    },
    // Reduce polling intervals to save memory
    pollingInterval: 30000, // 30 seconds instead of default 4 seconds
  });

  return clientConfig;
}
