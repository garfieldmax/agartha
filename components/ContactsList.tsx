import type { MemberContact } from "@/lib/db/types";
import { Card } from "@/components/ui/Card";

interface ContactsListProps {
  contacts: MemberContact[];
}

export function ContactsList({ contacts }: ContactsListProps) {
  if (contacts.length === 0) {
    return (
      <Card padding="sm" className="text-sm text-slate-500">
        No public contacts yet.
      </Card>
    );
  }

  return (
    <Card padding="sm" className="space-y-3">
      {contacts.map((contact) => (
        <div key={contact.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-slate-600">{contact.kind}</span>
          {contact.url ? (
            <a href={contact.url} target="_blank" rel="noreferrer" className="text-slate-900 underline">
              {contact.handle}
            </a>
          ) : (
            <span className="text-slate-500">{contact.handle}</span>
          )}
        </div>
      ))}
    </Card>
  );
}
