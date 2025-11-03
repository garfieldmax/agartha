# Agartha Dashboard Scaffold

A minimal Next.js 15 (App Router) dashboard scaffold wired for Supabase auth and
Postgres data. It provides a clean starting point for building a prototype with
users, communities, and comments while keeping the architecture simple enough
for production hardening later.

## Features

- **Authentication** – Supabase magic-link sign-in that captures a display name
  for new users while keeping redirects and protected routes server-enforced.
  When Supabase auth isn't connected yet, the app automatically falls back to a
  read-only demo session so you can explore the dashboard immediately.
- **Dashboard shell** – Responsive top bar plus mobile/desktop tab navigation for
  Users and Communities sections.
- **Server-first data flow** – Server Components and Server Actions fetch and
  mutate data through the Supabase server client. `revalidatePath` keeps views
  up to date after mutations.
- **Typed utilities** – Small helpers for creating Supabase clients on the
  server and in interactive client components.
- **Health check** – `/api/health` endpoint for uptime monitoring.

## Project structure

```
app/
  layout.tsx                  # Root fonts + global styles
  page.tsx                    # Redirects to /dashboard
  not-found.tsx               # Minimal 404 screen
  (auth)/login/page.tsx       # Magic-link login form
  (dashboard)/dashboard/
    layout.tsx                # Dashboard shell and tabs
    page.tsx                  # Users tab redirect
    users/page.tsx            # Users list + search
    communities/page.tsx      # Communities list + search
components/
  communities/                # Community/residency cards & comments
  shell/                      # Top bar + tab navigation
  users/                      # User list + comments
actions/                      # Server actions for domain logic
lib/                          # Supabase helpers and auth utilities
public/                       # Static assets
```

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Create `.env.local` with your Supabase project keys:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The app is available at [http://localhost:3000](http://localhost:3000).

4. **Connect Supabase**

   - Apply the schema, enum, and RLS policies from `/supabase/schema.sql` (or
     adjust as needed for your project).
   - Configure email link auth in the Supabase dashboard so the login flow can
     send magic links.

   Until Supabase auth is wired up, visiting `/dashboard` shows the interface
   with seeded demo data and a banner indicating that you're in read-only mode.

## Database setup & seed data

Run the Supabase SQL script to provision tables, RLS policies, and starter
records. Execute it with the Supabase CLI or any Postgres client:

```bash
# Using the Supabase CLI (requires `supabase login` first)
supabase db execute --file supabase/schema.sql --project-ref <project-ref>

# Or with psql
psql "$SUPABASE_DB_URL" -f supabase/schema.sql
```

The seed block at the bottom of `supabase/schema.sql` adds a sample community,
residency, and manager membership for the current user.

## Deployment

Deploy the Next.js app to Vercel. Server Actions can run in the Node runtime
when Postgres driver access is required. Supabase handles authentication, row
level security, and data storage.

## Conventions

- Prefer Server Components and Actions for data reads/writes.
- Use `revalidatePath` after server mutations to refresh relevant routes.
- Keep UI components minimal and Tailwind-only; introduce heavier UI libraries
  only when necessary for the product.
