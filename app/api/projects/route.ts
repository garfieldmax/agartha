import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getAuthenticatedMember } from "@/lib/auth/privy";
import { isCommunityManager } from "@/lib/authz/roles";
import { createProject } from "@/lib/db/repo";
import { ProjectCreateSchema } from "@/lib/db/validators";
import { AuthorizationError, ValidationError, getStatusFromError, toErrorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const { memberId } = await getAuthenticatedMember(request);
    const payload = await request.json();
    const parsed = ProjectCreateSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError("Invalid project payload", parsed.error.flatten());
    }
    const canManage = await isCommunityManager(memberId, parsed.data.community_id);
    if (!canManage) {
      throw new AuthorizationError("Only community managers can create projects", {
        communityId: parsed.data.community_id,
      });
    }
    const project = await createProject({
      community_id: parsed.data.community_id,
      residency_id: parsed.data.residency_id ?? null,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      created_by: memberId,
    });
    revalidatePath(`/communities/${project.community_id}`);
    revalidatePath(`/projects`);
    revalidatePath(`/projects/${project.id}`);
    return NextResponse.json({ ok: true, data: project });
  } catch (error) {
    const response = toErrorResponse(error);
    const status = getStatusFromError(error);
    return NextResponse.json(response, { status });
  }
}
