import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

// Mark root route as dynamic since it uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Handle "no session" as normal case
    if (error) {
      const isNoSessionError =
        error.status === 400 &&
        (error.message === "Auth session missing!" ||
          error.message.includes("session"));
      if (!isNoSessionError) {
        console.error("[Home] Auth error:", error.message);
      }
    }

    if (user) {
      redirect("/dashboard");
    }

    redirect("/dashboard");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError = errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("getaddrinfo");

    if (isNetworkError) {
      console.error("[Home] Network error:", errorMessage);
    } else {
      console.error("[Home] Unexpected error:", errorMessage);
    }
    redirect("/dashboard");
  }
}
