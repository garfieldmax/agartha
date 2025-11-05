import type { ReactNode } from "react";
import { MobileTabs } from "@/components/shell/Tabs";
import { TopBar } from "@/components/shell/TopBar";
import { getUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabaseServer";
import { DEMO_USER } from "@/lib/demo-data";

// Mark dashboard routes as dynamic since they use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function DashboardShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getUser();
  let displayName: string | null = null;
  let email = user?.email ?? null;

  if (user) {
    try {
      const supabase = await supabaseServer();
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      displayName = profile?.display_name ?? null;
      if (!displayName && typeof user.user_metadata?.display_name === "string") {
        displayName = user.user_metadata.display_name;
      }
    } catch {
      if (typeof user.user_metadata?.display_name === "string") {
        displayName = user.user_metadata.display_name;
      }
    }
  } else {
    displayName = DEMO_USER.user_metadata.display_name;
    email = DEMO_USER.email;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-100">
      <TopBar user={{ email, displayName }} />
      {!user && (
        <div className="border-b border-dashed bg-amber-50 text-amber-900">
          <div className="mx-auto w-full max-w-6xl px-4 py-2 text-sm">
            Demo mode: connect Supabase auth to enable sign-in and live data.
          </div>
        </div>
      )}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">{children}</div>
      </main>
      <MobileTabs className="sticky bottom-0" />
    </div>
  );
}
