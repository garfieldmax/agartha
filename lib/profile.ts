import type { User } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabaseServer";

function deriveDisplayName(user: User) {
  if (user.email) {
    return user.email.split("@")[0] ?? "User";
  }

  // Try to get name from wallet address if available
  const walletAccount = user.linkedAccounts.find(
    (account) => account.type === "wallet"
  );
  if (walletAccount?.address) {
    return `${walletAccount.address.slice(0, 6)}...${walletAccount.address.slice(-4)}`;
  }

  return "User";
}

export async function ensureProfile(user: User) {
  const supabase = await supabaseServer();

  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existing) {
    return existing;
  }

  const displayName = deriveDisplayName(user);
  const avatarUrl = null; // Privy doesn't provide avatar_url in the same way

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      display_name: displayName,
      avatar_url: avatarUrl,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
