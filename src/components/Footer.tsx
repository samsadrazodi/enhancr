import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-50 py-8 px-6 mt-16">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-sm text-stone-400 leading-relaxed">
          Enhancr is an independent tool and is not affiliated with, endorsed
          by, or connected to any other photo editing service.
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <Link href="/legal/terms" className="hover:text-gold-600 transition">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-gold-600 transition">
            Privacy
          </Link>
          <Link
            href="/legal/acceptable-use"
            className="hover:text-gold-600 transition"
          >
            Acceptable Use
          </Link>
        </div>

        <div className="border-t border-stone-700 pt-6 text-xs text-stone-500">
          © 2026 Enhancr. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
