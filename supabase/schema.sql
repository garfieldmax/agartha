-- Enums
create type public.user_level as enum (
  'unchecked',
  'in_person_check',
  'guest',
  'resident',
  'community_manager'
);

create type public.comment_subject as enum (
  'user',
  'residency',
  'community'
);

-- Profiles (use Privy user IDs)
create table if not exists public.profiles (
  id text primary key,
  display_name text not null,
  avatar_url text,
  level public.user_level not null default 'unchecked',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_profiles_level on public.profiles(level);

-- Communities
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_communities_name on public.communities using gin (to_tsvector('simple', name));

-- Residencies (a community has many residencies)
create table if not exists public.residencies (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_residencies_community on public.residencies(community_id);

-- Community membership / roles
create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('member','manager')),
  primary key (community_id, user_id)
);
create index if not exists idx_commembers_user on public.community_members(user_id);

-- Comments (polymorphic via subject_type + subject_id)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id text not null,
  subject_type public.comment_subject not null,
  subject_id uuid not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists idx_comments_subject on public.comments(subject_type, subject_id);
create index if not exists idx_comments_author on public.comments(author_id);

-- Optional defaults on profile
alter table public.profiles
  add column if not exists default_community_id uuid references public.communities(id) on delete set null;
alter table public.profiles
  add column if not exists default_residency_id uuid references public.residencies(id) on delete set null;

-- Trigger helper for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_communities_updated
before update on public.communities
for each row execute function public.set_updated_at();

create trigger trg_residencies_updated
before update on public.residencies
for each row execute function public.set_updated_at();

create trigger trg_comments_updated
before update on public.comments
for each row execute function public.set_updated_at();

-- Disable row level security (using Privy auth handled in application code)
-- RLS policies depend on auth.uid() which doesn't work with Privy
alter table public.profiles disable row level security;
alter table public.communities disable row level security;
alter table public.residencies disable row level security;
alter table public.community_members disable row level security;
alter table public.comments disable row level security;

-- RLS policies removed - authorization handled in application code with Privy
-- All policies above depended on auth.uid() and auth.role() which don't work with Privy

-- Seed helpers (removed auth.uid() references - seed data should be created via application code)
-- Note: If you need to seed initial data, use a specific Privy user ID instead of auth.uid()
