import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAuthenticatedMember } from "@/lib/auth/privy";
import { isCommunityManager } from "@/lib/authz/roles";
import { deleteProject, getProject, updateProject } from "@/lib/db/repo";
import { ProjectUpdateSchema } from "@/lib/db/validators";
import { AppError, AuthorizationError, ValidationError, getStatusFromError, toErrorResponse } from "@/lib/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { memberId } = await getAuthenticatedMember(request);
    const project = await getProject(id);
    if (!project) {
      throw new AppError("Project not found", "NOT_FOUND", { projectId: id });
    }
    const payload = await request.json();
    const parsed = ProjectUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError("Invalid project payload", parsed.error.flatten());
    }
    const canManage = await isCommunityManager(memberId, project.community_id);
    if (!canManage) {
      throw new AuthorizationError("Only community managers can update projects", {
        communityId: project.community_id,
      });
    }
    const updated = await updateProject(id, parsed.data);
    revalidatePath(`/communities/${project.community_id}`);
    revalidatePath(`/projects`);
    revalidatePath(`/projects/${project.id}`);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const response = toErrorResponse(error);
    const status = getStatusFromError(error);
    return NextResponse.json(response, { status });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { memberId } = await getAuthenticatedMember(request);
    const project = await getProject(id);
    if (!project) {
      throw new AppError("Project not found", "NOT_FOUND", { projectId: id });
    }
    const canManage = await isCommunityManager(memberId, project.community_id);
    if (!canManage) {
      throw new AuthorizationError("Only community managers can delete projects", {
        communityId: project.community_id,
      });
    }
    await deleteProject(id);
    revalidatePath(`/communities/${project.community_id}`);
    revalidatePath(`/projects`);
    revalidatePath(`/projects/${project.id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const response = toErrorResponse(error);
    const status = getStatusFromError(error);
    return NextResponse.json(response, { status });
  }
}
