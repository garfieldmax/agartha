import type { Profile } from "@/actions/users";
import { UserComments } from "@/components/users/UserComments";

export function UserCard({ profile }: { profile: Profile }) {
  return (
    <details className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <summary className="cursor-pointer select-none bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">
              {profile.display_name}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              {profile.level}
            </div>
          </div>
          <span className="text-xs text-slate-500">Open</span>
        </div>
      </summary>
      <div className="space-y-4 px-4 py-4 text-sm">
        <div className="grid gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Profile
          </div>
          <div className="text-slate-700">ID: {profile.id}</div>
          <div className="text-slate-700">
            Created {new Date(profile.created_at).toLocaleString()}
          </div>
        </div>
        <UserComments userId={profile.id} />
      </div>
    </details>
  );
}
