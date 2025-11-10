import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { listActiveParticipationsForMember } from "@/lib/db/repo";
import { requireOnboardedMember } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function ProjectsIndexPage() {
  const { member } = await requireOnboardedMember();
  if (!member) {
    return null;
  }
  const participations = await listActiveParticipationsForMember(member.id);
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-900">Your projects</h1>
        <p className="text-sm text-slate-600">
          Projects where you are an active member across the Nostra community.
        </p>
      </header>
      {participations.length === 0 ? (
        <Card padding="sm" className="text-sm text-slate-500">
          You are not part of any projects yet. Join a community project to get started.
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {participations.map((participation) => (
            <Link key={participation.project_id} href={`/projects/${participation.project_id}`}>
              <Card className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    {participation.project?.name ?? "Untitled project"}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">{participation.role}</span>
                </div>
                {participation.project?.description && (
                  <p className="text-sm text-slate-600">{participation.project.description}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
