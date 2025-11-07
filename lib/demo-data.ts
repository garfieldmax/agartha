import type { CommentWithAuthor } from "@/actions/comments";
import type { Community } from "@/actions/communities";
import type { Residency } from "@/actions/residencies";
import type { Profile } from "@/actions/users";

const NOW = new Date("2024-01-15T12:00:00.000Z");

export const DEMO_PROFILES: Profile[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    display_name: "Avery Johnson",
    avatar_url: null,
    level: "resident",
    created_at: NOW.toISOString(),
    updated_at: NOW.toISOString(),
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    display_name: "River Chen",
    avatar_url: null,
    level: "community_manager",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: NOW.toISOString(),
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    display_name: "Marin Ibarra",
    avatar_url: null,
    level: "guest",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: NOW.toISOString(),
  },
];

export const DEMO_COMMUNITIES: Community[] = [
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Evergreen Co-Living",
    description: "A friendly urban co-living hub with rotating residencies.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: NOW.toISOString(),
    created_by: "22222222-2222-4222-8222-222222222222",
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Harbor Collective",
    description: "Waterfront makerspace with artist residencies.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updated_at: NOW.toISOString(),
    created_by: "55555555-5555-5555-8555-555555555555",
  },
];

export const DEMO_RESIDENCIES: Residency[] = [
  {
    id: "66666666-6666-4666-8666-666666666666",
    community_id: "44444444-4444-4444-8444-444444444444",
    name: "Unit A",
    description: "Two-bedroom corner unit.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updated_at: NOW.toISOString(),
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    community_id: "44444444-4444-4444-8444-444444444444",
    name: "Studio Loft",
    description: "Sunny loft perfect for short stays.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updated_at: NOW.toISOString(),
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    community_id: "55555555-5555-4555-8555-555555555555",
    name: "Harbor Suite",
    description: "Open floor plan overlooking the marina.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updated_at: NOW.toISOString(),
  },
];

export const DEMO_COMMENTS: CommentWithAuthor[] = [
  {
    id: "99999999-9999-4999-8999-999999999999",
    subject_type: "community",
    subject_id: "44444444-4444-4444-8444-444444444444",
    author_id: "22222222-2222-4222-8222-222222222222",
    body: "Weekly dinner went great – lots of new faces and strong feedback.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: NOW.toISOString(),
    members: {
      display_name: "River Chen",
      avatar_url: null,
    },
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    subject_type: "residency",
    subject_id: "66666666-6666-4666-8666-666666666666",
    author_id: "11111111-1111-4111-8111-111111111111",
    body: "Guests loved the welcome basket – restocked for next arrival.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: NOW.toISOString(),
    members: {
      display_name: "Avery Johnson",
      avatar_url: null,
    },
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    subject_type: "user",
    subject_id: "33333333-3333-4333-8333-333333333333",
    author_id: "22222222-2222-4222-8222-222222222222",
    body: "Marin is confirming travel – follow up on Monday.",
    created_at: new Date(NOW.getTime() - 1000 * 60 * 30).toISOString(),
    updated_at: NOW.toISOString(),
    members: {
      display_name: "River Chen",
      avatar_url: null,
    },
  },
];

export const DEMO_USER = {
  id: "demo-user",
  email: "demo.viewer@example.com",
  user_metadata: {
    display_name: "Demo Viewer",
  },
};
