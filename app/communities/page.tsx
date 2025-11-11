import { CommunitySearchList } from "@/components/communities/CommunitySearchList";
import { listCommunities } from "@/lib/db/repo";

export const dynamic = "force-dynamic";

type CommunitiesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CommunitiesPage({ searchParams }: CommunitiesPageProps) {
  const params = await searchParams;
  const searchParam = Array.isArray(params?.q) ? params?.q[0] : params?.q;
  const query = typeof searchParam === "string" ? searchParam : "";
  const communities = await listCommunities({ search: query });
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Communities</h1>
        <p className="text-base text-slate-700">
          Join hubs where like-minded people unite to work on projects and achieve shared goals.
        </p>
        <p className="text-sm text-slate-600">
          Each community offers residencies, collaborative projects, and opportunities to connect with people who share your interests.
        </p>
      </div>
      <div className="mt-6">
        <CommunitySearchList
          communities={communities}
          searchQuery={query}
          formAction="/communities"
          clearHref="/communities"
        />
      </div>
    </div>
  );
}
