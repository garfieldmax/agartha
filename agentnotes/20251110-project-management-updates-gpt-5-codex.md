# Project management updates

## Request Summary
- Add backend support for community managers to create, edit, and delete projects.
- Introduce a moderated join flow where requests require approval unless the member is already a resident.
- Surface UI for managers to manage projects and approve participants, plus a member-focused projects index tab in the header.

## Implementation Approach
- Extended the Supabase repository with `createProject`, `updateProject`, `deleteProject`, and `setProjectParticipationStatus` helpers and introduced dedicated Zod schemas for project create/update flows.
- Added REST handlers for project CRUD and participation approval, updating the join route to derive status server-side with the resident auto-approval rule.
- Built a reusable `ProjectForm` modal powering community-level creation and project-level editing, refreshed the `ProjectPageShell` for approvals/editing, and added a `/projects` index with navigation updates.
- Documented the new flows in the blueprints set and captured UI changes.

## Key Decisions
- Reused the same `ProjectForm` component for both creation and editing to keep validation and submission logic consistent.
- Gate project CRUD strictly behind community managers while allowing project leads to approve join requests to minimize new auth checks.
- Default join requests to `invited` status unless the member is level `resident` or `manager`, keeping the demo-friendly flow the user requested.

## Alternatives Considered
- Creating separate forms for create vs. edit was rejected to avoid duplicated client logic.
- Considered a general participation update endpoint but kept a dedicated approval route to simplify authorization and payload validation.

## Files Modified
- Added/updated API routes under `app/api/projects` for CRUD, joining, and approvals.
- Extended repository helpers and validators in `lib/db`.
- Updated UI components (`ProjectPageShell`, `ProjectRoster`, `SiteNav`, new `ProjectForm`, `ProjectListSection`) and created `/projects` index page.
- Refreshed documentation in `blueprints/*` and added a snapshot test for `ProjectRoster`.

## Blockers/Issues Encountered
- None. Existing repo patterns and auth helpers covered the new use cases without additional infrastructure.

## Follow-up Recommendations
- Consider adding a rejection/cancel flow for pending project invitations and surfacing approval history in the roster.
- Expand automated tests around the new API handlers once a testing harness for route handlers is established.
