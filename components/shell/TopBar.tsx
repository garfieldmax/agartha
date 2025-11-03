import { DesktopTabs } from "@/components/shell/Tabs";

type TopBarProps = {
  user: {
    email?: string | null;
    displayName?: string | null;
  };
};

export function TopBar({ user }: TopBarProps) {
  const label = user.displayName ?? user.email ?? "Unknown";
  const initial = label?.slice(0, 1).toUpperCase() ?? "?";

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">Agartha</span>
        </div>
        <DesktopTabs className="hidden md:flex" />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-600 sm:block">{label}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {initial}
          </span>
        </div>
      </div>
    </header>
  );
}
