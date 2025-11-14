import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { CommunitySearchList } from "@/components/communities/CommunitySearchList";
import { listMembers, listCommunities } from "@/lib/db/repo";
import { getOnboardingStatus } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const { user } = await getOnboardingStatus();

  const canSeeMembers = Boolean(user);
  const tabParam = Array.isArray(params?.tab) ? params?.tab[0] : params?.tab;
  const requestedTab = tabParam === "members" ? "members" : "communities";
  const tab = canSeeMembers ? requestedTab : "communities";
  const searchParam = Array.isArray(params?.q) ? params?.q[0] : params?.q;
  const communitySearch = tab === "communities" && typeof searchParam === "string" ? searchParam : "";

  const communities = await listCommunities({ search: communitySearch });
  const members = tab === "members" ? await listMembers() : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      {/* Enhanced Hero Section */}
      {tab === "members" ? (
        <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Find people you&apos;d love to build with, think with, and just hang out with.
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl">
            Explore profiles to feel their vibe—what they care about, how they show up, and how others value them.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <h3 className="font-semibold text-slate-900">Interests &amp; Goals</h3>
              </div>
              <p className="text-sm text-slate-600">
                See what members are into and where they want to go, so you can spot shared directions before reaching out.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛠️</span>
                <h3 className="font-semibold text-slate-900">Skills &amp; Availability</h3>
              </div>
              <p className="text-sm text-slate-600">
                Understand what each person is great at and how they like to collaborate—so you can find a rhythm that works for both of you.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <h3 className="font-semibold text-slate-900">Attestations &amp; Kudos</h3>
              </div>
              <p className="text-sm text-slate-600">
                Browse recognition from communities and teammates to quickly sense who&apos;s worked with them, and how it felt.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/discover"
              className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse discovery
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 p-8 md:p-10">
          <h1 className="text-4xl font-bold text-slate-900">
            Find Your People. Grow Together.
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl">
            Join communities where you can meet kindred spirits, share what you&apos;re into, and grow through projects, conversations, and shared wins.
          </p>

          {/* Value Pillars */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <h3 className="font-semibold text-slate-900">What You Seek</h3>
              </div>
              <p className="text-sm text-slate-600">
                Share what you&apos;re curious about, what you&apos;re working on, and the kind of people you&apos;d love to meet—so the right communities can find you.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <h3 className="font-semibold text-slate-900">What You Bring</h3>
              </div>
              <p className="text-sm text-slate-600">
                Show the skills, experience, and quirks that make you you, and put them to work in projects, jams, and collaborations that actually matter to you.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <h3 className="font-semibold text-slate-900">Recognition</h3>
              </div>
              <p className="text-sm text-slate-600">
                Receive badges, kudos, and thank-yous from people who&apos;ve seen you show up—so your reputation reflects the real relationships you build.
              </p>
            </div>
          </div>

          {!user && (
            <div className="mt-4">
              <Link
                href="/login"
                className="inline-block rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab-specific content with improved descriptions */}
      {tab === "members" ? (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Discover Members</h2>
            <p className="text-sm text-slate-600 mt-1">
              Connect with like-minded people. Explore their interests, goals, and skills.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <Link key={member.id} href={`/members/${encodeURIComponent(member.id)}`}>
                <Card className="space-y-3 p-6 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                      {member.avatar_url ? (
                        <Image src={member.avatar_url} alt={member.display_name} width={48} height={48} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                          {member.display_name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{member.display_name}</h3>
                      <p className="text-xs text-slate-500">Level: {member.level}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-amber-600">⭐ {member.reputation_score} reputation</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Explore Communities</h2>
            <p className="text-sm text-slate-600 mt-1">
              Join hubs where like-minded people unite to work on meaningful projects together.
            </p>
          </div>
          <CommunitySearchList
            communities={communities}
            searchQuery={communitySearch}
            formAction="/"
            clearHref="/?tab=communities"
            hiddenFields={[{ name: "tab", value: "communities" }]}
          />
        </div>
      )}
    </div>
  );
}
