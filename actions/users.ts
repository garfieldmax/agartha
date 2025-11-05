"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import { DEMO_PROFILES } from "@/lib/demo-data";

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  level: string;
  created_at: string;
  updated_at: string;
};

export async function listProfiles(search?: string): Promise<Profile[]> {
  const fallback = () => {
    if (!search) {
      return DEMO_PROFILES;
    }

    const normalized = search.toLowerCase();
    return DEMO_PROFILES.filter((profile) =>
      profile.display_name.toLowerCase().includes(normalized)
    );
  };

  try {
    console.log("[listProfiles] Attempting Supabase query", { search });
    const supabase = await supabaseServer();
    let query = supabase
      .from("profiles")
      .select("id, display_name, avatar_url, level, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search) {
      query = query.ilike("display_name", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[listProfiles] Supabase query error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    console.log("[listProfiles] Query successful, returned", data?.length ?? 0, "profiles");
    return data ?? [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError =
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("getaddrinfo") ||
      errorMessage.includes("timeout");

    console.error("[listProfiles] Exception caught:", {
      error: errorMessage,
      isNetworkError,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (isNetworkError) {
      console.error("[listProfiles] ⚠️ Network/DNS error detected - falling back to demo data");
    }

    return fallback();
  }
}

export async function upsertProfile(input: {
  id: string;
  display_name: string;
  level?: string;
}) {
  const supabase = await supabaseServer();
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: input.id,
      display_name: input.display_name,
      level: input.level,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard/users");
}
