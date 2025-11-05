import type { ReactNode } from "react";

import { getUser } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile";

// Mark dashboard routes as dynamic since they use cookies for authentication
export const dynamic = 'force-dynamic';

export default async function DashboardGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getUser();

  if (user) {
    try {
      await ensureProfile(user);
    } catch {
      // Ignore profile provisioning issues when running in demo mode without Supabase auth
    }
  }

  return <>{children}</>;
}
