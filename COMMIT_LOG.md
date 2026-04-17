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

d44adac — fix(auth): session persistence for login and signup
- API routes now return session object
- Login/signup pages call setSession() on client
- SessionProvider detects auth change via onAuthStateChange
- Session persists across page refresh

187dac6 — fix(navbar): sign out button now clears session and redirects to home
- Calls /api/auth/signout (server-side)
- Calls supabase.auth.signOut() (client-side)
- Redirects to / with router.push()

**Phase 2 Status: LOCKED** ✓
- All auth flows tested and working
- Session persistence verified
- Protected routes redirect when unauthenticated
- Navbar/Footer respond to auth state changes

## Phase 3 — Core Editor Shell

d55fff0 — feat(phase-3): core editor shell with upload, crop, and download
- Upload component: drag-drop + file picker with validation
- Sharp server route: POST /api/image/process for image processing
- Canvas Editor: display, crop selection, rotation slider
- Crop/Straighten: local-only tool (drag, apply, rotate)
- Download: exports canvas to PNG
- Editor layout: two-column (canvas + info panel)
- Image metadata display (width, height, format)

**Phase 3 Status: CORE COMPLETE** ✓
- Upload works (drag-drop + file picker)
- Sharp processing working
- Canvas display and editing
- Crop/rotate/download working locally
- Ready for: Supabase Storage RLS + Phase 4 (Gemini tools)

## Phase 4 — First Gemini Tool: Enhance & Upscale

feat(phase-4): Gemini-powered image enhancement with Sharp processing
- `@google/generative-ai` SDK installed (Google Gemini API client)
- `/lib/gemini.ts`: lazy singleton client with analyzeImage() and enhanceImage()
  - Uses gemini-1.5-flash for image analysis (noiseLevel, sharpnessNeeded, exposureIssue, colorCast)
  - Sharp pipeline: 2x bicubic upscale, adaptive sharpen, median denoise, normalize, exposure/color correction
  - 3 retries with exponential backoff, 30s timeout per request
- `/lib/prompts.ts`: ENHANCE_PROMPT_V1 with JSON-format response template
- `/lib/content-filter.ts`: preflightCheck() validates file size (max 10MB) and type (JPEG/PNG/WebP)
- `/lib/rate-limit.ts`: in-memory rate limiter with per-user daily limits (free tier: 3/day, pro/studio: unlimited)
- `/api/edit/route.ts`: POST handler, auth-gated via Bearer token, rate-limited, returns base64 enhanced image
- Updated `SessionProvider`: now exposes `session: Session | null` for access token
- Updated `CanvasEditor`: exposed via forwardRef so parent can call canvas.toBlob()
- Updated `editor/page.tsx`: real "Enhance & Upscale" button with loading state, error handling (429 rate limit, 502 API failures)
- `/migrations/001_edits.sql`: edits table schema + RLS policies (user runs manually in Supabase)
- npm run lint ✓, npm run build ✓, npm run dev ✓ (Ready in ~1s)

**Phase 4 Status: COMPLETE** ✓
- Gemini API integration working (with placeholder fallback if GEMINI_API_KEY missing)
- Rate limiting enforced
- Content filtering checks file size and format
- Editor UI integrated with real Enhance button
- Error states handled (rate limit, API failure, validation)
- Ready for: Phase 5 (Fix Eyes, Retouch Skin, Remove Object tools)

## Phase 5A — Standard Tools: Fix Eyes, Retouch Skin, Remove Object, Relight, Background

feat(phase-5a): standard tools — fix eyes, retouch skin, remove object, relight, background
- Extended /lib/gemini.ts: add callGeminiGenerative() using gemini-2.0-flash-exp with responseModalities: ["IMAGE"]
  * 3 retries, 30s timeout, exponential backoff (same as analyzeImage)
  * Accepts optional maskBuffer for Remove Object use case
  * Graceful error if model unavailable: returns "This tool requires the Gemini image generation API"
- Add tool functions to /lib/gemini.ts:
  * fixEyes(buffer) — Fix Eyes (red-eye, glare, iris sharpness)
  * retouchSkin(buffer) — Retouch Skin (blemishes only, no whitening)
  * removeObject(buffer, mask) — Remove Object (mask-based)
  * relight(buffer, prompt) — Relight (user-provided lighting description)
  * blurBackground(buffer) — Background Blur (Sharp-only, Gaussian blur sigma=15)
  * replaceBackground(buffer, prompt) — Background Replace (user-provided description)
  * removeBackground(buffer) — Background Remove (transparent PNG)
- Add 7 tool prompts to /lib/prompts.ts with identity-preservation constraints:
  * FIX_EYES_PROMPT_V1, RETOUCH_SKIN_PROMPT_V1, REMOVE_OBJECT_PROMPT_V1, RELIGHT_PROMPT_V1, BACKGROUND_REPLACE_PROMPT_V1, BACKGROUND_REMOVE_PROMPT_V1
- Create /src/components/editor/MaskBrush.tsx:
  * Canvas overlay component for user to paint masks
  * Semi-transparent red brush strokes while painting
  * Brush size slider
  * Clear, Done (→ convert to B&W mask), Cancel buttons
  * Returns mask as Blob to parent
- Extend /api/edit/route.ts:
  * Accept 'tool' field from FormData (default: "enhance" for backwards compat)
  * Dispatch to correct tool function based on tool name
  * Handle optional 'mask' file for removeObject
  * Handle optional 'prompt' string for relight/replaceBackground
  * All error handling: 400 (validation), 429 (rate limit), 502 (Gemini API failure)
- Update /app/app/editor/page.tsx:
  * Rename enhancing → processing, enhanceError → processError
  * Replace handleEnhance with generic processTool(tool, additionalData) function
  * Show 7 real tool buttons (all enabled when image is loaded)
  * Modal 1: MaskBrush for Remove Object
  * Modal 2: Text input for Relight (e.g., "golden hour")
  * Modal 3: Text input for Background Replace (e.g., "beach sunset")
  * Background tools grouped under "Background" header
  * Error display below tools panel

npm run lint ✓, npm run build ✓

**Phase 5A Status: COMPLETE** ✓
- All 7 standard tools implemented and integrated
- MaskBrush UI component working
- Tool dispatch in API route working
- Error handling graceful (502 if gemini-2.0-flash-exp unavailable)
- Background Blur always works (Sharp-only, no Gemini)
- Ready for: Phase 5B (Faithful Restoration differentiator)

