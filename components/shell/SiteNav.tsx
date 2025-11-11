"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type SiteNavProps = {
  canSeeMembers: boolean;
};

function resolveActive(pathname: string, searchParams: ReturnType<typeof useSearchParams>) {
  if (pathname.startsWith("/projects")) {
    return "projects" as const;
  }
  if (pathname.startsWith("/members") || pathname.startsWith("/discover")) {
    return "members" as const;
  }
  if (pathname.startsWith("/communities")) {
    return "communities" as const;
  }

  if (pathname === "/") {
    const tab = searchParams.get("tab");
    if (tab === "members") {
      return "members" as const;
    }
    return "communities" as const;
  }

  return null;
}

export function SiteNav({ canSeeMembers }: SiteNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = resolveActive(pathname, searchParams);

  return (
    <nav className="flex items-center gap-2 text-sm font-medium">
      <Link
        href="/?tab=communities"
        title="Join communities to collaborate on shared goals"
        className={clsx(
          "rounded-full px-3 py-1 transition",
          active === "communities" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
        )}
      >
        Communities
      </Link>
      {canSeeMembers && (
        <Link
          href="/projects"
          title="Contribute your skills to meaningful projects"
          className={clsx(
            "rounded-full px-3 py-1 transition",
            active === "projects" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          Projects
        </Link>
      )}
      {canSeeMembers && (
        <Link
          href="/?tab=members"
          title="Find like-minded people with shared interests and goals"
          className={clsx(
            "rounded-full px-3 py-1 transition",
            active === "members" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          Members
        </Link>
      )}
    </nav>
  );
}
