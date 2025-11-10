"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project, Residency } from "@/lib/db/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  communityId: string;
  residencies: Residency[];
  project?: Project | null;
  onSuccess?: (project: Project) => void;
}

export function ProjectForm({ open, onClose, communityId, residencies, project, onSuccess }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [residencyId, setResidencyId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heading = useMemo(() => (project ? "Edit project" : "Create project"), [project]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    setResidencyId(project?.residency_id ?? "");
    setError(null);
    setIsSubmitting(false);
  }, [open, project]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setError("Project name is required");
      setIsSubmitting(false);
      return;
    }
    const payload: Record<string, unknown> = {
      name: trimmedName,
      description: description.trim().length > 0 ? description.trim() : null,
      residency_id: residencyId ? residencyId : null,
    };
    let url = "/api/projects";
    let method: "POST" | "PATCH" = "POST";
    if (project) {
      url = `/api/projects/${project.id}`;
      method = "PATCH";
    } else {
      payload.community_id = communityId;
    }
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data?.error?.message ?? "Failed to save project");
      }
      onSuccess?.(data.data as Project);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-900/60 p-4 sm:items-center">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Project name
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Project name" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Description
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="What is this project about?"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Residency (optional)
            <Select value={residencyId} onChange={(event) => setResidencyId(event.target.value)}>
              <option value="">No residency</option>
              {residencies.map((residency) => (
                <option key={residency.id} value={residency.id}>
                  {residency.name}
                </option>
              ))}
            </Select>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : project ? "Save changes" : "Create project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
