"use client";

import type { Member } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

type ProfileCardProps = {
  member: Member;
  mutuals?: Member[];
  isSelf?: boolean;
  onGiveKudos?: () => void;
  onConnect?: () => void;
  onEdit?: () => void;
};

export function ProfileCard({
  member,
  mutuals = [],
  isSelf = false,
  onGiveKudos,
  onConnect,
  onEdit,
}: ProfileCardProps) {
  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-100">
          {member.avatar_url ? (
            <img src={member.avatar_url} alt={member.display_name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-slate-500">
              {member.display_name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{member.display_name}</h2>
          <p className="text-sm text-slate-500">Level: {member.level}</p>
          <p className="text-sm font-medium text-amber-600">⭐ {member.reputation_score}</p>
        </div>
      </div>
      {mutuals.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Mutual connections</span>
          <div className="flex -space-x-3">
            {mutuals.slice(0, 3).map((mutual) => (
              <div
                key={mutual.id}
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-slate-100"
                title={mutual.display_name}
              >
                {mutual.avatar_url ? (
                  <img src={mutual.avatar_url} alt={mutual.display_name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-500">
                    {mutual.display_name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-500">{mutuals.length} mutual</span>
        </div>
      )}
      <div className={clsx("mt-auto flex w-full flex-col gap-2", isSelf && "hidden")}>
        <Button onClick={onGiveKudos} disabled={!onGiveKudos}>
          Give Kudos
        </Button>
        <Button variant="secondary" onClick={onConnect} disabled={!onConnect}>
          Connect
        </Button>
      </div>
      {isSelf && (
        <Button variant="secondary" onClick={onEdit} disabled={!onEdit} className="w-full">
          Edit Profile
        </Button>
      )}
    </Card>
  );
}
