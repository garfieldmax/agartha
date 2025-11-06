import { createClient } from "@supabase/supabase-js";

// Create unauthenticated Supabase client for database queries only
// Authentication is handled by Privy, not Supabase
export async function supabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Log environment variable status (without exposing sensitive values)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[Supabase] Missing environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlPrefix: supabaseUrl?.substring(0, 20) || "missing",
    });
    throw new Error("Missing Supabase environment variables");
  }

  try {
    // Create a simple client without auth session handling
    const client = createClient(supabaseUrl, supabaseAnonKey);
    return client;
  } catch (error) {
    console.error("[Supabase] Failed to create client:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
