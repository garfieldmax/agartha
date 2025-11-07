import { addComment, listComments } from "@/actions/comments";
import { getUser } from "@/lib/auth";

export async function EntityComments({
  subjectId,
  subjectType,
}: {
  subjectId: string;
  subjectType: "user" | "community" | "residency";
}) {
  const comments = await listComments(subjectType, subjectId);
  const user = await getUser();
  const canComment = Boolean(user);

  async function handleSubmit(formData: FormData) {
    "use server";
    const body = formData.get("body");
    if (typeof body !== "string") {
      return;
    }

    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }

    await addComment({
      subject_id: subjectId,
      subject_type: subjectType,
      body: trimmed,
    });
  }

  return (
    <div className="space-y-3">
      <form action={handleSubmit} className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Add comment
        </label>
        <textarea
          name="body"
          rows={3}
          className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Share a quick update"
          disabled={!canComment}
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!canComment}
        >
          Save
        </button>
        {!canComment && (
          <p className="text-xs text-slate-500">
            Sign in to add new notes. Without an authenticated Privy session the dashboard runs in read-only demo mode.
          </p>
        )}
      </form>
      <ul className="space-y-2 text-sm">
        {comments.length === 0 && (
          <li className="rounded border border-dashed p-3 text-slate-500">
            No comments yet.
          </li>
        )}
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-700"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">
                {comment.members?.display_name ?? "Unknown"}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {comment.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
