"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword) {
      setError("All fields required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreed) {
      setError("You must agree to the terms")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Signup failed")
      }

      router.push("/app/account")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold font-outfit text-charcoal-900 mb-2">
          Create Account
        </h1>
        <p className="text-stone-500 mb-8">Join Enhancr to start editing</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-stone-300 rounded text-charcoal-900 disabled:bg-stone-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-900 mb-1">
              Password
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm text-stone-600">
              I agree to the{" "}
              <Link href="/legal/terms" className="text-gold-600 hover:underline">
                terms
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-stone-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
