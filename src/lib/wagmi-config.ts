import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

// Enhanced chain configuration with multiple RPC endpoints
const enhancedBaseSepolia = {
  ...baseSepolia,
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ||
          "https://base-sepolia-rpc.publicnode.com",
        "https://sepolia.base.org",
        "https://base-sepolia.blockpi.network/v1/rpc/public",
        "https://base-sepolia.gateway.tenderly.co",
      ],
    },
    public: {
      http: [
        "https://base-sepolia-rpc.publicnode.com",
        "https://sepolia.base.org",
        "https://base-sepolia.blockpi.network/v1/rpc/public",
      ],
    },
  },
};

export const wagmiConfig = getDefaultConfig({
  appName: "AI Agent Payment System - X402",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [enhancedBaseSepolia],
  ssr: false, // Disable SSR for WalletConnect to prevent indexedDB errors
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ||
        "https://base-sepolia-rpc.publicnode.com",
      {
        batch: true,
        fetchOptions: {
          timeout: 60000,
        },
        retryCount: 3,
        retryDelay: 1000,
      }
    ),
  },
});
