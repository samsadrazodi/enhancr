"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "./providers/SessionProvider"
import { getSupabaseClient } from "@/lib/supabase"

export function Navbar() {
  const { user, loading } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      })

      const supabase = getSupabaseClient()
      await supabase.auth.signOut()

      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <nav className="bg-charcoal-900 text-cream-50 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-outfit font-bold text-xl">
          Enhancr
        </Link>

        <div className="flex items-center gap-6">
          {loading ? (
            <div className="text-sm text-stone-400">Loading...</div>
          ) : user ? (
            <>
              <Link
                href="/app/editor"
                className="text-sm hover:text-gold-600 transition"
              >
                Editor
              </Link>
              <Link
                href="/app/account"
                className="text-sm hover:text-gold-600 transition"
              >
                Account
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm hover:text-gold-600 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm hover:text-gold-600 transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm px-4 py-2 bg-gold-600 text-charcoal-900 rounded hover:bg-gold-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
