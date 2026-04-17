# Commit Log

## Phase 0 — Design & Setup

c3ff00b — chore(init): project scaffolding and agent brief
- Initial repo with AGENT_BRIEF, .gitignore, state tracking files

30861b1 — chore(phase-0): design system and state tracking
- BUILD_STATE.md, COMMIT_LOG.md, PHASE_NOTES/phase-0.md, DESIGN.md

## Phase 1 — Repo Scaffold

02ee52f — feat(phase-1): initialize Next.js 14.0.4 scaffold with TypeScript, Tailwind, ESLint
- Next.js 14.0.4 (pinned exactly), TypeScript strict mode
- Tailwind CSS v3, shadcn/ui foundation
- ESLint + Prettier configured (NO husky)
- Folder structure: src/app, src/components, src/lib, src/types
- Lazy-initialized Supabase, Stripe, Gemini client stubs
- Middleware at project root (NOT in src/)
- globals.css at src/app/globals.css with critical comment
- Landing page with Darkroom Precision palette (cream bg, gold accents)
- GitHub Actions CI: lint, test, build

be87b58 — fix(phase-1): ESLint, Stripe API version, build configuration
- Fixed unescaped apostrophe in landing page
- Updated Stripe API version to 2023-08-16 (compatible)
- Removed vitest.config.ts (Vite version conflict)
- Updated tsconfig.json (removed rootDir conflict)
- Added jsdom dev dependency
- All verification checks pass ✓

854f685 — docs(phase-1): update state tracking and phase notes
- BUILD_STATE.md, COMMIT_LOG.md, PHASE_NOTES/phase-1.md

## Phase 2 — Landing + Auth + Legal

91a3767 — feat(phase-2): landing, auth, legal pages and components
- Enhanced landing page: three pillars, features grid, drag-drop CTA (visual)
- SessionProvider with useSession() hook (context-based)
- Auth API routes: signup, login, signout, user, forgot-password
- Auth pages: signup, login, forgot-password, reset-password
- Navbar component (session-aware)
- Footer component (disclaimer)
- About page
- Legal pages: terms, privacy, acceptable-use (DRAFT)
- Protected /app/* pages: account, editor (with auth checks)
- Error boundaries: error.tsx, not-found.tsx, global-error.tsx
- Root layout: SessionProvider wraps Navbar, children, Footer
- Updated middleware for /app/* protection
- npm run lint ✓, npm run build ✓, npm run dev ✓

