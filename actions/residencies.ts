"use server";

import { supabaseServer } from "@/lib/supabaseServer";

export type Residency = {
  id: string;
  community_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export async function listResidenciesByCommunity(
  communityId: string
): Promise<Residency[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("residencies")
    .select("id, community_id, name, description, created_at, updated_at")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
