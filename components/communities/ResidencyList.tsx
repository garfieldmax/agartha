import type { Residency } from "@/actions/residencies";
import { EntityComments } from "@/components/communities/EntityComments";

export function ResidencyList({ residencies }: { residencies: Residency[] }) {
  if (residencies.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-4 text-center text-sm text-slate-500">
        No residencies recorded.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {residencies.map((residency) => (
        <li key={residency.id}>
          <details className="overflow-hidden rounded-md border">
            <summary className="cursor-pointer select-none bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              <div className="flex items-center justify-between gap-3">
                <span>{residency.name}</span>
                <span className="text-xs text-slate-500">Open</span>
              </div>
            </summary>
            <div className="space-y-3 px-3 py-3 text-sm">
              {residency.description && (
                <p className="text-slate-600">{residency.description}</p>
              )}
              <div className="text-xs text-slate-500">
                Created {new Date(residency.created_at).toLocaleString()}
              </div>
              <EntityComments subjectId={residency.id} subjectType="residency" />
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
