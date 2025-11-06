import { countActiveParticipations, countDailyKudosSent } from "@/lib/db/repo";
import { BudgetExceededError } from "@/lib/errors";

function normalizeDate(date: Date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export async function getDailyBudget(memberId: string, date: Date): Promise<number> {
  return countActiveParticipations(memberId, date);
}

export async function getUsedToday(memberId: string, date: Date): Promise<number> {
  const { start, end } = normalizeDate(date);
  return countDailyKudosSent(memberId, start.toISOString(), end.toISOString());
}

export async function canSendKudos(memberId: string, date: Date): Promise<boolean> {
  const [budget, used] = await Promise.all([
    getDailyBudget(memberId, date),
    getUsedToday(memberId, date),
  ]);
  if (budget === 0) {
    return false;
  }
  return used < budget;
}

export async function assertKudosBudget(memberId: string, date: Date) {
  const allowed = await canSendKudos(memberId, date);
  if (!allowed) {
    throw new BudgetExceededError({ memberId });
  }
}
