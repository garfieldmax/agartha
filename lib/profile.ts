import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabaseServer";

function deriveDisplayName(user: User) {
  if (typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name.trim()) {
    return user.user_metadata.display_name.trim();
  }

  if (user.email) {
    return user.email.split("@")[0] ?? "User";
  }

  return "User";
}

export async function ensureProfile(user: User) {
  const supabase = supabaseServer();

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
  const avatarUrl =
    typeof user.user_metadata?.avatar_url === "string"
      ? user.user_metadata.avatar_url
      : null;

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
