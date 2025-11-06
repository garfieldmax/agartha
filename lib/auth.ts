import { redirect } from "next/navigation";
import { getPrivyUser, requirePrivyUser } from "@/lib/privyServer";

export type User = {
  id: string;
  email?: string;
  createdAt: number;
  linkedAccounts: Array<{
    type: string;
    address?: string;
    email?: string;
  }>;
};

export async function getUser(): Promise<User | null> {
  try {
    const user = await getPrivyUser();
    if (!user) {
      return null;
    }

    // Extract email from linked accounts
    const emailAccount = user.linkedAccounts.find(
      (account) => account.type === "email"
    );
    const email = emailAccount?.email;

    return {
      id: user.id,
      email,
      createdAt: user.createdAt,
      linkedAccounts: user.linkedAccounts,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Handle build-time dynamic server errors gracefully
    const isDynamicServerError =
      errorMessage.includes("Dynamic server usage") ||
      errorMessage.includes("couldn't be rendered statically") ||
      errorMessage.includes("cookies");

    if (isDynamicServerError) {
      return null;
    }

    console.error("[getUser] Unexpected error:", {
      error: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    return null;
  }
}

export async function requireUser() {
  try {
    const user = await requirePrivyUser();
    return {
      id: user.id,
      email: user.linkedAccounts.find((a) => a.type === "email")?.email,
      createdAt: user.createdAt,
      linkedAccounts: user.linkedAccounts,
    };
  } catch {
    redirect("/login");
  }
}
