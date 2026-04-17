interface FilterResult {
  allowed: boolean
  reason?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function preflightCheck(file: { size: number; type: string }): FilterResult {
  if (file.size > MAX_FILE_SIZE) {
    return { allowed: false, reason: "File too large (max 10MB)" }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { allowed: false, reason: "Unsupported format. Use JPEG, PNG, or WebP." }
  }

  return { allowed: true }
}
