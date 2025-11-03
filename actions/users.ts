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
    const supabase = supabaseServer();
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
      throw error;
    }

    return data ?? [];
  } catch {
    return fallback();
  }
}

export async function upsertProfile(input: {
  id: string;
  display_name: string;
  level?: string;
}) {
  const supabase = supabaseServer();
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
