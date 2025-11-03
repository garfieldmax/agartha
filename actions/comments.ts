"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";

export type CommentWithAuthor = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

type CommentSubject = "user" | "community" | "residency";

export async function listComments(
  subject_type: CommentSubject,
  subject_id: string
): Promise<CommentWithAuthor[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("comments")
    .select(
      "id, author_id, body, created_at, updated_at, profiles:author_id(display_name, avatar_url)"
    )
    .eq("subject_type", subject_type)
    .eq("subject_id", subject_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function addComment(input: {
  subject_type: CommentSubject;
  subject_id: string;
  body: string;
}) {
  const supabase = supabaseServer();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.from("comments").insert({
    subject_type: input.subject_type,
    subject_id: input.subject_id,
    body: input.body,
    author_id: user.id,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
}
