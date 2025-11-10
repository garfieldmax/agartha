import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAuthenticatedMember } from "@/lib/auth/privy";
import { isCommunityManager, isProjectLead } from "@/lib/authz/roles";
import { getProject, listProjectParticipants, setProjectParticipationStatus } from "@/lib/db/repo";
import { AppError, AuthorizationError, getStatusFromError, toErrorResponse } from "@/lib/errors";

interface RouteParams {
  params: Promise<{ id: string; memberId: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id, memberId: participantId } = await params;
    const { memberId } = await getAuthenticatedMember(request);
    const project = await getProject(id);
    if (!project) {
      throw new AppError("Project not found", "NOT_FOUND", { projectId: id });
    }
    const [canManage, canLead, participants] = await Promise.all([
      isCommunityManager(memberId, project.community_id),
      isProjectLead(memberId, project.id),
      listProjectParticipants(project.id),
    ]);
    if (!canManage && !canLead) {
      throw new AuthorizationError("Only community managers or project leads can approve members", {
        projectId: id,
      });
    }
    const participant = participants.find((item) => item.member_id === participantId);
    if (!participant) {
      throw new AppError("Participation not found", "NOT_FOUND", {
        projectId: id,
        memberId: participantId,
      });
    }
    if (participant.status === "active") {
      return NextResponse.json({ ok: true, data: participant });
    }
    const updated = await setProjectParticipationStatus(id, participantId, "active");
    revalidatePath(`/projects/${id}`);
    revalidatePath(`/projects`);
    revalidatePath(`/communities/${project.community_id}`);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const response = toErrorResponse(error);
    const status = getStatusFromError(error);
    return NextResponse.json(response, { status });
  }
}
