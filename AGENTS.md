# Agent Guidelines

This repository contains a minimal Next.js 15 dashboard scaffold backed by
Supabase. Follow these conventions when updating the codebase:

- Use **npm** for dependency management and scripts (`npm install`, `npm run lint`).
- Prefer **Server Components** and **Server Actions** for data fetching and
  mutations. Client components should remain lightweight and focused on UI
  interactions.
- Keep styling Tailwind-first—avoid introducing heavy component libraries unless
  a feature explicitly requires them.
- After server mutations, trigger the appropriate `revalidatePath` call to keep
  cached routes up to date.
- Organize shared utilities under `lib/`, domain-specific Server Actions under
  `actions/`, and UI elements under `components/`.
- When documenting changes, update `README.md` if developer workflows or project
  structure change.
