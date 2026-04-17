"use client"

import { useSession } from "@/components/providers/SessionProvider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function EditorPage() {
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
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-8">
          Editor
        </h1>

        <div className="bg-charcoal-900 bg-opacity-5 rounded border-2 border-dashed border-gold-600 p-20 text-center">
          <p className="text-stone-600">
            Editor interface coming in Phase 3
          </p>
        </div>
      </div>
    </div>
  )
}
