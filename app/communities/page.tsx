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
        <h1 className="text-3xl font-semibold text-slate-900">Find Your People. Grow Together.</h1>
        <p className="text-base text-slate-700">
          Join communities where you can meet kindred spirits, share what you&apos;re into, and grow through projects, conversations, and shared wins.
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
