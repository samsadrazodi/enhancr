const FREE_DAILY_LIMIT = 3
const IS_DEV = process.env.NODE_ENV === "development"

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  userId: string,
  tier: "free" | "pro" | "studio"
): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  // Skip rate limiting in development mode
  if (IS_DEV) {
    return { allowed: true, remaining: Infinity, resetAt: Date.now() + 24 * 60 * 60 * 1000 }
  }

  const now = Date.now()
  const entry = store.get(userId)

  if (!entry || now >= entry.resetAt) {
    return { allowed: true, remaining: tier === "free" ? FREE_DAILY_LIMIT : Infinity, resetAt: now + 24 * 60 * 60 * 1000 }
  }

  if (tier === "free") {
    const allowed = entry.count < FREE_DAILY_LIMIT
    const remaining = FREE_DAILY_LIMIT - entry.count
    return { allowed, remaining, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: Infinity, resetAt: entry.resetAt }
}

export function recordUsage(userId: string): void {
  const now = Date.now()
  const entry = store.get(userId)

  if (!entry || now >= entry.resetAt) {
    store.set(userId, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 })
  } else {
    entry.count += 1
  }
}
