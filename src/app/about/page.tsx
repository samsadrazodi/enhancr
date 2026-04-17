import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold font-outfit text-charcoal-900 mb-8">
          About Enhancr
        </h1>

        <div className="space-y-6 text-stone-600 font-inter">
          <p>
            Enhancr is a photo editing tool built on a simple principle:{" "}
            <strong>faithful restoration over beautification</strong>.
          </p>

          <p>
            Every photo editor in 2026 uses AI that hallucinates. Faces change.
            Hair changes. Identity is lost. That&apos;s not enhancement—that&apos;s
            alteration.
          </p>

          <p>
            Enhancr is different. Our tools repair damage without redrawing your
            face. They sharpen without smoothing away detail. They restore without
            replacing.
          </p>

          <h2 className="text-2xl font-outfit font-semibold text-charcoal-900 mt-10 mb-4">
            Our Commitment
          </h2>

          <ul className="space-y-2 list-disc list-inside">
            <li>No skin-lightening. No body reshaping. No identity erasure.</li>
            <li>Your edits stay visible. No hidden changes.</li>
            <li>
              Your data stays yours. No training on your photos.
            </li>
            <li>Your memory stays yours. Faithful restoration always.</li>
          </ul>

          <p className="mt-8">
            Made with care by a small team committed to tools that respect your
            photos.
          </p>

          <p className="mt-8">
            <Link href="/" className="text-gold-600 hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
