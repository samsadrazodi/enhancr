# Phase 4 Notes — First Gemini Tool: Enhance & Upscale

## Summary
Phase 4 implements the first AI-powered editing tool: "Enhance & Upscale." The feature uses Google Gemini's `gemini-1.5-flash` model to analyze images and suggest enhancements, then applies those enhancements using Sharp for upscaling, sharpening, denoising, and exposure/color correction.

## Key Features
- **Gemini API Integration**: Image analysis via `gemini-1.5-flash` returns JSON with noiseLevel, sharpnessNeeded, exposureIssue, colorCast
- **Sharp Enhancement Pipeline**: 2x bicubic upscale, adaptive sharpen, median denoise, normalize, exposure/color correction
- **Rate Limiting**: Free tier limited to 3 enhancements per day; pro/studio tiers unlimited
- **Content Filtering**: File size (max 10MB) and format validation (JPEG, PNG, WebP)
- **Auth-Gated API**: `/api/edit` endpoint requires Bearer token; 401/429/502 error handling
- **UI Integration**: Real "Enhance & Upscale" button in editor with loading state and error messages

## Files Created
- `/src/lib/prompts.ts` — ENHANCE_PROMPT_V1 template with JSON response schema
- `/src/lib/content-filter.ts` — preflightCheck() for file validation
- `/src/lib/rate-limit.ts` — in-memory per-user rate limiter with daily reset
- `/src/app/api/edit/route.ts` — POST handler for enhancement requests
- `/migrations/001_edits.sql` — edits table schema + RLS policies (user must run in Supabase)

## Files Modified
- `/src/lib/gemini.ts` — replaced stub with real implementation (lazy singleton, retries, timeouts)
- `/src/components/providers/SessionProvider.tsx` — added `session: Session | null` to context
- `/src/components/CanvasEditor.tsx` — added forwardRef to expose canvas to parent
- `/src/app/app/editor/page.tsx` — added Enhance button, loading states, error handling

## Implementation Details

### Gemini Client (`/lib/gemini.ts`)
- Lazy-initialized singleton following the same pattern as Supabase and Stripe
- `analyzeImage()` calls `gemini-1.5-flash` with image base64 and prompt template
- `enhanceImage()` calls analyzeImage(), applies Sharp transforms based on results
- 3 retries with exponential backoff; 30s timeout per request
- Graceful error handling: throws descriptive error if GEMINI_API_KEY is missing/placeholder

### Sharp Pipeline
- **Upscale**: 2x via bicubic interpolation (highest quality)
- **Sharpen**: Adaptive based on noiseLevel analysis (0.8-1.5 sigma)
- **Denoise**: Median filter (2-3px radius) if noiseLevel > 30
- **Normalize**: Automatic level stretching
- **Exposure**: Brightness adjustment if exposureIssue detected
- **Color**: Saturation adjustment if colorCast detected

### Rate Limiting
- In-memory Map<userId, {count, resetAt}>
- Free tier: max 3 calls per 24h
- Pro/studio: unlimited
- Resets at 24h boundary per user
- Graceful degradation: free users see "Rate limit exceeded, resets at HH:MM" message

### Error Handling
- **400**: Content filter rejection (file size/format)
- **401**: Missing/invalid authorization header
- **429**: Rate limit exceeded (includes resetAt timestamp)
- **502**: Gemini API failure after 3 retries
- **500**: Unexpected server error

## Testing
- `npm run lint` ✓ (no ESLint errors)
- `npm run build` ✓ (no TypeScript errors, all routes compiled)
- `npm run dev` ✓ (Ready in ~974ms)
- Manual: Editor page loads, Enhance button visible, click triggers POST to /api/edit (requires real GEMINI_API_KEY to work)

## Notes for Future
- **Supabase edits table**: Migration file created but commented out in API route (table doesn't exist yet until user runs SQL). Uncomment once table is created.
- **Session exposure**: SessionProvider now provides `session: Session | null` for access token; this is required for auth-gated API routes like /api/edit.
- **Canvas ref forwarding**: CanvasEditor now uses forwardRef to expose canvas to parent; enables parent to call `canvas.toBlob()` for sending current image to APIs.
- **GEMINI_API_KEY**: Must be set in `.env.local` before Enhance feature works. Placeholder value shows graceful 502 error.

## Ready for Phase 5
- **Fix Eyes**: mask brush component (reusable for Fix Eyes, Retouch Skin, Remove Object)
- **Retouch Skin**: blemish/spot only, hard-coded prompt constraints
- **Remove Object**: user-painted mask
- **Relight**: natural-language lighting changes
- **Background tools**: blur, replace, remove to transparent

All tools follow the same pattern: analyze → apply Sharp transforms → return base64 → update UI.
