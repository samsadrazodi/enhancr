"use client"

import { useSession } from "@/components/providers/SessionProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-8">
          Account
        </h1>

        <div className="bg-white p-6 rounded border border-stone-300">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-stone-600">Email:</span>{" "}
              <span className="text-charcoal-900">{user.email}</span>
            </p>
            <p className="text-sm">
              <span className="text-stone-600">User ID:</span>{" "}
              <span className="text-charcoal-900 font-mono text-xs">
                {user.id}
              </span>
            </p>
          </div>
        </div>

        <p className="mt-12 text-stone-600 text-sm">
          Account features coming in Phase 3+
        </p>
      </div>
    </div>
  )
}
