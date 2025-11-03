import type { Community } from "@/actions/communities";
import { CommunityCard } from "@/components/communities/CommunityCard";

export function CommunityList({ communities }: { communities: Community[] }) {
  if (communities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-slate-500">
        No communities available.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {communities.map((community) => (
        <li key={community.id}>
          <CommunityCard community={community} />
        </li>
      ))}
    </ul>
  );
}
