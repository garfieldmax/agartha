"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { submitOnboarding } from "@/actions/onboarding";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type OnboardingFormProps = {
  defaultEmail: string;
};

type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export function OnboardingForm({ defaultEmail }: OnboardingFormProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState: FormState, formData: FormData) => {
      const result = await submitOnboarding(formData);
      return result || {};
    },
    {}
  );

  // Local state to preserve form values
  const [formData, setFormData] = useState({
    name: "",
    email: defaultEmail,
    whyJoin: "",
    whatCreate: "",
    coolFact: "",
    links: "",
  });

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <>
      {state.error && (
        <Card className="border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </Card>
      )}
      <Card className="p-6">
        <form action={formAction} className="space-y-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              required
              placeholder="How should we call you?"
              value={formData.name}
              onChange={handleChange("name")}
              disabled={isPending}
            />
            {state.fieldErrors?.name && (
              <p className="text-xs text-red-600">{state.fieldErrors.name[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              disabled={isPending}
            />
            {state.fieldErrors?.email && (
              <p className="text-xs text-red-600">{state.fieldErrors.email[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="whyJoin" className="text-sm font-medium text-slate-700">
              Why do you want to join?
            </label>
            <Textarea
              id="whyJoin"
              name="whyJoin"
              required
              rows={3}
              placeholder="Let us know what drew you to Nostra Community."
              value={formData.whyJoin}
              onChange={handleChange("whyJoin")}
              disabled={isPending}
            />
            {state.fieldErrors?.whyJoin && (
              <p className="text-xs text-red-600">{state.fieldErrors.whyJoin[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="whatCreate" className="text-sm font-medium text-slate-700">
              What do you want to create?
            </label>
            <Textarea
              id="whatCreate"
              name="whatCreate"
              required
              rows={3}
              placeholder="Share a project, community, or experience you want to build."
              value={formData.whatCreate}
              onChange={handleChange("whatCreate")}
              disabled={isPending}
            />
            {state.fieldErrors?.whatCreate && (
              <p className="text-xs text-red-600">{state.fieldErrors.whatCreate[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="coolFact" className="text-sm font-medium text-slate-700">
              One cool fact about you
            </label>
            <Textarea
              id="coolFact"
              name="coolFact"
              required
              rows={3}
              placeholder="Tell us something memorable so we can introduce you properly."
              value={formData.coolFact}
              onChange={handleChange("coolFact")}
              disabled={isPending}
            />
            {state.fieldErrors?.coolFact && (
              <p className="text-xs text-red-600">{state.fieldErrors.coolFact[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="links" className="text-sm font-medium text-slate-700">
              Links (website, LinkedIn, X, Substack, etc.)
            </label>
            <Textarea
              id="links"
              name="links"
              rows={3}
              placeholder="Drop any links you want to share. Separate each link on its own line."
              value={formData.links}
              onChange={handleChange("links")}
              disabled={isPending}
            />
            {state.fieldErrors?.links && (
              <p className="text-xs text-red-600">{state.fieldErrors.links[0]}</p>
            )}
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Submitting..." : "Submit onboarding"}
            </button>
            <p className="text-xs text-slate-500">
              Need help?{" "}
              <Link href="mailto:Nostra@nostrahub.com" className="text-slate-700 underline">
                Email the team
              </Link>
              .
            </p>
          </div>
        </form>
      </Card>
    </>
  );
}

