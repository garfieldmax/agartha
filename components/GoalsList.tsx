import type { MemberGoal } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { clsx } from "clsx";

interface GoalsListProps {
  goals: MemberGoal[];
  showPrivate?: boolean;
}

export function GoalsList({ goals, showPrivate = false }: GoalsListProps) {
  const filtered = showPrivate ? goals : goals.filter((goal) => goal.privacy !== "private");

  if (filtered.length === 0) {
    return (
      <Card padding="sm" className="text-sm text-slate-500">
        No goals to display.
      </Card>
    );
  }

  return (
    <Card padding="sm" className="space-y-4">
      {filtered.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">{goal.title}</h3>
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                goal.privacy === "private"
                  ? "bg-slate-200 text-slate-600"
                  : "bg-green-100 text-green-700"
              )}
            >
              {goal.privacy === "private" ? "Private" : "Public"}
            </span>
          </div>
          {goal.details && <p className="text-sm text-slate-600">{goal.details}</p>}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Status: {goal.status}</span>
            {goal.target_date && <span>Target: {goal.target_date}</span>}
          </div>
        </div>
      ))}
    </Card>
  );
}
