import type { Interest } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";

interface InterestsChipsProps {
  interests: Interest[];
}

export function InterestsChips({ interests }: InterestsChipsProps) {
  if (interests.length === 0) {
    return (
      <Card padding="sm" className="text-sm text-slate-500">
        No interests listed yet.
      </Card>
    );
  }

  return (
    <Card padding="sm" className="flex flex-wrap gap-2">
      {interests.map((interest) => (
        <span
          key={interest.id}
          className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
        >
          {interest.label}
        </span>
      ))}
    </Card>
  );
}
