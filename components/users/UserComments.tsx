import { EntityComments } from "@/components/communities/EntityComments";

export function UserComments({ userId }: { userId: string }) {
  return <EntityComments subjectId={userId} subjectType="user" />;
}
