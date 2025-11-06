"use client";

import { useState } from "react";
import type {
  Comment,
  Interest,
  Kudos,
  Member,
  MemberBadge,
  MemberContact,
  MemberGoal,
  ProjectParticipation,
} from "@/lib/db/types";
import { ProfileCard } from "@/components/ProfileCard";
import { ContactsList } from "@/components/ContactsList";
import { BadgesList } from "@/components/BadgesList";
import { InterestsChips } from "@/components/InterestsChips";
import { GoalsList } from "@/components/GoalsList";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { GiveKudosModal } from "@/components/GiveKudosModal";
import { ConnectSheet } from "@/components/ConnectSheet";
import { CommentsThread } from "@/components/CommentsThread";
import { KudosFeed } from "@/components/KudosFeed";

interface MemberProfileShellProps {
  viewerId: string | null;
  member: Member;
  contacts: MemberContact[];
  badges: MemberBadge[];
  interests: Interest[];
  goals: MemberGoal[];
  kudos: Kudos[];
  comments: Comment[];
  participations: ProjectParticipation[];
  mutuals: Member[];
}

export function MemberProfileShell({
  viewerId,
  member,
  contacts,
  badges,
  interests,
  goals,
  kudos,
  comments,
  participations,
  mutuals,
}: MemberProfileShellProps) {
  const [kudosList, setKudosList] = useState(kudos);
  const [goalsList, setGoalsList] = useState(goals);
  const [bio, setBio] = useState(member.bio ?? "");
  const [newGoal, setNewGoal] = useState({ title: "", privacy: "public" as "public" | "private" });
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isKudosOpen, setIsKudosOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [commentsList, setCommentsList] = useState(comments);
  const isSelf = viewerId === member.id;

  const projectsForKudos = Array.from(
    new Map(
      participations.map((participation) => [
        participation.project_id,
        {
          id: participation.project_id,
          name: participation.project?.name ?? "Project",
        },
      ])
    ).values()
  );

  async function handleGiveKudos(payload: { projectId?: string | null; weight: number; note?: string }) {
    const response = await fetch("/api/kudos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to_member_id: member.id,
        project_id: payload.projectId,
        weight: payload.weight,
        note: payload.note,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data?.error?.message ?? "Failed to send kudos");
    }
    setKudosList((prev) => [data.data, ...prev]);
    setToast("Kudos sent!");
  }

  async function handleConnect(payload: { relation: "follow" | "friend" | "collaborator" }) {
    const response = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to_member_id: member.id, relation: payload.relation }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data?.error?.message ?? "Failed to send connection");
    }
    setToast("Connection request sent");
  }

  async function handleBioSave() {
    setIsSavingBio(true);
    setToast(null);
    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to update bio");
      }
      setToast("Profile updated");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSavingBio(false);
    }
  }

  async function handleAddGoal(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/members/${member.id}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newGoal.title,
        privacy: newGoal.privacy,
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      setToast(data?.error?.message ?? "Failed to add goal");
      return;
    }
    setGoalsList((prev) => [data.data, ...prev]);
    setNewGoal({ title: "", privacy: "public" });
    setToast("Goal added");
  }

  async function handleComment(body: string) {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_type: "member", subject_ref: member.id, body }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data?.error?.message ?? "Failed to comment");
    }
    setCommentsList((prev) => [data.data, ...prev]);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="space-y-4">
        <ProfileCard
          member={{ ...member, bio }}
          mutuals={mutuals}
          isSelf={isSelf}
          onGiveKudos={viewerId ? () => setIsKudosOpen(true) : undefined}
          onConnect={viewerId && viewerId !== member.id ? () => setIsConnectOpen(true) : undefined}
        />
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Contacts</h3>
            <ContactsList contacts={contacts.filter((contact) => contact.is_public || isSelf)} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Badges</h3>
            <BadgesList badges={badges} />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Bio</h2>
            {isSelf && (
              <Button size="sm" onClick={handleBioSave} disabled={isSavingBio}>
                {isSavingBio ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
          {isSelf ? (
            <Textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} />
          ) : (
            <Card padding="sm" className="text-sm text-slate-600">
              {bio || "No bio yet."}
            </Card>
          )}
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Interests</h2>
          <InterestsChips interests={interests} />
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Goals</h2>
            {isSelf && (
              <form className="flex items-center gap-2" onSubmit={handleAddGoal}>
                <Input
                  placeholder="New goal"
                  value={newGoal.title}
                  onChange={(event) => setNewGoal((prev) => ({ ...prev, title: event.target.value }))}
                />
                <select
                  className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
                  value={newGoal.privacy}
                  onChange={(event) =>
                    setNewGoal((prev) => ({ ...prev, privacy: event.target.value as "public" | "private" }))
                  }
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <Button type="submit" size="sm" disabled={!newGoal.title.trim()}>
                  Add
                </Button>
              </form>
            )}
          </div>
          <GoalsList goals={goalsList} showPrivate={isSelf} />
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Active Projects</h2>
          {participations.length === 0 ? (
            <Card padding="sm" className="text-sm text-slate-500">
              Not currently active on projects.
            </Card>
          ) : (
            <Card padding="sm" className="space-y-3">
              {participations.map((participation) => (
                <div key={participation.project_id} className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {participation.project?.name ?? participation.project_id}
                  </p>
                  <p className="text-xs text-slate-500">Role: {participation.role}</p>
                </div>
              ))}
            </Card>
          )}
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Kudos Received</h2>
          <KudosFeed kudos={kudosList} />
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
          <CommentsThread comments={commentsList} onSubmit={viewerId ? handleComment : undefined} />
        </section>
        {toast && (
          <div className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white">{toast}</div>
        )}
      </div>
      <GiveKudosModal
        open={isKudosOpen}
        projects={projectsForKudos}
        onClose={() => setIsKudosOpen(false)}
        onSubmit={handleGiveKudos}
      />
      <ConnectSheet
        open={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        onSubmit={handleConnect}
      />
    </div>
  );
}
