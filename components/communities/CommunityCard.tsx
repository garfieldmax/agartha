import type { Community } from "@/actions/communities";
import { listResidenciesByCommunity } from "@/actions/residencies";
import { EntityComments } from "@/components/communities/EntityComments";
import { ResidencyList } from "@/components/communities/ResidencyList";

export async function CommunityCard({ community }: { community: Community }) {
  const residencies = await listResidenciesByCommunity(community.id);

  return (
    <details className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <summary className="cursor-pointer select-none bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900">
              {community.name}
            </div>
            {community.description && (
              <p className="text-xs text-slate-500">{community.description}</p>
            )}
          </div>
          <span className="text-xs text-slate-500">Open</span>
        </div>
      </summary>
      <div className="space-y-5 px-4 py-4 text-sm">
        <div className="grid gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Community
          </div>
          <div className="text-slate-700">ID: {community.id}</div>
          <div className="text-slate-700">
            Created {new Date(community.created_at).toLocaleString()}
          </div>
        </div>
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Community comments</h3>
          <EntityComments subjectId={community.id} subjectType="community" />
        </section>
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Residencies</h3>
          <ResidencyList residencies={residencies} />
        </section>
      </div>
    </details>
  );
}
