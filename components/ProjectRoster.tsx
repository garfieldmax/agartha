import type { Member, ProjectParticipation } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ParticipantWithMember extends ProjectParticipation {
  member?: Member | null;
}

interface ProjectRosterProps {
  participants: ParticipantWithMember[];
  canApprove?: boolean;
  onApprove?: (memberId: string) => void | Promise<void>;
  approvingMemberId?: string | null;
}

export function ProjectRoster({ participants, canApprove = false, onApprove, approvingMemberId }: ProjectRosterProps) {
  if (participants.length === 0) {
    return (
      <Card padding="sm" className="text-sm text-slate-500">
        No participants yet.
      </Card>
    );
  }

  return (
    <Card padding="sm" className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {participants.map((participant) => (
        <div key={`${participant.project_id}-${participant.member_id}`} className="flex items-center justify-between gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100">
            {participant.member?.avatar_url ? (
              <img
                src={participant.member.avatar_url}
                alt={participant.member.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                {participant.member?.display_name?.slice(0, 1).toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {participant.member?.display_name ?? participant.member_id}
            </span>
            <span className="text-xs text-slate-500">Role: {participant.role}</span>
            <span className="text-xs text-slate-500">
              Status: {participant.status}
              {participant.status === "invited" && " (pending)"}
            </span>
          </div>
          {canApprove && participant.status === "invited" && (
            <Button
              size="sm"
              onClick={() => onApprove?.(participant.member_id)}
              disabled={approvingMemberId === participant.member_id}
            >
              {approvingMemberId === participant.member_id ? "Approving..." : "Approve"}
            </Button>
          )}
        </div>
      ))}
    </Card>
  );
}
