import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { listBadges, upsertBadge, deleteBadge, getMember } from "@/lib/db/repo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

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

export default async function AdminBadgesPage() {
  const admin = await assertAdmin();
  if (!admin) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <Card padding="sm" className="text-sm text-red-600">
          You must be a community manager to manage badges.
        </Card>
      </div>
    );
  }

  const badges = await listBadges();

  async function createBadge(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const slug = formData.get("slug");
    const rarity = formData.get("rarity");
    const description = formData.get("description");
    if (typeof name !== "string" || name.trim().length === 0) return;
    if (typeof slug !== "string" || slug.trim().length === 0) return;
    if (typeof rarity !== "string") return;
    await upsertBadge({
      name: name.trim(),
      slug: slug.trim(),
      rarity: rarity as "common" | "uncommon" | "rare" | "epic" | "legendary",
      description: typeof description === "string" && description.length > 0 ? description : null,
    });
    revalidatePath("/admin/badges");
  }

  async function removeBadge(formData: FormData) {
    "use server";
    const id = formData.get("id");
    if (typeof id !== "string") return;
    await deleteBadge(id);
    revalidatePath("/admin/badges");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Manage Badges</h1>
      <form action={createBadge} className="grid gap-3 md:grid-cols-2">
        <Input name="name" placeholder="Name" />
        <Input name="slug" placeholder="Slug" />
        <select name="rarity" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
        <Textarea name="description" rows={3} placeholder="Description" className="md:col-span-2" />
        <Button type="submit" className="md:col-span-2 w-full md:w-auto">
          Save Badge
        </Button>
      </form>
      <Card padding="sm" className="space-y-3">
        {badges.map((badge) => (
          <form key={badge.id} action={removeBadge} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{badge.name}</p>
              <p className="text-xs text-slate-500">{badge.rarity}</p>
            </div>
            <input type="hidden" name="id" value={badge.id} />
            <Button type="submit" variant="ghost">
              Remove
            </Button>
          </form>
        ))}
      </Card>
    </div>
  );
}
