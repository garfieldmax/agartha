import { headers } from "next/headers";
import { listMembers, listMemberInterests } from "@/lib/db/repo";
import { getMutuals } from "@/lib/social/mutuals";
import { DiscoveryList, type DiscoveryItem } from "@/components/DiscoveryList";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const headerList = await headers();
  const viewerId = headerList.get("x-member-id");
  const members = await listMembers();

  let viewerInterests = [] as string[];
  if (viewerId) {
    viewerInterests = (await listMemberInterests(viewerId)).map((interest) => interest.id);
  }

  const mutualItems: DiscoveryItem[] = [];
  const sharedItems: DiscoveryItem[] = [];

  for (const member of members) {
    if (viewerId && member.id !== viewerId) {
      const mutuals = await getMutuals(viewerId, member.id);
      if (mutuals.length > 0) {
        mutualItems.push({ member, mutuals });
      }
      if (viewerInterests.length > 0) {
        const memberInterests = (await listMemberInterests(member.id)).map((interest) => interest.id);
        const overlap = memberInterests.filter((id) => viewerInterests.includes(id));
        if (overlap.length > 0) {
          sharedItems.push({ member, mutuals: [] });
        }
      }
    }
  }

  const trendingItems: DiscoveryItem[] = members
    .filter((member) => (viewerId ? member.id !== viewerId : true))
    .slice(0, 6)
    .map((member) => ({ member }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Discover Members</h1>
      <p className="text-sm text-slate-600">Find new collaborators by mutual connections and shared interests.</p>
      <div className="mt-6">
        <DiscoveryList mutuals={mutualItems} sharedInterests={sharedItems} trending={trendingItems} />
      </div>
    </div>
  );
}
