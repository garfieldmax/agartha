"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Residency } from "@/actions/residencies";
import { DEMO_COMMUNITIES, DEMO_RESIDENCIES } from "@/lib/demo-data";

export type Community = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export async function listCommunities(search?: string): Promise<Community[]> {
  const fallback = () => {
    if (!search) {
      return DEMO_COMMUNITIES;
    }

    const normalized = search.toLowerCase();
    return DEMO_COMMUNITIES.filter((community) =>
      community.name.toLowerCase().includes(normalized)
    );
  };

  try {
    const supabase = supabaseServer();
    let query = supabase
      .from("communities")
      .select("id, name, description, created_at, updated_at, created_by")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search) {
      query = query.ilike("name", `%${search}%`);
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

export async function getCommunityWithResidencies(id: string) {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("communities")
      .select(
        "id, name, description, created_at, updated_at, created_by, residencies(id, name, description, created_at, updated_at)"
      )
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      community: {
        id: data.id,
        name: data.name,
        description: data.description,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.created_by,
      } satisfies Community,
      residencies: (data.residencies ?? []) as Residency[],
    };
  } catch {
    const community = DEMO_COMMUNITIES.find((item) => item.id === id);
    if (!community) {
      return null;
    }

    return {
      community,
      residencies: DEMO_RESIDENCIES.filter((residency) => residency.community_id === id),
    };
  }
}

export async function upsertCommunity(input: {
  id?: string;
  name: string;
  description?: string | null;
}) {
  const supabase = supabaseServer();
  const payload = {
    id: input.id,
    name: input.name,
    description: input.description,
  };

  const { error } = await supabase
    .from("communities")
    .upsert(payload, { onConflict: "id" })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard/communities");
}
