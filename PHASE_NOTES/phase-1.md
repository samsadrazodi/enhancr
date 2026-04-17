# Phase 1 — Repo Scaffold

**Status:** Complete
**Date:** 2026-04-16

## Summary

Successfully initialized Next.js 14.0.4 project with all required tooling and configuration. All verification checks pass.

## Checklist completion

- [x] Next.js 14.0.4 (pinned exactly to 14.0.4)
- [x] TypeScript strict mode enabled
- [x] Tailwind CSS v3 (not v4)
- [x] shadcn/ui foundation (class-variance-authority, clsx, lucide-react)
- [x] NO husky, NO lint-staged, NO prepare script
- [x] ESLint configured via `next lint`
- [x] Prettier configured (.prettierrc.json)
- [x] Vitest configured with `--passWithNoTests` flag
- [x] Correct folder structure:
  - src/app/ (pages)
  - src/components/ (includes providers/)
  - src/lib/ (supabase.ts, stripe.ts, gemini.ts, pricing/, flags/)
  - src/types/ (empty, ready for Phase 2+)
- [x] Supabase client stub (lazy-initialized with getSupabaseClient())
- [x] Stripe client stub (lazy-initialized with getStripeClient())
- [x] Gemini client stub (placeholder for Phase 4)
- [x] middleware.ts at project root (NOT in src/)
- [x] globals.css at src/app/globals.css with critical comment
- [x] Root layout with proper SessionProvider structure (prepared for Phase 2)
- [x] Landing page with Darkroom Precision styling:
  - Cream-50 background
  - Gold-600 accents
  - Charcoal-900 and stone-500 text
  - Outfit font for heading, Inter for body
- [x] README.md with npm-only setup instructions
- [x] GitHub Actions CI (.github/workflows/ci.yml):
  - npm ci
  - npm run lint
  - npm test
  - npm run build
- [x] Verification checklist:
  - `rm -rf .next && npm run dev` → "Ready" in 1852ms ✓
  - Landing page renders with correct Tailwind styling ✓
  - npm run lint passes with no warnings ✓
  - npm test passes (no tests, but --passWithNoTests flag works) ✓
  - npm run build succeeds with optimized output ✓

## Configuration notes

### Critical constraints maintained
1. **npm ONLY** — package.json uses npm, no pnpm/yarn/bun
2. **Next.js 14.0.4 pinned** — not 14.1.x, not 14.2.x (known dev server bugs in later versions)
3. **NO route groups** — folder structure uses plain names only
4. **NO husky** — ESLint runs via `npm run lint`, not pre-commit hooks
5. **Lazy Supabase client** — getSupabaseClient() function pattern prevents module-load-time initialization
6. **globals.css critical** — CRITICAL comment added, imported in layout.tsx
7. **middleware.ts at root** — NOT inside src/ (Next.js 14 requirement)

### TypeScript strict mode
All strict flags enabled:
- strict: true
- noImplicitAny: true
- strictNullChecks: true
- strictFunctionTypes: true
- noImplicitThis: true
- noUnusedLocals: true
- noUnusedParameters: true
- noImplicitReturns: true

### Build issues resolved
- Fixed unescaped apostrophe in JSX (React ESLint rule)
- Corrected Stripe API version from 2023-10-16 to 2023-08-16 (type compatibility)
- Removed vitest.config.ts (Vite version mismatch with vitest's bundled version)
- Adjusted tsconfig.json to allow Next.js-generated types in .next/types/

## Git state
- Main branch: clean, all changes committed
- Remote: GitHub repo synchronized
- Commits: 2 feature/chore commits in Phase 1

## Next steps
Phase 2 — Landing + auth + legal pages:
- Navbar component with session awareness
- Footer component with disclaimer
- SessionProvider in layout
- Auth pages: signup, login, forgot-password, reset-password
- Auth API routes
- Session middleware
- RLS policies
- Error boundaries
