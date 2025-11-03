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

-- Profiles (extend auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
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
  created_by uuid references auth.users(id) on delete set null,
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
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('member','manager')),
  primary key (community_id, user_id)
);
create index if not exists idx_commembers_user on public.community_members(user_id);

-- Comments (polymorphic via subject_type + subject_id)
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
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

-- Enable row level security
alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.residencies enable row level security;
alter table public.community_members enable row level security;
alter table public.comments enable row level security;

-- Profile policies
create policy if not exists profiles_read on public.profiles
for select using (auth.role() = 'authenticated');

create policy if not exists profiles_insert_self on public.profiles
for insert with check (auth.uid() = id);

create policy if not exists profiles_update_self on public.profiles
for update using (auth.uid() = id);

create policy if not exists profiles_update_by_manager on public.profiles
for update using (
  exists (
    select 1 from public.community_members cm1
    join public.community_members cm2 on cm1.community_id = cm2.community_id
    where cm1.user_id = auth.uid()
      and cm1.role = 'manager'
      and cm2.user_id = profiles.id
  )
);

-- Community policies
create policy if not exists communities_read on public.communities
for select using (auth.role() = 'authenticated');

create policy if not exists communities_write_managers on public.communities
for all using (
  exists (
    select 1 from public.community_members cm
    where cm.community_id = communities.id
      and cm.user_id = auth.uid()
      and cm.role = 'manager'
  )
) with check (
  exists (
    select 1 from public.community_members cm
    where cm.community_id = communities.id
      and cm.user_id = auth.uid()
      and cm.role = 'manager'
  )
);

-- Residency policies
create policy if not exists residencies_read on public.residencies
for select using (auth.role() = 'authenticated');

create policy if not exists residencies_write_managers on public.residencies
for all using (
  exists (
    select 1 from public.community_members cm
    where cm.community_id = residencies.community_id
      and cm.user_id = auth.uid()
      and cm.role = 'manager'
  )
) with check (
  exists (
    select 1 from public.community_members cm
    where cm.community_id = residencies.community_id
      and cm.user_id = auth.uid()
      and cm.role = 'manager'
  )
);

-- Community member policies
create policy if not exists commembers_read on public.community_members
for select using (auth.role() = 'authenticated');

create policy if not exists commembers_write_mgr on public.community_members
for all using (
  exists (
    select 1 from public.community_members cm
    where cm.community_id = community_members.community_id
      and cm.user_id = auth.uid()
      and cm.role = 'manager'
  )
) with check (
  exists (
    select 1 from public.community_members cm
    where cm.community_id = community_members.community_id
      and cm.user_id = auth.uid()
      and cm.role = 'manager'
  )
);

-- Comment policies
create policy if not exists comments_read on public.comments
for select using (auth.role() = 'authenticated');

create policy if not exists comments_insert on public.comments
for insert with check (auth.role() = 'authenticated');

create policy if not exists comments_write_author on public.comments
for all using (author_id = auth.uid());

create policy if not exists comments_write_mgr_comm on public.comments
for all using (
  (subject_type in ('community','residency'))
  and exists (
    select 1 from public.community_members cm
    where cm.user_id = auth.uid()
      and cm.role = 'manager'
      and (
        (subject_type = 'community' and cm.community_id = subject_id)
        or (
          subject_type = 'residency' and cm.community_id = (
            select r.community_id from public.residencies r where r.id = subject_id
          )
        )
      )
  )
);

create policy if not exists comments_write_mgr_user on public.comments
for all using (
  subject_type = 'user'
  and exists (
    select 1 from public.community_members cm1
    join public.community_members cm2 on cm1.community_id = cm2.community_id
    where cm1.user_id = auth.uid()
      and cm1.role = 'manager'
      and cm2.user_id = subject_id
  )
);

-- Seed helpers
insert into public.communities (name, description, created_by)
values ('Evergreen Co-Living', 'A friendly urban co-living community.', auth.uid())
on conflict do nothing;

insert into public.residencies (community_id, name, description)
select id, 'Unit A', 'Two-bedroom unit'
from public.communities
where name = 'Evergreen Co-Living'
on conflict do nothing;

insert into public.community_members (community_id, user_id, role)
select id, auth.uid(), 'manager'
from public.communities
where name = 'Evergreen Co-Living'
on conflict do nothing;
