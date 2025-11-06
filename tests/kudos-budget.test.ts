import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDailyBudget, getUsedToday, canSendKudos, assertKudosBudget } from "@/lib/kudos/budget";
import { BudgetExceededError } from "@/lib/errors";
import * as repo from "@/lib/db/repo";

vi.mock("@/lib/db/repo", () => ({
  countActiveParticipations: vi.fn(),
  countDailyKudosSent: vi.fn(),
}));

describe("kudos budget", () => {
  const memberId = "member-1";
  const today = new Date("2024-01-01T12:00:00Z");

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the number of active participations as budget", async () => {
    (repo as any).countActiveParticipations.mockResolvedValue(3);
    const budget = await getDailyBudget(memberId, today);
    expect((repo as any).countActiveParticipations).toHaveBeenCalledWith(memberId, today);
    expect(budget).toBe(3);
  });

  it("returns used kudos for the day", async () => {
    (repo as any).countDailyKudosSent.mockResolvedValue(2);
    const used = await getUsedToday(memberId, today);
    expect((repo as any).countDailyKudosSent).toHaveBeenCalled();
    expect(used).toBe(2);
  });

  it("allows sending kudos when usage below budget", async () => {
    (repo as any).countActiveParticipations.mockResolvedValue(2);
    (repo as any).countDailyKudosSent.mockResolvedValue(1);
    await expect(canSendKudos(memberId, today)).resolves.toBe(true);
  });

  it("blocks kudos when usage meets budget", async () => {
    (repo as any).countActiveParticipations.mockResolvedValue(1);
    (repo as any).countDailyKudosSent.mockResolvedValue(1);
    await expect(canSendKudos(memberId, today)).resolves.toBe(false);
    await expect(assertKudosBudget(memberId, today)).rejects.toBeInstanceOf(BudgetExceededError);
  });
});
