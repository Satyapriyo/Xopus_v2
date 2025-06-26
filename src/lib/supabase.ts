import { createClient } from "@supabase/supabase-js";
import { ENV_CONFIG } from "./env-config";

// Ensure environment variables are loaded
ENV_CONFIG.isLoaded();

const supabaseUrl = ENV_CONFIG.SUPABASE_URL;
const supabaseAnonKey = ENV_CONFIG.SUPABASE_ANON_KEY;

// Debug environment variables (remove in production)
if (typeof window === "undefined") {
  console.log("🔐 Supabase Environment Check:", {
    url: supabaseUrl ? "✅" : "❌",
    anonKey: supabaseAnonKey ? "✅" : "❌",
    urlValue: supabaseUrl,
    anonKeyLength: supabaseAnonKey?.length || 0,
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables (URL and ANON_KEY)"
  );
}

// Main client for frontend use (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client factory - only creates when needed and service key is available
export const getSupabaseAdmin = () => {
  const supabaseServiceKey = ENV_CONFIG.SUPABASE_SERVICE_KEY;

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_KEY - admin client not available"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};
