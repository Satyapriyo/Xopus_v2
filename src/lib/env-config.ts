// Environment configuration loader
// This ensures environment variables are properly loaded in all contexts

export const ENV_CONFIG = {
  // Contract Configuration
  CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS ||
    "0x225d97fe3049E2B834bfC69edA125Df52a7F0255",
  CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID || "84532",
  RPC_URL:
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://base-sepolia-rpc.publicnode.com",

  // Supabase Configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  // AI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "",
  AI_MODEL: process.env.AI_MODEL || "",

  // Wallet Configuration
  WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

  // Debug environment loading
  isLoaded() {
    const missing = [];

    if (!this.CONTRACT_ADDRESS) missing.push("CONTRACT_ADDRESS");
    if (!this.SUPABASE_URL) missing.push("SUPABASE_URL");
    if (!this.SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
    if (!this.SUPABASE_SERVICE_KEY) missing.push("SUPABASE_SERVICE_KEY");

    if (missing.length > 0) {
      console.warn("❌ Missing environment variables:", missing);
      return false;
    }

    console.log("✅ All environment variables loaded successfully");
    return true;
  },
};

// Log configuration status on load
if (typeof window !== "undefined") {
  console.log("🔧 Environment Config:", {
    contractAddress: ENV_CONFIG.CONTRACT_ADDRESS ? "✅" : "❌",
    rpcUrl: ENV_CONFIG.RPC_URL ? "✅" : "❌",
    supabaseUrl: ENV_CONFIG.SUPABASE_URL ? "✅" : "❌",
    walletConnect: ENV_CONFIG.WALLETCONNECT_PROJECT_ID ? "✅" : "❌",
  });
}
