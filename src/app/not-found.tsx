import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-4">
          404
        </h1>
        <p className="text-stone-600 mb-8">
          Page not found
        </p>

        <Link
          href="/"
          className="inline-block py-2 px-8 bg-gold-600 text-charcoal-900 font-medium rounded hover:bg-gold-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
