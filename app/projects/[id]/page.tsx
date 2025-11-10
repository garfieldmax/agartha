import { notFound } from "next/navigation";
import { getProject, listProjectParticipants, listComments, listResidencies } from "@/lib/db/repo";
import { ProjectPageShell } from "@/components/ProjectPageShell";
import { requireOnboardedMember } from "@/lib/onboarding";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { member } = await requireOnboardedMember();
  const { id } = await params;
  const project = await getProject(id);
  if (!project) {
    notFound();
  }
  const [participants, comments, residencies] = await Promise.all([
    listProjectParticipants(project.id),
    listComments("project", project.id),
    listResidencies(project.community_id),
  ]);
  const viewerId = member?.id ?? null;
  const viewerParticipation = viewerId
    ? participants.find((participant) => participant.member_id === viewerId)
    : null;
  const canEditProject = member?.level === "manager";
  const canApproveParticipants = Boolean(
    canEditProject ||
      (viewerParticipation && viewerParticipation.role === "lead" && viewerParticipation.status === "active")
  );
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <ProjectPageShell
        viewerId={viewerId}
        project={project}
        participants={participants}
        comments={comments}
        residencies={residencies}
        canEditProject={Boolean(canEditProject)}
        canApproveParticipants={canApproveParticipants}
      />
    </div>
  );
}
