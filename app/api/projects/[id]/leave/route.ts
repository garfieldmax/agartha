import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedMember } from "@/lib/auth/privy";
import { leaveProject } from "@/lib/db/repo";
import { toErrorResponse } from "@/lib/errors";

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { memberId } = await getAuthenticatedMember(request);
    await leaveProject(params.id, memberId);
    revalidatePath(`/projects/${params.id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const response = toErrorResponse(error);
    const status = response.error.code === "UNAUTHENTICATED" ? 401 : 500;
    return NextResponse.json(response, { status });
  }
}
