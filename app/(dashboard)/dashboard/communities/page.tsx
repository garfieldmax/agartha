import { listCommunities } from "@/actions/communities";
import { CommunityList } from "@/components/communities/CommunityList";

export default async function CommunitiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? "";
  const communities = await listCommunities(query ? query : undefined);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Communities</h1>
        <p className="text-sm text-slate-600">
          Track communities, residencies, and the conversations around them.
        </p>
      </header>
      <form className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search communities"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          Search
        </button>
      </form>
      <CommunityList communities={communities} />
    </div>
  );
}
