"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { OnboardingSubmissionSchema } from "@/lib/db/validators";
import { upsertOnboardingSubmission, updateMember } from "@/lib/db/repo";
import { ensureProfile } from "@/lib/profile";
import { getUser } from "@/lib/auth";

type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitOnboarding(formData: FormData): Promise<FormState | void> {
  const user = await getUser();
  if (!user) {
    redirect("/login?redirect=/onboarding");
  }

  const member = await ensureProfile(user);
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    whyJoin: formData.get("whyJoin"),
    whatCreate: formData.get("whatCreate"),
    coolFact: formData.get("coolFact"),
    links: formData.get("links"),
  };

  const parsed = OnboardingSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("Onboarding validation failed", parsed.error.flatten());
    return {
      error: "Something went wrong saving your answers. Please check the fields below and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const submission = parsed.data;

  try {
    await upsertOnboardingSubmission({
      member_id: member.id,
      name: submission.name,
      email: submission.email,
      why_join: submission.whyJoin,
      what_create: submission.whatCreate,
      cool_fact: submission.coolFact,
      links: submission.links ?? null,
    });

    await updateMember(member.id, {
      display_name: submission.name,
    });

    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/discover");

    redirect("/");
  } catch (error) {
    console.error("Failed to save onboarding submission", error);
    return {
      error: "Failed to save your submission. Please try again.",
    };
  }
}
