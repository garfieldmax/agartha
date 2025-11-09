import { redirect } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { getOnboardingStatus } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { user, submission } = await getOnboardingStatus();
  if (!user) {
    redirect("/login?redirect=/onboarding");
  }
  if (submission) {
    redirect("/");
  }

  const email = user.email ?? "";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Tell us about you</h1>
        <p className="text-sm text-slate-600">
          Share a few details so the Nostra Community team can welcome you and match you with the right communities.
        </p>
      </div>
      <OnboardingForm defaultEmail={email} />
    </div>
  );
}
