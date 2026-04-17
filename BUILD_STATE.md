# Build State
Last updated: 2026-04-16
Last session summary: Phase 1 complete. Next.js 14.0.4 scaffold initialized with TypeScript strict mode, Tailwind v3, ESLint, Vitest. All verification checks pass: npm run lint ✓, npm run test ✓, npm run build ✓. Landing page renders with Darkroom Precision styling. Ready for Phase 2.

## Current phase
Phase: 1 — Repo scaffold
Status: complete
Sub-step: Awaiting approval before proceeding to Phase 2

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
