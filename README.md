# Enhancr: Photo Restore

AI-powered photo editing web app. Faithful restoration with identity preservation.

## Setup

### Prerequisites
- Node.js 20+ (22+ recommended)
- npm (NOT pnpm, yarn, or bun)

### Install dependencies
```bash
npm install
```

### Configure environment
Edit `.env.local` with your Supabase and other API credentials:
```bash
nano .env.local
```

### Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Run production server
- `npm run lint` — Run ESLint
- `npm test` — Run tests (Vitest)

## Tech Stack

- **Framework:** Next.js 14.0.4
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3
- **Auth:** Supabase
- **Payment:** Stripe
- **AI:** Google Gemini API
- **Testing:** Vitest

## Project Structure

```
src/
  app/               — Next.js App Router pages
  components/        — Reusable UI components
  lib/               — Utilities (Supabase, Stripe, Gemini, etc.)
  types/             — TypeScript type definitions
middleware.ts        — Auth and routing middleware
```

## Important Notes

- **NO husky or git hooks** — Commits are not pre-validated
- **NO pnpm** — Use npm only
- **NO route groups** — Plain folder names only
- **Tailwind CRITICAL** — globals.css must be imported in layout.tsx

## License

© 2026 Enhancr. All rights reserved.
