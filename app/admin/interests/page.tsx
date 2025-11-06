import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { listInterests, upsertInterest, deleteInterest, getMember } from "@/lib/db/repo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

async function assertAdmin() {
  const headerList = await headers();
  const viewerId = headerList.get("x-member-id");
  if (!viewerId) return null;
  const member = await getMember(viewerId);
  if (!member || member.level !== "manager") {
    return null;
  }
  return member;
}

export default async function AdminInterestsPage() {
  const admin = await assertAdmin();
  if (!admin) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card padding="sm" className="text-sm text-red-600">
          You must be a community manager to curate interests.
        </Card>
      </div>
    );
  }

  const interests = await listInterests();

  async function createInterest(formData: FormData) {
    "use server";
    const label = formData.get("label");
    const kind = formData.get("kind");
    if (typeof label !== "string" || label.trim().length === 0) return;
    if (typeof kind !== "string") return;
    await upsertInterest({ label: label.trim(), kind: kind as "hobby" | "skill" | "topic" });
    revalidatePath("/admin/interests");
  }

  async function removeInterest(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id !== "string") return;
    await deleteInterest(id);
    revalidatePath("/admin/interests");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Curate Interests</h1>
      <form action={createInterest} className="flex flex-wrap gap-3">
        <Input name="label" placeholder="Label" className="w-full max-w-xs" />
        <select name="kind" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="hobby">Hobby</option>
          <option value="skill">Skill</option>
          <option value="topic">Topic</option>
        </select>
        <Button type="submit">Add Interest</Button>
      </form>
      <Card padding="sm" className="space-y-3">
        {interests.map((interest) => (
          <form key={interest.id} action={removeInterest} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{interest.label}</p>
              <p className="text-xs text-slate-500">{interest.kind}</p>
            </div>
            <input type="hidden" name="id" value={interest.id} />
            <Button type="submit" variant="ghost">
              Remove
            </Button>
          </form>
        ))}
      </Card>
    </div>
  );
}
