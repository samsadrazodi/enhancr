# AGENT BRIEF v2 — "Enhancr"
## AI-powered photo editor web app — clean rebuild

> **App brand name:** Enhancr
> **App Store title:** "Enhancr: Photo Restore"
> **Project folder:** `~/Desktop/enhancr/`
> **Logo direction:** single-letter "E" monogram with aperture/light motif

> **Read this file in full before taking any action.** This document is your
> single source of truth. Follow it exactly.

---

## 0. CRITICAL LESSONS — READ BEFORE WRITING ANY CODE

This is a rebuild. The first attempt failed due to infrastructure
issues. These rules are NON-NEGOTIABLE. Violating any of them will
break the project:

### 0.1 Technology constraints (hard rules)

1. **npm ONLY.** Do NOT use pnpm, yarn, or bun. pnpm's symlinked
   node_modules breaks Next.js 14's dev server path resolution.
2. **Next.js 14.0.4 ONLY.** Pin it exactly. Do NOT use 14.1.x,
   14.2.x, or any other version. Later versions have documented
   dev server bugs with middleware (#61134, #61105).
3. **NO route groups with parentheses.** Do NOT create folders
   named `(marketing)` or `(app)`. Use plain folder names only.
   Parentheses in paths break Next.js 14.0.4 + npm path resolution.
4. **NO husky.** Do NOT add husky, lint-staged, or any git hooks.
   No `prepare` script in package.json. Husky hangs npm install.
5. **Supabase client must be lazy-initialized.** Never create a
   Supabase client at module load time. Always use a getter function
   like `getSupabaseClient()` that initializes on first call. Module-
   level initialization blocks the build when env vars aren't present.
6. **Auth is email + password ONLY.** No magic links for login. No
   OTP. Users sign up with email + password, log in with email +
   password. "Confirm email" is OFF in Supabase. The ONLY place
   email-based auth links are used is "Forgot Password" which sends
   a password reset email.
7. **globals.css must be at `src/app/globals.css`** and imported in
   `src/app/layout.tsx` as `import "./globals.css"`. This is the
   only location Next.js 14 App Router processes Tailwind directives.
   Add a comment: `// CRITICAL: Do not remove — Tailwind breaks without this`
8. **After EVERY code change**, verify locally:
   ```
   rm -rf .next && npm run dev
   ```
   Confirm "Ready" appears within 30 seconds and the landing page
   renders with Tailwind styling (cream background, gold accents).
   Do NOT commit code that hasn't been verified this way.
9. **middleware.ts goes at project root** (`~/Desktop/enhancr/middleware.ts`),
   NOT inside `src/`. Next.js 14 requires this.
10. **Node.js 22+ recommended.** The owner has upgraded to Node 22.
    Do not add any Node 20-specific workarounds.

### 0.2 Verification checklist (run after every commit)

Before committing ANY code, run these and confirm all pass:
```bash
rm -rf .next
npm run lint
npm test
npm run build
npm run dev  # confirm "Ready" appears, then Ctrl+C
```

If any step fails, fix it before committing. Never commit broken code.

---

## 1. FIRST ACTIONS — project setup

### Step 1: Clean slate

Delete any existing project folder and create fresh:
```bash
rm -rf ~/Desktop/enhancr
mkdir -p ~/Desktop/enhancr
cd ~/Desktop/enhancr
```

### Step 2: Delete old GitHub repo and create fresh one

```bash
gh repo delete samsadrazodi/enhancr --yes 2>/dev/null || true
gh repo create enhancr --private --confirm
```

If `gh repo delete` fails (repo doesn't exist), that's fine — continue.

### Step 3: Initialize the project

```bash
cd ~/Desktop/enhancr

# Copy this file into the project root
# (owner will place AGENT_BRIEF.md here)

# Initialize git
git init
git branch -M main

# Create .gitignore
cat > .gitignore << 'GITIGNORE'
node_modules/
.next/
out/
.env
.env.local
.env.*.local
npm-debug.log*
.DS_Store
.vscode/
.idea/
coverage/
playwright-report/
test-results/
next-env.d.ts
GITIGNORE

# Create state tracking files
touch BUILD_STATE.md COMMIT_LOG.md
mkdir -p PHASE_NOTES SCRATCH

# Initial commit
git add -A
git commit -m "chore(init): project scaffolding and agent brief"

# Connect to GitHub
git remote add origin https://github.com/samsadrazodi/enhancr.git
git push -u origin main
```

### Step 4: Create `.env.local`

Create the file with placeholder values, then STOP and ask the owner
to fill in the real Supabase credentials:

```bash
cat > .env.local << 'ENV'
# Supabase (owner: replace these with real values)
NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_SUPABASE_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_SUPABASE_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_YOUR_SERVICE_ROLE_KEY_HERE

# Google Gemini API (Phase 4 — leave as placeholder for now)
GEMINI_API_KEY=placeholder

# Stripe (Phase 6 — leave as placeholder for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=placeholder
STRIPE_SECRET_KEY=placeholder
STRIPE_WEBHOOK_SECRET=placeholder

# App environment
NODE_ENV=development
ENV
```

**STOP HERE.** Tell the owner:
> "I've created .env.local with placeholder Supabase values. Please
> open a separate terminal and run `nano ~/Desktop/enhancr/.env.local`
> to replace the three PASTE_YOUR_* values with your real Supabase
> credentials from your Supabase dashboard (Settings → API).
> Tell me when done."

Wait for owner confirmation before proceeding.

---

## 2. CHECKPOINTED, RESUMABLE EXECUTION

This is a long autonomous build. Three things will happen:
1. **Session restarts** — terminal closes or new session starts later
2. **Usage limits** — you hit a cap mid-task
3. **Mid-session compaction** — context gets summarized and you lose detail

**Treat disk as your real memory.** If a fact matters for more than
10 minutes, it lives in a file, not in your head.

### 2.1 Memory-on-disk system

- **AGENT_BRIEF.md** (this file) — the plan. Check boxes as you go.
- **BUILD_STATE.md** — where you are right now. Update at every checkpoint.
- **COMMIT_LOG.md** — append-only log of every commit with rationale.
- **/PHASE_NOTES/phase-N.md** — one per phase, written at phase end.
- **/SCRATCH/current-task.md** — mid-task scratchpad. Write to it before
  starting any non-trivial task. Delete when task is done.

### 2.2 Session startup ritual

At the start of EVERY session:
1. Read `AGENT_BRIEF.md` in full
2. Read `BUILD_STATE.md` in full
3. Read last 20 entries of `COMMIT_LOG.md`
4. Read most recent `/PHASE_NOTES/phase-N.md`
5. Check if `/SCRATCH/current-task.md` exists — if so, read it
6. Run `git log --oneline -20` and `git status`
7. Run the test suite. If red, fix before anything else.
8. Post summary: current phase, last commit, next action.
9. Only then start working.

### 2.3 Session shutdown ritual

When stopping for any reason:
1. Commit all work (WIP commit is fine)
2. Update `BUILD_STATE.md`
3. Update `/PHASE_NOTES/phase-N.md`
4. Update `COMMIT_LOG.md`
5. Check boxes in section 7 of this file
6. Post final summary
7. Stop.

### 2.4 Compaction-proofing

1. **Write before you do.** Update `/SCRATCH/current-task.md` before
   starting any task.
2. **Trust files over memory.** If context and files disagree, files win.
3. **Re-read git log** at the start of any task depending on earlier work.
4. **Never rely on conversational memory** of owner preferences. Write
   preferences to BUILD_STATE.md under "Owner preferences."

### 2.5 Commit discipline

- Commit after every meaningful unit of work
- Conventional commits: `feat(editor): add mask brush`
- Never end a session with uncommitted changes
- After every commit, append to `COMMIT_LOG.md`

### 2.6 BUILD_STATE.md format

```markdown
# Build State
Last updated: <timestamp>
Last session summary: <2-3 sentences>

## Current phase
Phase: <number and name>
Status: not_started | in_progress | complete
Sub-step: <exact next action>

## Owner preferences
- npm only (no pnpm)
- Next.js 14.0.4 pinned
- No husky, no git hooks
- No route groups with parentheses
- Auth: email+password only, no magic links for login
- Confirm email: OFF in Supabase

## Open questions for owner
- <list or "none">

## Decisions log
- <date>: <decision>: <rationale>

## Known issues / tech debt
- <list or "none">
```

---

## 3. PROJECT CONTEXT

### 3.1 What this app is

A web-first AI photo editing tool using Google Gemini image models
(Nano Banana / Nano Banana 2) for all heavy image work. Deployed to
Vercel. Later: native iOS app.

### 3.2 Positioning — three pillars

1. **"Edits, not beautification."** No skin-lightening, no slimming, no
   body reshaping. Creative control and restoration over "make me look
   better."
2. **"One tool, many edits."** Chain edits with visible history, not
   one-shot flows.
3. **"Faithful restoration. Your memory stays yours."** AI repairs
   damage, doesn't redraw faces. The core differentiator — see section 5.3.

### 3.3 Design identity (approved in Phase 0 — do not change)

- **Palette:** Darkroom Precision — charcoal-900, gold-600, stone-500,
  cream-50. No gradient blobs.
- **Typography:** Inter (body), Outfit (display)
- **Logo:** Camera Aperture E monogram
- **Landing headline:** "Enhance your photos faithfully"
- **Sub-headline:** "Restore what matters. Keep what's real."

### 3.4 Accounts already set up by owner

- **Domain:** enhancr.app (Namecheap, WHOIS privacy on)
- **Supabase:** enhancr-dev project, email auth enabled, "Confirm email" OFF
- **GitHub:** samsadrazodi/enhancr (agent will recreate as empty private repo)
- **Vercel:** connected to GitHub repo, auto-deploy on push
- **Resend:** SMTP configured in Supabase (noreply@enhancr.app once DNS
  propagation completes; currently using onboarding@resend.dev)
- **USPTO:** "Enhancr" has zero live trademark conflicts

---

## 4. TECHNICAL STACK (locked — do not change)

- **Next.js 14.0.4** (pinned exactly)
- **TypeScript** (strict mode)
- **Tailwind CSS v3** (not v4)
- **shadcn/ui** components
- **Supabase** (auth, Postgres, Storage with RLS)
- **Stripe** (test mode — Phase 6)
- **Google Gemini API** (server-side only)
- **Vercel** deployment
- **Sharp** for server-side image processing
- **npm** as package manager (NOT pnpm)
- **No husky**, no lint-staged, no git hooks
- **No route groups** with parentheses in folder names
- **Vitest** for unit tests (use `--passWithNoTests` flag)
- **No browser localStorage** for user data

---

## 5. FEATURES

### 5.1 Auth (email + password)

**Signup:** `/auth/signup`
- Email, password, confirm password, terms checkbox
- `supabase.auth.signUp({ email, password })`
- After signup, redirect to `/app/account` immediately (no email confirmation)

**Login:** `/auth/login`
- Email, password, "Sign In" button
- `supabase.auth.signInWithPassword({ email, password })`
- Redirect to `/app/account` on success
- "Forgot password?" link below form

**Forgot Password:** `/auth/forgot-password`
- Email field, "Send Reset Link" button
- `supabase.auth.resetPasswordForEmail(email)`
- Supabase sends reset email via Resend SMTP

**Reset Password:** `/auth/reset-password`
- New password, confirm password
- `supabase.auth.updateUser({ password })`
- Redirect to `/auth/login` with success message

**Session:** httpOnly cookies, persist across refreshes.

**Middleware:** `middleware.ts` at project root protects `/app/*` routes.
Unauthenticated users get redirected to `/auth/login`.

### 5.2 Shared components

**Navbar:** (appears on every page via root layout)
- Left: "Enhancr" brand (links to /)
- Right (signed out): "Sign In" + "Sign Up"
- Right (signed in): "Editor" + "Account" + "Sign Out"
- Styled with Darkroom Precision palette
- Uses session context — MUST be inside SessionProvider in layout

**Footer:** (appears on every page via root layout)
- "Enhancr is an independent tool and is not affiliated with,
  endorsed by, or connected to any other photo editing service."
- Legal links (Terms, Privacy, Acceptable Use)
- © 2026 Enhancr

**Root layout structure (CRITICAL — get this right):**
```tsx
// CRITICAL: Do not remove — Tailwind breaks without this
import "./globals.css";

<html lang="en" className={`${inter.variable} ${outfit.variable}`}>
  <body>
    <SessionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </SessionProvider>
  </body>
</html>
```

SessionProvider MUST wrap both Navbar and children. Navbar uses
`useSession()` which requires SessionProvider as an ancestor.

### 5.3 v1 tools (Phase 4-5)

| Tool                  | API? | Notes                                                    |
|-----------------------|------|----------------------------------------------------------|
| Enhance & Upscale     | Yes  | Nano Banana 2 at 2K/4K, sharpen, denoise                |
| Fix Eyes              | Yes  | Red-eye, glare, iris sharpness. Optional mask.           |
| Retouch Skin          | Yes  | Blemish/spot only. No whitening, no slimming.            |
| Remove Object         | Yes  | User-painted mask.                                       |
| Faithful Restoration  | Yes  | Flagship — identity preservation. See 5.4.               |
| Relight               | Yes  | Natural-language lighting changes.                       |
| Background            | Yes  | Blur / replace / remove to transparent.                  |
| Smart Crop/Straighten | No   | Local only, client-side canvas.                          |

### 5.4 Faithful Restoration (the differentiator)

Every AI photo restorer in 2026 hallucinates: faces change, hair
changes, identity is lost. Enhancr solves this.

**A. Faithful Restoration tool:** heavily-constrained prompt that
forbids changes to faces, features, hairstyles, clothing, composition.
Permits only: scratch/crease removal, dust removal, fade correction,
noise reduction, resolution enhancement.

**B. Fidelity Mode:** global toggle, ON by default for restoration tools.
Augments prompts with identity-preservation constraints. `Enhancr-Fidelity`
EXIF tag on outputs.

**C. Three UI surfaces:**
1. Pixel-diff overlay (client-side canvas, highlights changed regions)
2. Confidence map with revert-by-painting brush
3. Persistent compare-to-original view in history panel

**D. Restoration Receipt:** PDF + JSON documenting original file hash,
tool used, model version, what changed and what was preserved. Free
for all users.

**E. Archival metadata mode:** opt-in XMP-dc / IPTC metadata for
genealogy software compatibility.

### 5.5 Subscription tiers

| Tier    | Price     | Daily edits | Max export | Watermark | History |
|---------|-----------|-------------|------------|-----------|---------|
| Free    | $0        | 3           | 1K         | Yes       | None    |
| Pro     | $7.99/mo  | 100         | 4K         | No        | 30 days |
| Studio  | $19.99/mo | 1000 (fair) | 4K + batch | No        | 90 days |

### 5.6 Pricing control plane

All tier definitions, limits, prices live in ONE place:
- `/lib/pricing/defaults.ts` — typed defaults, seeds DB
- `pricing_config` Supabase table — live overrides
- `pricing_config_history` — audit trail
- `getTier()` / `checkEntitlement()` — the only functions any code calls
- **No hardcoded limits anywhere.** If you see a magic number like `3`
  in enforcement code, it's a bug.

### 5.7 Admin dashboard (`/admin`)

Owner-only, web-only (never in iOS app). Protected by `is_admin` flag.
- Tier editor with diff preview and required "reason" string
- Feature flag editor
- User overrides (comp access, reset limits)
- Cost & revenue dashboard (Recharts)
- Stripe sync checker

### 5.8 Architecture

```
src/
  app/
    page.tsx               ← landing
    about/page.tsx
    auth/
      login/page.tsx
      signup/page.tsx
      forgot-password/page.tsx
      reset-password/page.tsx
    legal/
      terms/page.tsx
      privacy/page.tsx
      acceptable-use/page.tsx
    app/
      editor/page.tsx
      account/page.tsx
    admin/
      pricing/page.tsx
      features/page.tsx
      users/page.tsx
      metrics/page.tsx
      stripe/page.tsx
    api/
      auth/
        login/route.ts
        signup/route.ts
        signout/route.ts
        user/route.ts
        forgot-password/route.ts
      edit/route.ts
      stripe/webhook/route.ts
      admin/[...]/route.ts
  components/
    Navbar.tsx
    Footer.tsx
    /editor
    /admin
    /providers
      SessionProvider.tsx
    /ui
  lib/
    supabase.ts            ← lazy-initialized client
    gemini.ts
    prompts.ts
    stripe.ts
    rate-limit.ts
    content-filter.ts
    /pricing
      defaults.ts
      resolve.ts
      enforce.ts
    /flags
      index.ts
  types/
    index.ts
middleware.ts              ← PROJECT ROOT, not inside src/

AGENT_BRIEF.md
BUILD_STATE.md
COMMIT_LOG.md
PHASE_NOTES/
SCRATCH/
DESIGN.md
LEGAL.md
README.md
```

---

## 6. LEGAL / IP SAFETY (non-negotiable)

1. Do NOT reference or imitate any existing photo editor's design.
2. All UI copy must be original.
3. Visual identity must be distinct — Darkroom Precision palette.
4. Feature names are descriptive, not imitative.
5. Footer disclaimer on every page (section 5.2).
6. Every edited image gets an "AI-edited" EXIF comment tag.
7. Content policy screen before first edit.
8. No features that remove watermarks/signatures/copyright notices.

---

## 7. PHASE CHECKLIST

Work through in order. Mark `[x]` as you complete each item.
Do not start Phase N+1 until Phase N is fully checked and tests green.

### Phase 0 — Setup (ALREADY DONE — skip most of this)

Design decisions are already made. Do not re-propose.

- [x] App name: Enhancr
- [x] Color palette: Darkroom Precision
- [x] Typography: Inter + Outfit
- [x] Logo direction: Camera Aperture E
- [x] Landing headline: "Enhance your photos faithfully"
- [ ] Create BUILD_STATE.md with Phase 1: in_progress
- [ ] Create COMMIT_LOG.md with header
- [ ] Create PHASE_NOTES/phase-0.md
- [ ] Create DESIGN.md with approved design (copy from section 3.3)
- [ ] Commit and push

### Phase 1 — Repo scaffold

- [ ] Next.js 14.0.4 + TypeScript (strict) + Tailwind v3 + shadcn/ui
- [ ] **NO husky, NO lint-staged, NO prepare script**
- [ ] ESLint + Prettier configured (no husky hooks)
- [ ] Vitest configured with `--passWithNoTests`
- [ ] Folder structure per section 5.8
- [ ] Supabase client stub (lazy-initialized)
- [ ] Stripe client stub
- [ ] Gemini client stub
- [ ] README.md with setup steps (npm commands only)
- [ ] GitHub Actions CI: lint + test + build (npm ci, npm run lint, etc.)
- [ ] **Verify locally:** `rm -rf .next && npm run dev` → "Ready" appears,
      landing page renders with Tailwind styling
- [ ] Commit + push + confirm CI green
- [ ] Checkpoint

### Phase 2 — Landing + auth + legal

- [ ] Landing page with Darkroom Precision styling:
  - Hero: "Enhance your photos faithfully" headline with gold accent
  - Drag-drop upload CTA (visual only — functionality in Phase 3)
  - Three pillars section
  - Features grid
  - Footer with disclaimer
  - **Upload icon must have explicit size classes (w-16 h-16 or similar)**
- [ ] **Navbar** component (section 5.2) — inside SessionProvider in layout
- [ ] **Footer** component (section 5.2) — on every page
- [ ] **Root layout** exactly as specified in section 5.2 — SessionProvider
      wraps Navbar + children + Footer
- [ ] About page
- [ ] Legal pages (Terms, Privacy, Acceptable Use) — marked DRAFT
- [ ] Auth pages:
  - /auth/signup (email + password + confirm + terms)
  - /auth/login (email + password)
  - /auth/forgot-password (email → sends reset link)
  - /auth/reset-password (new password form)
- [ ] Auth API routes:
  - POST /api/auth/signup → supabase.auth.signUp
  - POST /api/auth/login → supabase.auth.signInWithPassword
  - POST /api/auth/signout → supabase.auth.signOut
  - GET /api/auth/user → supabase.auth.getUser
  - POST /api/auth/forgot-password → supabase.auth.resetPasswordForEmail
- [ ] Session middleware at project root (middleware.ts) — protects /app/*
- [ ] SessionProvider component — provides useSession() hook
- [ ] RLS policies: SQL migration files in /migrations/
- [ ] Error boundary files:
  - src/app/error.tsx ("use client" directive required)
  - src/app/not-found.tsx
  - src/app/global-error.tsx
- [ ] **Verify locally:**
  - `rm -rf .next && npm run dev` → "Ready"
  - ALL routes render with Tailwind styling (cream bg, gold accents):
    /, /about, /auth/login, /auth/signup, /auth/forgot-password,
    /legal/terms, /legal/privacy, /legal/acceptable-use
  - Refresh each page 3+ times — no errors
  - Sign up with email + password → lands on /app/account
  - Refresh /app/account → session persists
  - Sign out → sign in → works
  - Visit /app/editor in incognito → redirects to /auth/login
  - Navbar shows correct links for signed-in vs signed-out
  - Footer disclaimer present on every page
- [ ] Tests: landing renders, auth flow
- [ ] Commit + push + confirm CI green
- [ ] Checkpoint

### Phase 3 — Core editor shell

- [ ] /app/editor route with canvas, left toolbar, right action panel
- [ ] Upload component (drag-drop + file picker)
- [ ] Sharp-based server route for EXIF strip + PNG normalize + thumbnail
- [ ] Supabase Storage integration with RLS
- [ ] Local-only tool working: Smart Crop / Straighten
- [ ] Download button
- [ ] Tests: upload pipeline, storage RLS, crop tool
- [ ] **Verify locally:** upload a photo, crop it, download it
- [ ] Commit + push + CI green + checkpoint

### Phase 4 — First Gemini tool: Enhance & Upscale

- [ ] /api/edit route (server-side, auth-gated, rate-limited)
- [ ] /lib/gemini.ts wrapper with retries, timeouts, cost estimation
- [ ] /lib/prompts.ts with versioned Enhance template
- [ ] /lib/content-filter.ts with pre-flight checks
- [ ] /lib/rate-limit.ts with tier-aware limits
- [ ] End-to-end: upload → enhance → preview → download
- [ ] `edits` table in Supabase
- [ ] Error states: API failure, rate limit, content policy
- [ ] Tests: prompt builder, rate limiter, happy path
- [ ] Commit + push + CI green + checkpoint

### Phase 5 — Remaining tools + differentiator

**Standard tools (one sub-commit each):**
- [ ] Fix Eyes (mask brush component — reusable)
- [ ] Retouch Skin (blemish only — hard-coded in prompt)
- [ ] Remove Object (reuses mask brush)
- [ ] Relight (Creative category)
- [ ] Background: blur
- [ ] Background: replace with prompt (Creative category)
- [ ] Background: remove to transparent PNG

**The differentiator (section 5.4):**
- [ ] Faithful Restoration tool with constrained prompt
- [ ] Fidelity Mode global toggle (ON by default for restoration)
- [ ] Pixel-diff overlay (client-side canvas)
- [ ] Confidence map with revert-by-painting brush
- [ ] Persistent compare-to-original view
- [ ] Restoration Receipt generator (PDF + JSON)
- [ ] Archival metadata mode (XMP-dc / IPTC)
- [ ] `Enhancr-Fidelity` EXIF tag on outputs

**Tool separation:**
- [ ] Restore/Enhance and Creative tools visually separated in UI
- [ ] Creative tool outputs carry distinct EXIF tag

**Cross-cutting:**
- [ ] Edit history panel (list of applied edits per session)
- [ ] Tests for each tool's prompt builder and Fidelity Mode
- [ ] Commit + push + CI green + checkpoint

### Phase 6 — Monetization & pricing control plane

**Part A: Pricing source of truth**
- [ ] /lib/pricing/defaults.ts with typed tier definitions
- [ ] Supabase migration: pricing_config + pricing_config_history tables
- [ ] Seed script (idempotent)
- [ ] /lib/pricing/resolve.ts with getTier(), cache, invalidation
- [ ] /lib/pricing/enforce.ts with checkEntitlement()
- [ ] Refactor all code to use getTier() — NO hardcoded numbers
- [ ] Tests

**Part B: Admin dashboard**
- [ ] /admin/pricing — tier editor with diff + reason
- [ ] /admin/features — feature flag editor
- [ ] /admin/users — search, comp access, reset limits
- [ ] /admin/metrics — cost & revenue charts (Recharts)
- [ ] /admin/stripe — sync checker
- [ ] Admin auth: is_admin flag, re-auth, audit log
- [ ] Tests: non-admin gets 403, actions logged

**Part C: Stripe integration**
- [ ] Stripe products + prices (test mode)
- [ ] Checkout flow via getTier()
- [ ] Webhook handler (idempotent, signed)
- [ ] Customer portal
- [ ] Entitlements table
- [ ] Enforcement via checkEntitlement()
- [ ] Server-side watermarking for Free tier
- [ ] Pricing page (dynamic from getTier())
- [ ] Tests
- [ ] Commit + push + CI green + checkpoint

### Phase 7 — Polish + legal

- [ ] Finalize legal page content (still DRAFT pending lawyer)
- [ ] AI-edited EXIF tag on every output
- [ ] Footer disclaimer on every page (verify)
- [ ] LEGAL.md summarizing IP decisions
- [ ] Accessibility pass: keyboard nav, focus, reduced-motion, contrast
- [ ] Loading / empty / error states audit
- [ ] 404 and 500 pages
- [ ] Google OAuth (add to Supabase auth if desired)
- [ ] Connect enhancr.app domain to Vercel
- [ ] Update Resend sender to noreply@enhancr.app
- [ ] Commit + push + CI green + checkpoint

### Phase 8 — Observability + launch readiness

- [ ] Analytics: PostHog or Plausible
- [ ] Error tracking: Sentry
- [ ] Owner cost dashboard: daily edits, spend, per-tier breakdown
- [ ] README finalized with deploy guide
- [ ] LAUNCH_CHECKLIST.md:
  - Trademark filing
  - Lawyer review of ToS + Privacy
  - Gemini commercial-use quota
  - Stripe live mode + tax
  - Apple Developer prep
  - Content moderation policy
  - EU AI Act compliance review
- [ ] Commit + push + CI green + checkpoint

---

## 8. WORKING STYLE

- Small logical commits, clear messages, always-green.
- Stop and ask on real decision points. Don't guess.
- Push back on bad ideas in this brief. Bring evidence.
- Don't add dependencies without flagging.
- Never end a session with uncommitted work or stale state files.
- **After every refactor that moves/deletes files, verify:**
  1. `src/app/page.tsx` exists (homepage)
  2. `src/app/layout.tsx` imports `"./globals.css"` (Tailwind)
  3. `rm -rf .next && npm run dev` shows "Ready"
  4. Landing page renders with full styling

---

## 9. START HERE

1. Read this entire file.
2. Execute Section 1 (First Actions) steps 1-4 in order.
3. STOP after Step 4 and wait for owner to provide Supabase credentials.
4. After owner confirms credentials, continue with Phase 0 remaining
   items, then Phase 1.
5. At end of Phase 1, post summary and wait for approval.
6. Continue through phases, checkpointing at each one.

Go.
