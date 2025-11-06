import { DesktopTabs } from "@/components/shell/Tabs";
import { UserMenu } from "@/components/shell/UserMenu";

type TopBarProps = {
  user: {
    email?: string | null;
    displayName?: string | null;
  };
};

export function TopBar({ user }: TopBarProps) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">Agartha</span>
        </div>
        <DesktopTabs className="hidden md:flex" />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
