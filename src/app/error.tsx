"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-4">
          Oops!
        </h1>
        <p className="text-stone-600 mb-8">
          Something went wrong. Please try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-2 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="block w-full py-2 border-2 border-gold-600 text-gold-600 font-medium rounded hover:bg-gold-600 hover:text-charcoal-900 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
