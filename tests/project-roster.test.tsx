import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ProjectRoster } from "@/components/ProjectRoster";

const participant = (memberId: string, status: "invited" | "active") => ({
  project_id: "project-1",
  member_id: memberId,
  role: "contributor" as const,
  status,
  joined_at: new Date().toISOString(),
  left_at: null,
  member: {
    id: memberId,
    display_name: `Member ${memberId}`,
    avatar_url: null,
    level: "resident" as const,
    bio: null,
    reputation_score: 0,
    created_at: "",
    updated_at: "",
  },
});

describe("ProjectRoster", () => {
  it("renders approval controls for pending members", () => {
    const markup = renderToStaticMarkup(
      <ProjectRoster
        participants={[participant("1", "active"), participant("2", "invited")]}
        canApprove
        approvingMemberId={null}
      />
    );
    expect(markup).toMatchSnapshot();
  });
});
