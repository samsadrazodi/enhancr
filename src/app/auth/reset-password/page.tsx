"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleHashFragment = async () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const supabase = getSupabaseClient()
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.hash
        )
        if (error) {
          setError("Invalid or expired reset link")
        }
      }
    }

    handleHashFragment()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError("All fields required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccess(true)
      setTimeout(() => router.push("/auth/login"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold font-outfit text-charcoal-900 mb-2">
          Set New Password
        </h1>
        <p className="text-stone-500 mb-8">Create your new password</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            Password reset successful. Redirecting to sign in...
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-900 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-stone-300 rounded text-charcoal-900 disabled:bg-stone-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-900 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-stone-300 rounded text-charcoal-900 disabled:bg-stone-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-stone-600">
          <Link href="/auth/login" className="text-gold-600 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
