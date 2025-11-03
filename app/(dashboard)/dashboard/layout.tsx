import type { ReactNode } from "react";
import { MobileTabs } from "@/components/shell/Tabs";
import { TopBar } from "@/components/shell/TopBar";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function DashboardShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();
  const supabase = supabaseServer();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="flex min-h-dvh flex-col bg-slate-100">
      <TopBar user={{ email: user.email, displayName: profile?.display_name ?? null }} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">{children}</div>
      </main>
      <MobileTabs className="sticky bottom-0" />
    </div>
  );
}
