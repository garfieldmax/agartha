import Link from "next/link";
import { listCommunities } from "@/lib/db/repo";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function CommunitiesPage() {
  const communities = await listCommunities();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-slate-900">Communities</h1>
      <p className="text-sm text-slate-600">Browse the Agartha communities and find your next residency or project.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {communities.map((community) => (
          <Link key={community.id} href={`/communities/${community.id}`}>
            <Card className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">{community.name}</h2>
              {community.description && <p className="text-sm text-slate-600">{community.description}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
