"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TabsProps = {
  className?: string;
};

type RouteConfig = {
  href: string;
  label: string;
};

const routes: RouteConfig[] = [
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/communities", label: "Communities" },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard/users") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/users");
  }
  return pathname.startsWith(href);
}

function TabLink({ href, label, pathname }: RouteConfig & { pathname: string }) {
  const active = isActive(href, pathname);
  return (
    <Link
      href={href}
      className={clsx(
        "rounded-md px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-slate-900 text-white shadow"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {label}
    </Link>
  );
}

export function DesktopTabs({ className }: TabsProps) {
  const pathname = usePathname();
  return (
    <nav className={clsx("items-center gap-2", className)}>
      {routes.map((route) => (
        <TabLink key={route.href} pathname={pathname} {...route} />
      ))}
    </nav>
  );
}

export function MobileTabs({ className }: TabsProps) {
  const pathname = usePathname();
  return (
    <nav className={clsx("md:hidden border-t bg-white", className)}>
      <ul className="grid grid-cols-2">
        {routes.map((route) => {
          const active = isActive(route.href, pathname);
          return (
            <li key={route.href}>
              <Link
                href={route.href}
                className={clsx(
                  "block p-3 text-center text-sm font-medium",
                  active ? "text-slate-900" : "text-slate-500"
                )}
              >
                {route.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
