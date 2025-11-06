import type { MemberBadge } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";

interface BadgesListProps {
  badges: MemberBadge[];
}

export function BadgesList({ badges }: BadgesListProps) {
  if (badges.length === 0) {
    return (
      <Card padding="sm" className="text-sm text-slate-500">
        No badges earned yet.
      </Card>
    );
  }

  return (
    <Card padding="sm" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {badges.map((memberBadge) => (
        <div key={`${memberBadge.member_id}-${memberBadge.badge_id}`} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 p-2">
            {memberBadge.badge?.icon_url ? (
              <img src={memberBadge.badge.icon_url} alt={memberBadge.badge.name} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                {memberBadge.badge?.slug.toUpperCase().slice(0, 2)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{memberBadge.badge?.name}</span>
            <span className="text-xs text-slate-500">{memberBadge.badge?.rarity}</span>
          </div>
        </div>
      ))}
    </Card>
  );
}
