"use client";

import { useMemo, useState } from "react";
import type { Comment, Project, ProjectParticipation } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProjectRoster } from "@/components/ProjectRoster";
import { CommentsThread } from "@/components/CommentsThread";
import { GiveKudosModal } from "@/components/GiveKudosModal";

interface ProjectPageShellProps {
  viewerId: string | null;
  project: Project;
  participants: Array<ProjectParticipation>;
  comments: Comment[];
}

export function ProjectPageShell({ viewerId, project, participants, comments }: ProjectPageShellProps) {
  const [roster, setRoster] = useState(participants);
  const [commentList, setCommentList] = useState(comments);
  const [isKudosOpen, setIsKudosOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const isMember = useMemo(
    () => roster.some((participant) => participant.member_id === viewerId && participant.status === "active"),
    [roster, viewerId]
  );

  async function handleJoin() {
    if (!viewerId) return;
    const response = await fetch(`/api/projects/${project.id}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "contributor", status: "active" }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setToast(data?.error?.message ?? "Failed to join project");
      return;
    }
    setRoster((prev) => {
      const filtered = prev.filter((item) => !(item.member_id === viewerId && item.project_id === project.id));
      return [data.data, ...filtered];
    });
    setToast("Joined project");
  }

  async function handleLeave() {
    if (!viewerId) return;
    const response = await fetch(`/api/projects/${project.id}/leave`, { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setToast(data?.error?.message ?? "Failed to leave project");
      return;
    }
    setRoster((prev) => prev.filter((item) => !(item.member_id === viewerId && item.project_id === project.id)));
    setToast("Left project");
  }

  async function handleGiveKudos(payload: { weight: number; note?: string; projectId?: string | null }) {
    const response = await fetch("/api/kudos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to_member_id: project.created_by,
        project_id: project.id,
        weight: payload.weight,
        note: payload.note,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data?.error?.message ?? "Failed to send kudos");
    }
    setToast("Kudos sent");
  }

  async function handleComment(body: string) {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_type: "project", subject_ref: project.id, body }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data?.error?.message ?? "Failed to comment");
    }
    setCommentList((prev) => [data.data, ...prev]);
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
            {project.description && <p className="text-sm text-slate-600">{project.description}</p>}
          </div>
          {viewerId && (
            <div className="flex gap-2">
              {isMember ? (
                <Button variant="secondary" onClick={handleLeave}>
                  Leave project
                </Button>
              ) : (
                <Button onClick={handleJoin}>Join project</Button>
              )}
              <Button variant="ghost" onClick={() => setIsKudosOpen(true)}>
                Give Kudos
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500">Created by {project.created_by}</p>
      </Card>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Participants</h2>
        <ProjectRoster participants={roster} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
        <CommentsThread comments={commentList} onSubmit={viewerId ? handleComment : undefined} />
      </section>
      {toast && <div className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">{toast}</div>}
      <GiveKudosModal
        open={isKudosOpen}
        onClose={() => setIsKudosOpen(false)}
        projects={[{ id: project.id, name: project.name }]}
        onSubmit={handleGiveKudos}
      />
    </div>
  );
}
