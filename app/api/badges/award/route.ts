import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedMember } from "@/lib/auth/privy";
import { BadgeAwardSchema } from "@/lib/db/validators";
import { awardBadge } from "@/lib/db/repo";
import { assertCanAwardBadge } from "@/lib/authz/roles";
import { toErrorResponse, ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const { memberId } = await getAuthenticatedMember(request);
    const json = await request.json();
    const parsed = BadgeAwardSchema.safeParse(json);
    if (!parsed.success) {
      throw new ValidationError("Invalid badge payload", parsed.error.flatten());
    }
    await assertCanAwardBadge({
      issuerId: memberId,
      communityId: parsed.data.context?.community_id,
      projectId: parsed.data.context?.project_id,
    });
    const record = await awardBadge({
      member_id: parsed.data.member_id,
      badge_id: parsed.data.badge_id,
      awarded_by: memberId,
      note: parsed.data.note,
    });
    revalidatePath(`/members/${parsed.data.member_id}`);
    return NextResponse.json({ ok: true, data: record });
  } catch (error) {
    const response = toErrorResponse(error);
    const status =
      response.error.code === "VALIDATION_FAILED"
        ? 400
        : response.error.code === "FORBIDDEN"
        ? 403
        : response.error.code === "UNAUTHENTICATED"
        ? 401
        : 500;
    return NextResponse.json(response, { status });
  }
}
