import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

export async function getUser(): Promise<User | null> {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // "Auth session missing!" is expected when not logged in - not an error
      const isNoSessionError =
        error.status === 400 &&
        (error.message === "Auth session missing!" ||
          error.message.includes("session") ||
          error.message.includes("JWT"));

      if (isNoSessionError) {
        return null;
      }

      // Log actual errors with full details
      console.error("[getUser] Supabase auth error:", {
        status: error.status,
        message: error.message,
        name: error.name,
      });
      throw error;
    }

    return user;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError =
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("getaddrinfo") ||
      errorMessage.includes("timeout");

    if (isNetworkError) {
      console.error("[getUser] ⚠️ Network/DNS error detected:", {
        error: errorMessage,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      });
      return null;
    }

    // For other errors, log them but still return null to avoid breaking the app
    console.error("[getUser] Unexpected error:", {
      error: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return null;
  }
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
