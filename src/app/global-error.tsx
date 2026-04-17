"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-cream-50 text-charcoal-900">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold font-outfit mb-4">
              Something went wrong
            </h1>
            <p className="text-stone-600 mb-8">
              A critical error occurred. Please refresh the page.
            </p>

            <button
              onClick={() => reset()}
              className="w-full py-2 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
