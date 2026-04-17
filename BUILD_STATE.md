# Build State
Last updated: 2026-04-17
Last session summary: Phase 5A STANDARD TOOLS COMPLETE. 7 AI tools with Gemini generative API (gemini-2.0-flash-exp): Fix Eyes, Retouch Skin, Remove Object (with MaskBrush UI), Relight (text prompt), Background Blur (Sharp only), Background Replace/Remove (text prompt). Extended /api/edit route to dispatch per tool with optional mask/prompt fields. Editor UI shows all tool buttons + modals. Ready for Phase 5B (Faithful Restoration differentiator).

## Current phase
Phase: 5A — Standard tools: Fix Eyes, Retouch, Remove Object, Relight, Background
Status: complete
Sub-step: Ready for Phase 5B (Faithful Restoration, Fidelity Mode, diff overlay, compare view, Restoration Receipt)

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
