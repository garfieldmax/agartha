import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedMember } from "@/lib/auth/privy";
import { ProjectJoinSchema } from "@/lib/db/validators";
import { upsertProjectParticipation } from "@/lib/db/repo";
import { toErrorResponse, ValidationError } from "@/lib/errors";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { memberId } = await getAuthenticatedMember(request);
    const json = await request.json();
    const parsed = ProjectJoinSchema.safeParse({ ...json, project_id: params.id });
    if (!parsed.success) {
      throw new ValidationError("Invalid join payload", parsed.error.flatten());
    }
    const participation = await upsertProjectParticipation({
      project_id: parsed.data.project_id,
      member_id: memberId,
      role: parsed.data.role,
      status: parsed.data.status,
    });
    revalidatePath(`/projects/${params.id}`);
    return NextResponse.json({ ok: true, data: participation });
  } catch (error) {
    const response = toErrorResponse(error);
    const status = response.error.code === "VALIDATION_FAILED" ? 400 : response.error.code === "UNAUTHENTICATED" ? 401 : 500;
    return NextResponse.json(response, { status });
  }
}
