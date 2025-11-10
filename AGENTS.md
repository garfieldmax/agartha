# Agent Guidelines

This project implements the Nostra Community members platform prototype using Next.js 15
(App Router) with Tailwind styling, Supabase Postgres for persistence, and Privy
for authentication. Keep these conventions in mind when making changes:

- Use **npm** for scripts and dependency management (`npm install`, `npm run lint`,
  `npm test`).
- Prefer **Server Components** for top-level routes and compose them from the
  shared UI primitives in `components/` (e.g., `components/ui/*`). Client
  components should focus on interactive pieces such as sheets, modals, and
  editors.
- Server-side mutations should live in App Router route handlers under `app/api`
  and must validate input with the Zod schemas in `lib/db/validators.ts`, verify
  Privy auth via `lib/auth/privy.ts`, and enforce authorization/budget helpers
  from `lib/authz` and `lib/kudos`.
- Keep database access funneled through the thin repository in `lib/db/repo.ts`
  with table definitions in `lib/db/types.ts`. Update the schema documentation
  (`blueprints/data.MD`) and Supabase SQL (`supabase/schema.sql`) if the data model changes.
- After mutating server data, call `revalidatePath` for affected routes to keep
  caches fresh.
- Maintain unit tests in `tests/` (Vitest) when updating utility logic, and add
  snapshot coverage for UI components where it improves confidence.
- Update the documentation set (`README.md`, `blueprints/flow.md`, `blueprints/ui.md`) whenever feature
  flows or surface areas change.

## Documentation

AI agents must maintain comprehensive documentation of both implemented systems and their own reasoning processes. Structure documentation as follows:

### blueprints/ - Implemented System Documentation

This directory contains detailed descriptions of **implemented** features and systems. Update these files when modifying existing features or implementing new major systems:

**Existing blueprint files:**
- `data.md` - Database schema, table definitions, and data model relationships
- `flow.md` - End-to-end product flows and feature interactions
- `ui.md` - UI/UX patterns, component architecture, and design decisions
- `setup.md` - Environment setup, configuration, and deployment

**Guidelines for blueprints:**
- Update relevant blueprint files whenever you modify an implemented feature
- Create new blueprint files for major new systems or architectural additions
- Include: purpose, architecture overview, key file paths, integration points, and flow diagrams
- Focus on "what is" rather than "what could be" - document reality, not possibilities
- Keep entries actionable and specific with file paths and code references

**Example update scenarios:**
- Adding a new API route → Update `flow.md` with the new flow
- Changing database schema → Update `data.md` and reference `supabase/schema.sql`
- Adding new component patterns → Update `ui.md` with usage examples

### agentnotes/ - Agent Reasoning and Decision Logs

This directory preserves agent context, reasoning, and decision-making for future reference. These are **permanent historical records** that help maintain project continuity across different agents and sessions.

**File naming convention:**
```
YYYYMMDD-brief-description-agentname.md
```

**Examples:**
- `20251110-add-auth-flow-sonnet.md`
- `20251110-refactor-kudos-budget-chatgpt.md`
- `20251115-implement-badge-system-composer.md`

**Required content structure:**
```markdown
# [Brief Task Description]

## Request Summary
[What was asked, key requirements]

## Implementation Approach
[High-level approach taken, architectural decisions]

## Key Decisions
[Important choices made and why]

## Alternatives Considered
[Other approaches evaluated and why they were not chosen]

## Files Modified
[List of files created/modified with brief description]

## Blockers/Issues Encountered
[Any challenges, workarounds, or technical debt created]

## Follow-up Recommendations
[Suggestions for future improvements or related work]
```

**When to create agent notes:**
- Complex multi-file refactoring or architectural changes
- Implementing new major features (3+ related files)
- Making non-obvious technical decisions that require context
- Encountering and resolving significant blockers
- When your reasoning would help future agents understand "why"

**When NOT to create agent notes:**
- Simple bug fixes or typo corrections
- Trivial one-line changes
- Routine maintenance tasks
- Changes fully documented in git commits

### Integration with Existing Workflow

When completing tasks:
1. **During implementation:** Update relevant `blueprints/` files as you modify features
2. **After complex tasks:** Create an `agentnotes/` entry documenting your reasoning
3. **Always:** Update `README.md` if user-facing features or setup steps change

Line 24 reference now includes: Update `README.md`, `blueprints/*`, and create `agentnotes/` entries for significant work.

Follow these practices to keep the prototype cohesive and aligned with the
current architecture.
