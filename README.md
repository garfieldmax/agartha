# Agartha Dashboard Scaffold

A minimal Next.js 15 (App Router) dashboard scaffold wired for Privy authentication and
Supabase Postgres data. It provides a clean starting point for building a prototype with
users, communities, and comments while keeping the architecture simple enough
for production hardening later.

## Features

- **Authentication** – Privy login with email and wallet support. When Privy auth isn't connected yet, the app automatically falls back to a
  read-only demo session so you can explore the dashboard immediately.
- **Dashboard shell** – Responsive top bar plus mobile/desktop tab navigation for
  Users and Communities sections.
- **Server-first data flow** – Server Components and Server Actions fetch and
  mutate data through the Supabase server client. `revalidatePath` keeps views
  up to date after mutations.
- **Typed utilities** – Small helpers for Privy authentication and Supabase database access.
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

   Create `.env.local` with your Supabase and Privy credentials:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   PRIVY_APP_SECRET=your_privy_app_secret
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   The app is available at [http://localhost:3000](http://localhost:3000).

4. **Connect Supabase and Privy**

   - Apply the schema from `/supabase/schema.sql` (or
     adjust as needed for your project). Note that RLS is disabled - authorization is handled in application code.
   - Set up your Privy app at [privy.io](https://privy.io) and configure email/wallet login methods.
   - Add your Privy App ID and Secret to `.env.local`.

   Until Privy auth is wired up, visiting `/dashboard` shows the interface
   with seeded demo data and a banner indicating that you're in read-only mode.

## Database setup & seed data

Run the Supabase SQL script to provision tables. You can use the npm script:

```bash
# Set your database URL in .env.local
SUPABASE_DB_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# Apply the schema
npm run db:apply
```

Alternatively, use the Supabase CLI or psql directly:

```bash
# Using the Supabase CLI (requires `supabase login` first)
supabase db execute --file supabase/schema.sql --project-ref <project-ref>

# Or with psql
psql "$SUPABASE_DB_URL" -f supabase/schema.sql
```

The seed block at the bottom of `supabase/schema.sql` has been removed - seed data should be created via application code using Privy user IDs.

## Deployment

Deploy the Next.js app to Vercel. Server Actions can run in the Node runtime
when Postgres driver access is required. Privy handles authentication, while Supabase handles data storage.
Authorization is handled in application code rather than database-level RLS policies.

## Conventions

- Prefer Server Components and Actions for data reads/writes.
- Use `revalidatePath` after server mutations to refresh relevant routes.
- Keep UI components minimal and Tailwind-only; introduce heavier UI libraries
  only when necessary for the product.
