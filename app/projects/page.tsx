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
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Your Projects</h1>
        <p className="text-base text-slate-700">
          Bring your skills to meaningful projects and make an impact in your communities.
        </p>
        <p className="text-sm text-slate-600">
          Track your active participations, contribute to shared goals, and earn recognition from peers.
        </p>
      </header>
      {participations.length === 0 ? (
        <Card padding="sm" className="space-y-3 p-6">
          <p className="text-sm text-slate-700 font-medium">
            You&apos;re not part of any projects yet.
          </p>
          <p className="text-sm text-slate-600">
            Browse communities to discover projects where you can contribute your skills and collaborate with like-minded people.
          </p>
          <Link 
            href="/?tab=communities"
            className="inline-block mt-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Explore Communities
          </Link>
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
