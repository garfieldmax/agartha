import { describe, it, expect, vi, beforeEach } from "vitest";
import { assertCanAwardBadge, isCommunityManager, isProjectLead } from "@/lib/authz/roles";
import * as repo from "@/lib/db/repo";

vi.mock("@/lib/db/repo", () => ({
  getMember: vi.fn(),
  listProjectParticipants: vi.fn(),
}));

describe("authorization roles", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("treats managers as community managers", async () => {
    (repo as any).getMember.mockResolvedValue({ level: "manager" });
    expect(await isCommunityManager("issuer", "community")).toBe(true);
  });

  it("identifies project leads", async () => {
    (repo as any).listProjectParticipants.mockResolvedValue([
      { member_id: "issuer", role: "lead", status: "active" },
    ]);
    expect(await isProjectLead("issuer", "project")).toBe(true);
  });

  it("allows badge award for project lead", async () => {
    (repo as any).getMember.mockResolvedValue({ level: "guest" });
    (repo as any).listProjectParticipants.mockResolvedValue([
      { member_id: "issuer", role: "lead", status: "active" },
    ]);
    await expect(
      assertCanAwardBadge({ issuerId: "issuer", projectId: "project" })
    ).resolves.not.toThrow();
  });

  it("throws when issuer not authorized", async () => {
    (repo as any).getMember.mockResolvedValue({ level: "guest" });
    (repo as any).listProjectParticipants.mockResolvedValue([]);
    await expect(
      assertCanAwardBadge({ issuerId: "issuer", communityId: "community" })
    ).rejects.toThrowError();
  });
});
