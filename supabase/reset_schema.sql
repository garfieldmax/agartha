-- Reset script: drops legacy tables/types and reapplies the current Agartha schema.
-- Usage (from repo root):
--   psql "$SUPABASE_DB_URL" -f supabase/reset_schema.sql
-- or via Supabase CLI:
--   supabase db execute --file supabase/reset_schema.sql --project-ref <ref>

begin;

-- Drop tables in dependency-safe order.
drop table if exists public.comments cascade;
drop table if exists public.member_connections cascade;
drop table if exists public.member_badges cascade;
drop table if exists public.badges cascade;
drop table if exists public.kudos cascade;
drop table if exists public.project_participation cascade;
drop table if exists public.projects cascade;
drop table if exists public.residencies cascade;
drop table if exists public.communities cascade;
drop table if exists public.member_goals cascade;
drop table if exists public.member_interests cascade;
drop table if exists public.interests cascade;
drop table if exists public.member_contacts cascade;
drop table if exists public.members cascade;

drop function if exists public.set_updated_at() cascade;

-- Drop enums (types) so they can be recreated fresh.
drop type if exists public.comment_subject cascade;
drop type if exists public.connection_status cascade;
drop type if exists public.connection_relation cascade;
drop type if exists public.badge_rarity cascade;
drop type if exists public.participation_status cascade;
drop type if exists public.project_role cascade;
drop type if exists public.goal_privacy cascade;
drop type if exists public.goal_status cascade;
drop type if exists public.interest_kind cascade;
drop type if exists public.contact_kind cascade;
drop type if exists public.member_level cascade;

commit;

-- Recreate the canonical schema.
\ir schema.sql
