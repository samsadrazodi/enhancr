# Phase 2 Work Plan

## Current task: Phase 2 — Landing + auth + legal

### Work order (logical dependencies)

#### 1. SessionProvider (foundation for all auth)
- [ ] src/components/providers/SessionProvider.tsx
- [ ] useSession() hook

#### 2. Auth API routes (backend)
- [ ] POST /api/auth/signup
- [ ] POST /api/auth/login
- [ ] POST /api/auth/signout
- [ ] GET /api/auth/user
- [ ] POST /api/auth/forgot-password

#### 3. Auth pages (frontend)
- [ ] /auth/signup page
- [ ] /auth/login page
- [ ] /auth/forgot-password page
- [ ] /auth/reset-password page

#### 4. Navbar component (needs SessionProvider)
- [ ] src/components/Navbar.tsx
- [ ] Session-aware nav links

#### 5. Footer component
- [ ] src/components/Footer.tsx
- [ ] Disclaimer text

#### 6. Update root layout
- [ ] Import SessionProvider
- [ ] Wrap with SessionProvider → Navbar → children → Footer

#### 7. Landing page enhancements
- [ ] Drag-drop CTA (visual only)
- [ ] Three pillars section
- [ ] Features grid

#### 8. Additional pages
- [ ] /about page
- [ ] /legal/terms page (DRAFT)
- [ ] /legal/privacy page (DRAFT)
- [ ] /legal/acceptable-use page (DRAFT)
- [ ] /app/account page (skeleton)
- [ ] /app/editor page (skeleton)

#### 9. Error boundaries
- [ ] src/app/error.tsx
- [ ] src/app/not-found.tsx
- [ ] src/app/global-error.tsx

#### 10. RLS policies
- [ ] /migrations/init.sql (Supabase RLS)

#### 11. Middleware update
- [ ] Ensure /app/* protection
- [ ] Update for new routes

#### 12. Tests & verification
- [ ] Landing page render test
- [ ] Auth flow test
- [ ] Local verification checklist
- [ ] npm run build
- [ ] npm run lint

#### 13. Commit & push
- [ ] Commit all Phase 2 work
- [ ] Push to GitHub
- [ ] Verify CI green
