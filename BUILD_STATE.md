# Build State
Last updated: 2026-04-16
Last session summary: Phase 2 LOCKED. All tests pass: signup ✓, login w/ persistence ✓, signout ✓, protected routes ✓, navbar updates ✓. Session management fixed (setSession on client after auth). Starting Phase 3 — Core editor shell: upload, Sharp processing, Supabase Storage, local crop tool.

## Current phase
Phase: 3 — Core editor shell
Status: in_progress
Sub-step: Initialize editor route, upload component, Sharp server route

## Owner preferences
- npm only (no pnpm, no yarn, no bun)
- Next.js 14.0.4 pinned exactly
- No husky, no git hooks
- No route groups with parentheses
- Auth: email+password only, no magic links for login
- Confirm email: OFF in Supabase
- Lazy-initialized Supabase client
- globals.css at src/app/globals.css with critical comment

## Open questions for owner
- None

## Decisions log
- 2026-04-16: Using npm as package manager (per AGENT_BRIEF rule 1)

## Known issues / tech debt
- None
