import type { ReactNode } from "react";

import { requireUser } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile";

export default async function DashboardGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await requireUser();
  await ensureProfile(user);

  return <>{children}</>;
}
