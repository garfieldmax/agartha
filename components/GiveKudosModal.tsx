"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";

interface GiveKudosModalProps {
  open: boolean;
  projects: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (payload: { projectId?: string | null; weight: number; note?: string }) => Promise<void>;
}

export function GiveKudosModal({ open, projects, onClose, onSubmit }: GiveKudosModalProps) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [weight, setWeight] = useState(1);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setProjectId(null);
      setWeight(1);
      setNote("");
      setIsSubmitting(false);
      setError(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ projectId, weight, note: note.trim() || undefined });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send kudos");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Give Kudos</h2>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Project (optional)
            <Select value={projectId ?? ""} onChange={(event) => setProjectId(event.target.value || null)}>
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Weight
            <Input
              type="number"
              min={1}
              max={5}
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            Note
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Kudos"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
