import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold font-outfit text-center mb-4">
          Enhance your photos{" "}
          <span className="text-gold-600">faithfully</span>
        </h1>
        <p className="text-xl text-stone-500 text-center mb-12 font-inter">
          Restore what matters. Keep what&apos;s real.
        </p>

        {/* Drag-drop CTA (visual only) */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="border-2 border-dashed border-gold-600 rounded-lg p-12 text-center bg-charcoal-900 bg-opacity-5 hover:bg-opacity-10 transition">
            <div className="w-16 h-16 mx-auto mb-4 text-gold-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-charcoal-900 font-medium mb-2">
              Drag and drop your photo
            </p>
            <p className="text-stone-500 text-sm">
              Or choose from your computer
            </p>
          </div>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center">
            <h3 className="text-lg font-outfit font-semibold mb-3 text-charcoal-900">
              Edits, not beautification
            </h3>
            <p className="text-stone-500 text-sm">
              Creative control and restoration. No skin-lightening or body reshaping.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-outfit font-semibold mb-3 text-charcoal-900">
              One tool, many edits
            </h3>
            <p className="text-stone-500 text-sm">
              Chain edits with visible history. Build your perfect result step by step.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-outfit font-semibold mb-3 text-charcoal-900">
              Faithful restoration
            </h3>
            <p className="text-stone-500 text-sm">
              AI repairs damage without redrawing faces. Your identity stays yours.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-outfit font-bold text-center mb-12">
            Tools for every edit
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: "Enhance & Upscale", desc: "Sharpen and enlarge" },
              { name: "Fix Eyes", desc: "Red-eye and glare removal" },
              { name: "Retouch Skin", desc: "Blemish removal" },
              { name: "Remove Object", desc: "Paint and remove" },
              { name: "Relight", desc: "Adjust lighting naturally" },
              { name: "Background", desc: "Blur, replace, or remove" },
            ].map((tool) => (
              <div
                key={tool.name}
                className="p-4 bg-charcoal-900 bg-opacity-5 rounded border border-gold-600 border-opacity-20"
              >
                <h4 className="font-outfit font-semibold mb-1">
                  {tool.name}
                </h4>
                <p className="text-sm text-stone-500">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-gold-600 text-charcoal-900 font-semibold rounded hover:bg-gold-700 transition text-center"
          >
            Get Started Free
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 border-2 border-gold-600 text-gold-600 font-semibold rounded hover:bg-gold-600 hover:text-charcoal-900 transition text-center"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  )
}
