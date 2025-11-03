import type { Profile } from "@/actions/users";
import { UserCard } from "@/components/users/UserCard";

export function UserList({ profiles }: { profiles: Profile[] }) {
  if (profiles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-slate-500">
        No profiles found.
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {profiles.map((profile) => (
        <li key={profile.id}>
          <UserCard profile={profile} />
        </li>
      ))}
    </ul>
  );
}
