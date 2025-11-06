import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

// Mark root route as dynamic since it uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const user = await getUser();

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
